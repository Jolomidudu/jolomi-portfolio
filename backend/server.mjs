import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import express from "express";
import { neon } from "@neondatabase/serverless";

const app = express();
const port = Number(process.env.PORT || 3001);
const sessionLifetimeSeconds = 60 * 60 * 8;
const validServices = new Set([
  "Technology Strategy & Advisory",
  "ICT / IT Leadership Consulting",
  "Digital Transformation",
  "Software Architecture",
  "Web Application Development",
  "Mobile Application Development",
  "Product Design / UI/UX",
  "Backend & API Engineering",
  "Cloud & IT Infrastructure",
  "Cybersecurity / IT Security Assessment",
  "Data Analytics & BI",
  "AI & Business Automation",
  "Project / Technology Management",
  "IT Coaching / Executive Technology Training",
  "Technical Due Diligence / IT Audit",
]);
const validCountryCodes = new Set(["+234", "+233", "+254", "+27", "+44", "+1", "+61", "+91"]);
const validExperienceLevels = new Set(["beginner", "intermediate", "advanced"]);
const validLearningFormats = new Set(["online", "in-person", "flexible"]);
const validBlogCategories = new Set([
  "Technology",
  "Business",
  "Finance",
  "Lifestyle",
  "Data Analytics",
  "Cloud & DevOps",
  "Cybersecurity",
  "Digital Marketing",
  "Business Development",
  "Product Design",
  "Other",
]);
const loginAttempts = new Map();
let sql;
let learningTracks = [];

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
app.use((request, _response, next) => {
  request.sql = sql;
  next();
});

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (typeof password !== "string" || typeof storedHash !== "string") return false;
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const expected = pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return safeEqual(expected, hash);
}

function generateLearnerPassword() {
  return randomBytes(12).toString("base64url").replace(/[-_]/g, "").slice(0, 12);
}

function createLearnerSession(account) {
  const payload = Buffer.from(JSON.stringify({
    id: account.id,
    email: account.email,
    fullName: account.full_name ?? account.fullName,
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
  })).toString("base64url");
  const signature = createHmac("sha256", process.env.LEARNING_SESSION_SECRET || process.env.PORTAL_SESSION_SECRET || "jolomi-learning-dev-secret")
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

function getLearnerSession(token) {
  if (typeof token !== "string") return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;

  const expected = createHmac("sha256", process.env.LEARNING_SESSION_SECRET || process.env.PORTAL_SESSION_SECRET || "jolomi-learning-dev-secret")
    .update(payload)
    .digest("base64url");
  if (!safeEqual(signature, expected)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.email || !session.id || session.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

async function ensureLearningAccount(enrollmentId, fullName, email) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const accountRecord = await sql`
    SELECT id, enrollment_id AS "enrollmentId", full_name AS "fullName", email, password_hash AS "passwordHash", status
    FROM learning_accounts
    WHERE enrollment_id = ${enrollmentId}
    LIMIT 1
  `;
  const [existingAccount] = accountRecord;
  if (existingAccount) {
    return { account: existingAccount, isNew: false };
  }

  const password = generateLearnerPassword();
  const passwordHash = hashPassword(password);
  const [created] = await sql`
    INSERT INTO learning_accounts (enrollment_id, full_name, email, password_hash, status)
    VALUES (${enrollmentId}, ${fullName}, ${normalizedEmail}, ${passwordHash}, 'active')
    RETURNING id, enrollment_id AS "enrollmentId", full_name AS "fullName", email, status
  `;

  return { account: created, password, isNew: true };
}

function requireInternalKey(request, response, next) {
  const expected = process.env.RAILWAY_INTERNAL_API_KEY;
  if (!expected || !safeEqual(request.get("x-internal-api-key") || "", expected)) {
    return response.status(401).json({ error: "Unauthorized." });
  }
  next();
}

function createSession(email) {
  const payload = Buffer.from(JSON.stringify({
    email,
    expiresAt: Math.floor(Date.now() / 1000) + sessionLifetimeSeconds,
  })).toString("base64url");
  const signature = createHmac("sha256", process.env.PORTAL_SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

function getSession(token) {
  if (typeof token !== "string") return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;

  const expected = createHmac("sha256", process.env.PORTAL_SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  if (!safeEqual(signature, expected)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const adminEmail = process.env.PORTAL_ADMIN_EMAIL?.trim().toLowerCase();
    if (!adminEmail || session.email !== adminEmail || session.expiresAt <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function requireAdmin(request, response, next) {
  const authorization = request.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const session = getSession(token);
  if (!session) return response.status(401).json({ error: "Please sign in again." });
  request.admin = session;
  next();
}

function readProjectRequest(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const value = (field, maxLength) =>
    typeof body[field] === "string" ? body[field].trim().slice(0, maxLength) : "";

  const enquiry = {
    service: value("service", 100),
    description: value("description", 5000),
    startDate: value("startDate", 10),
    firstName: value("firstName", 100),
    lastName: value("lastName", 100),
    email: value("email", 254),
    countryCode: value("countryCode", 5),
    phone: value("phone", 10),
  };
  const startDate = new Date(`${enquiry.startDate}T00:00:00.000Z`);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(enquiry.startDate)
    && !Number.isNaN(startDate.getTime())
    && startDate.toISOString().slice(0, 10) === enquiry.startDate;

  if (
    !validServices.has(enquiry.service)
    || !enquiry.description
    || !validDate
    || !enquiry.firstName
    || !enquiry.lastName
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)
    || !validCountryCodes.has(enquiry.countryCode)
    || !/^\d{10}$/.test(enquiry.phone)
  ) {
    return null;
  }

  return enquiry;
}

function readBlogPost(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const value = (field, maxLength) =>
    typeof body[field] === "string" ? body[field].trim().slice(0, maxLength) : "";
  const post = {
    title: value("title", 180),
    slug: value("slug", 120).toLowerCase(),
    category: value("category", 60),
    description: value("description", 500),
    content: value("content", 50000),
    status: value("status", 20),
  };

  if (
    !post.title
    || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)
    || !validBlogCategories.has(post.category)
    || !post.description
    || !post.content
    || !["draft", "published"].includes(post.status)
  ) {
    return null;
  }

  return post;
}

function readLearningRegistration(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const value = (field, maxLength) =>
    typeof body[field] === "string" ? body[field].trim().slice(0, maxLength) : "";
  const registration = {
    requestId: value("requestId", 36),
    trackId: value("trackId", 2),
    paymentPlan: value("paymentPlan", 10),
    fullName: value("fullName", 160),
    email: value("email", 254).toLowerCase(),
    phone: value("phone", 30),
    country: value("country", 100),
    timeZone: value("timeZone", 100),
    experienceLevel: value("experienceLevel", 20),
    background: value("background", 2000),
    goals: value("goals", 3000),
    preferredTime: value("preferredTime", 200),
    preferredStart: value("preferredStart", 40),
    learningFormat: value("learningFormat", 20),
    guardianName: value("guardianName", 160),
    guardianEmail: value("guardianEmail", 254).toLowerCase(),
    guardianPhone: value("guardianPhone", 30),
    isAdult: body.isAdult === true,
    acceptedTerms: body.acceptedTerms === true,
    acceptedPrivacy: body.acceptedPrivacy === true,
  };
  const allowedDays = new Set(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
  const preferredDays = Array.isArray(body.preferredDays)
    ? [...new Set(body.preferredDays.filter((day) => typeof day === "string" && allowedDays.has(day)))]
    : [];

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(registration.requestId)
    || !learningTracks.some(({ id }) => id === registration.trackId)
    || !["deposit", "full"].includes(registration.paymentPlan)
    || !registration.fullName
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.email)
    || !registration.phone
    || !registration.country
    || !registration.timeZone
    || !validExperienceLevels.has(registration.experienceLevel)
    || !registration.goals
    || !preferredDays.length
    || !registration.preferredTime
    || !registration.preferredStart
    || !validLearningFormats.has(registration.learningFormat)
    || !registration.acceptedTerms
    || !registration.acceptedPrivacy
    || (!registration.isAdult && (
      !registration.guardianName
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.guardianEmail)
      || !registration.guardianPhone
    ))
  ) {
    return null;
  }

  return { ...registration, preferredDays };
}

const blogPostFields = `
  id, slug, category, title, description, content, status,
  created_at AS "createdAt", updated_at AS "updatedAt"
`;

app.get("/health", (_request, response) => response.json({ status: "ok" }));

app.use("/api", requireInternalKey);

app.post("/api/auth/login", (request, response) => {
  const adminEmail = process.env.PORTAL_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.PORTAL_ADMIN_PASSWORD;
  const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
  const password = typeof request.body?.password === "string" ? request.body.password : "";

  if (!adminEmail || !adminPassword || !process.env.PORTAL_SESSION_SECRET) {
    return response.status(503).json({ error: "Portal authentication is not configured." });
  }

  const clientIp = (request.get("x-client-ip") || "unknown").slice(0, 64);
  const attemptKey = `${clientIp}:${email}`;
  const now = Date.now();
  const previousAttempts = loginAttempts.get(attemptKey);
  if (previousAttempts && previousAttempts.resetAt > now && previousAttempts.count >= 5) {
    return response.status(429).json({ error: "Too many sign-in attempts. Try again in 15 minutes." });
  }
  const attempts = previousAttempts && previousAttempts.resetAt > now
    ? previousAttempts
    : { count: 0, resetAt: now + 15 * 60 * 1000 };
  attempts.count += 1;
  loginAttempts.set(attemptKey, attempts);

  if (!safeEqual(email, adminEmail) || !safeEqual(password, adminPassword)) {
    return response.status(401).json({ error: "Email or password is incorrect." });
  }

  loginAttempts.delete(attemptKey);
  return response.json({ token: createSession(adminEmail), expiresIn: sessionLifetimeSeconds });
});

app.post("/api/learning/login", async (request, response) => {
  const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
  const password = typeof request.body?.password === "string" ? request.body.password : "";

  if (!email || !password) {
    return response.status(400).json({ error: "Enter your learning email and password." });
  }

  try {
    const [account] = await request.sql`
      SELECT id, full_name AS "fullName", email, password_hash AS "passwordHash", status
      FROM learning_accounts
      WHERE email = ${email}
      LIMIT 1
    `;

    if (!account || account.status !== "active" || !verifyPassword(password, account.passwordHash)) {
      return response.status(401).json({ error: "Your learning email or password is incorrect." });
    }

    return response.json({
      token: createLearnerSession(account),
      expiresIn: 60 * 60 * 12,
      user: {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
      },
    });
  } catch (error) {
    console.error("Failed to sign in learner account:", error);
    return response.status(500).json({ error: "The learning portal is unavailable. Please try again later." });
  }
});

app.get("/api/learning/me", async (request, response) => {
  const authorization = request.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const session = getLearnerSession(token);

  if (!session) {
    return response.status(401).json({ error: "Please sign in again." });
  }

  try {
    const [account] = await request.sql`
      SELECT id, full_name AS "fullName", email
      FROM learning_accounts
      WHERE id = ${Number(session.id)}
      LIMIT 1
    `;

    if (!account) {
      return response.status(401).json({ error: "Your learning account could not be found." });
    }

    return response.json({
      user: {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
      },
    });
  } catch (error) {
    console.error("Failed to load learner session:", error);
    return response.status(500).json({ error: "The learning portal is unavailable. Please try again later." });
  }
});

app.post("/api/enquiries", async (request, response) => {
  const enquiry = readProjectRequest(request.body);
  if (!enquiry) return response.status(400).json({ error: "Please check the project enquiry details." });

  try {
    const [saved] = await request.sql`
      INSERT INTO project_enquiries (
        service, description, start_date, first_name, last_name,
        email, country_code, phone
      ) VALUES (
        ${enquiry.service}, ${enquiry.description}, ${enquiry.startDate},
        ${enquiry.firstName}, ${enquiry.lastName}, ${enquiry.email},
        ${enquiry.countryCode}, ${enquiry.phone}
      )
      RETURNING id, created_at AS "createdAt", status
    `;
    return response.status(201).json({ enquiry: saved });
  } catch (error) {
    console.error("Failed to save project enquiry:", error);
    return response.status(500).json({ error: "We couldn't save your enquiry. Please try again." });
  }
});

app.get("/api/enquiries", requireAdmin, async (request, response) => {
  try {
    const enquiries = await request.sql`
      SELECT
        id, service, description, start_date AS "startDate",
        first_name AS "firstName", last_name AS "lastName", email,
        country_code AS "countryCode", phone, status,
        created_at AS "createdAt"
      FROM project_enquiries
      ORDER BY created_at DESC
      LIMIT 200
    `;
    return response.json({ enquiries });
  } catch (error) {
    console.error("Failed to load project enquiries:", error);
    return response.status(500).json({ error: "Unable to load enquiries." });
  }
});

app.get("/api/enquiries/:id", requireAdmin, async (request, response) => {
  const id = request.params.id;
  if (!/^\d+$/.test(id)) return response.status(400).json({ error: "Invalid enquiry ID." });

  try {
    const [enquiry] = await request.sql`
      SELECT
        id, service, description, start_date AS "startDate",
        first_name AS "firstName", last_name AS "lastName", email,
        country_code AS "countryCode", phone, status,
        created_at AS "createdAt"
      FROM project_enquiries
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!enquiry) return response.status(404).json({ error: "Enquiry not found." });
    return response.json({ enquiry });
  } catch (error) {
    console.error("Failed to load project enquiry:", error);
    return response.status(500).json({ error: "Unable to load this enquiry." });
  }
});

app.post("/api/learning/enrollments", async (request, response) => {
  const registration = readLearningRegistration(request.body);
  if (!registration) return response.status(400).json({ error: "Check the registration details and try again." });

  const track = learningTracks.find(({ id }) => id === registration.trackId);
  try {
    const [enrollment] = await request.sql`
      INSERT INTO learning_enrollments (
        request_id, track_id, track_title, payment_plan, full_name, email, phone,
        country, time_zone, experience_level, background, goals, preferred_days,
        preferred_time, preferred_start, learning_format, is_adult, guardian_name, guardian_email,
        guardian_phone, accepted_terms, accepted_privacy
      ) VALUES (
        ${registration.requestId}, ${track.id}, ${track.title}, ${registration.paymentPlan},
        ${registration.fullName}, ${registration.email}, ${registration.phone},
        ${registration.country}, ${registration.timeZone}, ${registration.experienceLevel},
        ${registration.background}, ${registration.goals}, ${JSON.stringify(registration.preferredDays)}::jsonb,
        ${registration.preferredTime}, ${registration.preferredStart}, ${registration.learningFormat}, ${registration.isAdult},
        ${registration.guardianName || null}, ${registration.guardianEmail || null},
        ${registration.guardianPhone || null}, ${registration.acceptedTerms}, ${registration.acceptedPrivacy}
      )
      ON CONFLICT (request_id) DO UPDATE SET
        track_id = EXCLUDED.track_id, track_title = EXCLUDED.track_title,
        payment_plan = EXCLUDED.payment_plan, full_name = EXCLUDED.full_name,
        email = EXCLUDED.email, phone = EXCLUDED.phone, country = EXCLUDED.country,
        time_zone = EXCLUDED.time_zone, experience_level = EXCLUDED.experience_level,
        background = EXCLUDED.background, goals = EXCLUDED.goals,
        preferred_days = EXCLUDED.preferred_days, preferred_time = EXCLUDED.preferred_time,
        learning_format = EXCLUDED.learning_format, is_adult = EXCLUDED.is_adult,
        guardian_name = EXCLUDED.guardian_name, guardian_email = EXCLUDED.guardian_email,
        guardian_phone = EXCLUDED.guardian_phone,
        accepted_terms = EXCLUDED.accepted_terms, accepted_privacy = EXCLUDED.accepted_privacy,
        updated_at = NOW()
      RETURNING id, status, payment_plan AS "paymentPlan", track_id AS "trackId"
    `;
    return response.status(201).json({ enrollment });
  } catch (error) {
    console.error("Failed to save learning registration:", error);
    return response.status(500).json({ error: "Unable to save this registration." });
  }
});

app.post("/api/learning/enrollments/:id/payments", async (request, response) => {
  const enrollmentId = request.params.id;
  const reference = typeof request.body?.reference === "string" ? request.body.reference : "";
  if (!/^\d+$/.test(enrollmentId) || !/^jolomi-learning-\d+-[0-9a-f-]{8,36}$/i.test(reference)) {
    return response.status(400).json({ error: "Invalid enrollment or payment reference." });
  }

  try {
    const [enrollment] = await request.sql`
      SELECT id, track_id AS "trackId", track_title AS "trackTitle", payment_plan AS "paymentPlan",
             full_name AS "fullName", email, status
      FROM learning_enrollments WHERE id = ${enrollmentId} LIMIT 1
    `;
    if (!enrollment) return response.status(404).json({ error: "Registration not found." });
    if (enrollment.status === "enrolled") return response.status(409).json({ error: "This enrollment is already paid in full." });

    const track = learningTracks.find(({ id }) => id === enrollment.trackId);
    const amount = enrollment.paymentPlan === "full" ? track.totalAmount : track.depositAmount;
    const [payment] = await request.sql`
      INSERT INTO learning_enrollment_payments (enrollment_id, reference, amount, payment_plan)
      VALUES (${enrollmentId}, ${reference}, ${amount}, ${enrollment.paymentPlan})
      RETURNING id, reference, amount
    `;
    return response.status(201).json({ payment, enrollment });
  } catch (error) {
    if (error?.code === "23505") return response.status(409).json({ error: "That payment attempt already exists." });
    console.error("Failed to prepare learning payment:", error);
    return response.status(500).json({ error: "Unable to prepare this payment." });
  }
});

app.post("/api/learning/payments/:reference/confirm", async (request, response) => {
  const reference = request.params.reference;
  const enrollmentId = typeof request.body?.enrollmentId === "string" ? request.body.enrollmentId : "";
  const amountKobo = request.body?.amountKobo;
  const providerEmail = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
  if (!/^jolomi-learning-\d+-[0-9a-f-]{8,36}$/i.test(reference) || !/^\d+$/.test(enrollmentId) || !Number.isSafeInteger(amountKobo)) {
    return response.status(400).json({ error: "Invalid verified payment details." });
  }

  try {
    const [payment] = await request.sql`
      SELECT p.id, p.amount, p.status AS "paymentStatus", e.id AS "enrollmentId",
             e.payment_plan AS "paymentPlan", e.email, e.full_name AS "fullName"
      FROM learning_enrollment_payments p
      JOIN learning_enrollments e ON e.id = p.enrollment_id
      WHERE p.reference = ${reference} AND e.id = ${enrollmentId}
      LIMIT 1
    `;
    if (!payment) return response.status(404).json({ error: "Payment attempt not found." });
    if (Number(payment.amount) * 100 !== amountKobo || payment.email !== providerEmail) {
      return response.status(400).json({ error: "Verified payment does not match this enrollment." });
    }

    await request.sql`
      UPDATE learning_enrollment_payments
      SET status = 'succeeded', paid_at = COALESCE(paid_at, NOW())
      WHERE id = ${payment.id} AND status IN ('pending', 'succeeded')
    `;
    await request.sql`
      UPDATE learning_enrollments
      SET status = ${payment.paymentPlan === "full" ? "enrolled" : "awaiting_balance"}, updated_at = NOW()
      WHERE id = ${enrollmentId}
    `;

    const accountResult = await ensureLearningAccount(Number(enrollmentId), payment.fullName || "Learner", payment.email);
    return response.json({
      confirmed: true,
      enrollmentId,
      accountCreated: accountResult.isNew,
      account: accountResult.account,
      temporaryPassword: accountResult.password,
    });
  } catch (error) {
    console.error("Failed to confirm learning payment:", error);
    return response.status(500).json({ error: "Unable to confirm this payment." });
  }
});

app.get("/api/blog", async (_request, response) => {
  try {
    const posts = await sql`
      SELECT ${sql.unsafe(blogPostFields)}
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY updated_at DESC
    `;
    return response.json({ posts });
  } catch (error) {
    console.error("Failed to load published blog posts:", error);
    return response.status(500).json({ error: "Unable to load blog posts." });
  }
});

app.get("/api/blog/:slug", async (request, response) => {
  try {
    const [post] = await sql`
      SELECT ${sql.unsafe(blogPostFields)}
      FROM blog_posts
      WHERE slug = ${request.params.slug} AND status = 'published'
      LIMIT 1
    `;
    if (!post) return response.status(404).json({ error: "Blog post not found." });
    return response.json({ post });
  } catch (error) {
    console.error("Failed to load blog post:", error);
    return response.status(500).json({ error: "Unable to load this blog post." });
  }
});

app.get("/api/admin/blog", requireAdmin, async (_request, response) => {
  try {
    const posts = await sql`
      SELECT ${sql.unsafe(blogPostFields)}
      FROM blog_posts
      ORDER BY updated_at DESC
    `;
    return response.json({ posts });
  } catch (error) {
    console.error("Failed to load admin blog posts:", error);
    return response.status(500).json({ error: "Unable to load blog posts." });
  }
});

app.post("/api/admin/blog", requireAdmin, async (request, response) => {
  const post = readBlogPost(request.body);
  if (!post) return response.status(400).json({ error: "Check the blog post fields and try again." });

  try {
    const [created] = await sql`
      INSERT INTO blog_posts (slug, category, title, description, content, status)
      VALUES (${post.slug}, ${post.category}, ${post.title}, ${post.description}, ${post.content}, ${post.status})
      RETURNING ${sql.unsafe(blogPostFields)}
    `;
    return response.status(201).json({ post: created });
  } catch (error) {
    if (error?.code === "23505") return response.status(409).json({ error: "That blog URL is already in use." });
    console.error("Failed to create blog post:", error);
    return response.status(500).json({ error: "Unable to save this blog post." });
  }
});

app.patch("/api/admin/blog/:id", requireAdmin, async (request, response) => {
  if (!/^\d+$/.test(request.params.id)) return response.status(400).json({ error: "Invalid blog post ID." });
  const post = readBlogPost(request.body);
  if (!post) return response.status(400).json({ error: "Check the blog post fields and try again." });

  try {
    const [updated] = await sql`
      UPDATE blog_posts
      SET slug = ${post.slug}, category = ${post.category}, title = ${post.title},
          description = ${post.description}, content = ${post.content},
          status = ${post.status}, updated_at = NOW()
      WHERE id = ${request.params.id}
      RETURNING ${sql.unsafe(blogPostFields)}
    `;
    if (!updated) return response.status(404).json({ error: "Blog post not found." });
    return response.json({ post: updated });
  } catch (error) {
    if (error?.code === "23505") return response.status(409).json({ error: "That blog URL is already in use." });
    console.error("Failed to update blog post:", error);
    return response.status(500).json({ error: "Unable to update this blog post." });
  }
});

app.delete("/api/admin/blog/:id", requireAdmin, async (request, response) => {
  if (!/^\d+$/.test(request.params.id)) return response.status(400).json({ error: "Invalid blog post ID." });

  try {
    const [deleted] = await sql`
      DELETE FROM blog_posts WHERE id = ${request.params.id} RETURNING id
    `;
    if (!deleted) return response.status(404).json({ error: "Blog post not found." });
    return response.json({ deleted: true });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return response.status(500).json({ error: "Unable to delete this blog post." });
  }
});

async function start() {
  const requiredVariables = ["DATABASE_URL", "RAILWAY_INTERNAL_API_KEY", "PORTAL_ADMIN_EMAIL", "PORTAL_ADMIN_PASSWORD", "PORTAL_SESSION_SECRET"];
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);
  if (missingVariables.length) throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);

  sql = neon(process.env.DATABASE_URL);
  learningTracks = JSON.parse(await readFile(new URL("./learning-tracks.json", import.meta.url), "utf8"));
  await sql`
    CREATE TABLE IF NOT EXISTS project_enquiries (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      service TEXT NOT NULL,
      description TEXT NOT NULL,
      start_date DATE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      country_code TEXT NOT NULL,
      phone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS learning_enrollments (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      request_id UUID NOT NULL UNIQUE,
      track_id TEXT NOT NULL,
      track_title TEXT NOT NULL,
      payment_plan TEXT NOT NULL CHECK (payment_plan IN ('deposit', 'full')),
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      country TEXT NOT NULL,
      time_zone TEXT NOT NULL,
      experience_level TEXT NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
      background TEXT NOT NULL DEFAULT '',
      goals TEXT NOT NULL,
      preferred_days JSONB NOT NULL,
      preferred_time TEXT NOT NULL,
      preferred_start TEXT NOT NULL,
      learning_format TEXT NOT NULL CHECK (learning_format IN ('online', 'in-person', 'flexible')),
      is_adult BOOLEAN NOT NULL,
      guardian_name TEXT,
      guardian_email TEXT,
      guardian_phone TEXT,
      accepted_terms BOOLEAN NOT NULL,
      accepted_privacy BOOLEAN NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'awaiting_balance', 'enrolled')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS learning_enrollment_payments (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      enrollment_id BIGINT NOT NULL REFERENCES learning_enrollments(id),
      reference TEXT NOT NULL UNIQUE,
      amount BIGINT NOT NULL CHECK (amount > 0),
      payment_plan TEXT NOT NULL CHECK (payment_plan IN ('deposit', 'full')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
      paid_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS learning_accounts (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      enrollment_id BIGINT NOT NULL UNIQUE REFERENCES learning_enrollments(id),
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const blogSeed = JSON.parse(await readFile(new URL("./blog-seed.json", import.meta.url), "utf8"));
  for (const post of blogSeed) {
    await sql`
      INSERT INTO blog_posts (slug, category, title, description, content, status)
      VALUES (
        ${post.slug}, ${post.category}, ${post.title}, ${post.description},
        ${post.content.join("\n\n")}, 'published'
      )
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Portal API listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error(error.message);
  process.exit(1);
});