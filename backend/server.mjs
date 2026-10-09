import { createHash, createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
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
app.use((request, response, next) => {
  const isProjectEnquiry = request.method === "POST" && request.path === "/api/enquiries";
  const isBlogWrite = ["POST", "PATCH"].includes(request.method)
    && (request.path === "/api/admin/blog" || /^\/api\/admin\/blog\/\d+$/.test(request.path));
  const limit = isProjectEnquiry ? "10mb" : isBlogWrite ? "7mb" : "20kb";
  express.json({ limit })(request, response, next);
});
app.use((request, _response, next) => {
  request.sql = sql;
  next();
});

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

async function notifyTelegram(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.error("Telegram notification is not configured.");
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      throw new Error(`Telegram returned HTTP ${response.status}.`);
    }
    return true;
  } catch (error) {
    console.error("Telegram notification failed:", error);
    return false;
  }
}

function telegramField(value, maxLength = 120) {
  return String(value).replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
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

function normalizeProjectDetail(value) {
  return value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function projectEnquiryFingerprint(enquiry) {
  const details = [
    enquiry.email.normalize("NFKC").trim().toLowerCase(),
    `${enquiry.countryCode}${enquiry.phone}`,
    normalizeProjectDetail(enquiry.firstName),
    normalizeProjectDetail(enquiry.lastName),
    normalizeProjectDetail(enquiry.service),
    normalizeProjectDetail(enquiry.description),
  ];
  return createHash("sha256").update(JSON.stringify(details)).digest("hex");
}

const projectAttachmentTypes = new Map([
  [".pdf", "application/pdf"],
  [".doc", "application/msword"],
  [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  [".txt", "text/plain"],
  [".rtf", "application/rtf"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
]);
const maxProjectAttachmentBytes = 2 * 1024 * 1024;

function readProjectAttachments(input) {
  if (input === undefined) return [];
  if (!Array.isArray(input) || input.length > 3) return null;

  const attachments = [];
  for (const file of input) {
    if (!file || typeof file.name !== "string" || typeof file.data !== "string") return null;

    const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
    const mediaType = projectAttachmentTypes.get(extension);
    const encoded = file.data;
    if (!mediaType || !encoded || encoded.length > Math.ceil(maxProjectAttachmentBytes / 3) * 4 + 4) return null;
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded) || encoded.length % 4 === 1) return null;

    const data = Buffer.from(encoded, "base64");
    if (!data.length || data.length > maxProjectAttachmentBytes) return null;
    if (data.toString("base64").replace(/=+$/, "") !== encoded.replace(/=+$/, "")) return null;

    const name = file.name.replace(/[\\/\0-\x1f\x7f]/g, "_").trim().slice(0, 180);
    if (!name) return null;
    attachments.push({ name, mediaType, sizeBytes: data.length, data: encoded });
  }

  return attachments;
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

const blogImageTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
]);
const maxBlogImageBytes = 2 * 1024 * 1024;

function readBlogImages(input) {
  if (input === undefined) return [];
  if (!Array.isArray(input) || input.length > 2) return null;

  const images = [];
  for (const file of input) {
    if (!file || typeof file.name !== "string" || typeof file.data !== "string") return null;
    const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
    const mediaType = blogImageTypes.get(extension);
    const encoded = file.data;
    if (!mediaType || !encoded || encoded.length > Math.ceil(maxBlogImageBytes / 3) * 4 + 4) return null;
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded) || encoded.length % 4 === 1) return null;

    const data = Buffer.from(encoded, "base64");
    if (!data.length || data.length > maxBlogImageBytes) return null;
    if (data.toString("base64").replace(/=+$/, "") !== encoded.replace(/=+$/, "")) return null;

    const name = file.name.replace(/[\\/\0-\x1f\x7f]/g, "_").trim().slice(0, 180);
    if (!name) return null;
    images.push({ name, mediaType, sizeBytes: data.length, data: encoded });
  }
  return images;
}

function readRetainedBlogImageIds(input) {
  if (input === undefined) return [];
  if (!Array.isArray(input) || input.length > 2) return null;
  if (input.some((id) => typeof id !== "string" || !/^\d+$/.test(id))) return null;
  return [...new Set(input)];
}

async function replaceBlogImages(postId, retainedIds, images) {
  const existingImages = await sql`
    SELECT id::text AS id FROM blog_post_images WHERE post_id = ${postId}
  `;
  const existingIds = new Set(existingImages.map(({ id }) => id));
  if (retainedIds.some((id) => !existingIds.has(id))) return false;

  for (const { id } of existingImages) {
    if (!retainedIds.includes(id)) {
      await sql`DELETE FROM blog_post_images WHERE id = ${id} AND post_id = ${postId}`;
    }
  }
  for (const image of images) {
    await sql`
      INSERT INTO blog_post_images (post_id, name, media_type, size_bytes, data)
      VALUES (${postId}, ${image.name}, ${image.mediaType}, ${image.sizeBytes}, ${image.data})
    `;
  }
  return true;
}

function sendBlogImage(response, image) {
  return response
    .set("Content-Type", image.mediaType)
    .set("Content-Length", String(image.sizeBytes))
    .set("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(image.name)}`)
    .set("Cache-Control", "public, max-age=3600")
    .set("X-Content-Type-Options", "nosniff")
    .send(Buffer.from(image.data, "base64"));
}

function readLearningItem(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const value = (field, maxLength) =>
    typeof body[field] === "string" ? body[field].trim().slice(0, maxLength) : "";
  const item = {
    trackId: value("trackId", 10),
    type: value("type", 20),
    title: value("title", 180),
    description: value("description", 5000),
    resourceUrl: value("resourceUrl", 1000),
    dueDate: value("dueDate", 10),
    status: value("status", 20),
  };
  let validResourceUrl = true;
  if (item.resourceUrl) {
    try {
      validResourceUrl = ["http:", "https:"].includes(new URL(item.resourceUrl).protocol);
    } catch {
      validResourceUrl = false;
    }
  }
  const validDueDate = !item.dueDate || (/^\d{4}-\d{2}-\d{2}$/.test(item.dueDate)
    && !Number.isNaN(new Date(`${item.dueDate}T00:00:00.000Z`).getTime())
    && new Date(`${item.dueDate}T00:00:00.000Z`).toISOString().slice(0, 10) === item.dueDate);

  if (
    !learningTracks.some(({ id }) => id === item.trackId)
    || !["resource", "assignment"].includes(item.type)
    || !item.title
    || !item.description
    || !validResourceUrl
    || !validDueDate
    || !["draft", "published"].includes(item.status)
  ) {
    return null;
  }

  return item;
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
  views_count AS "viewsCount", likes_count AS "likesCount",
  COALESCE((
    SELECT json_agg(json_build_object('id', image.id::text, 'name', image.name, 'mediaType', image.media_type, 'sizeBytes', image.size_bytes) ORDER BY image.id)
    FROM blog_post_images AS image
    WHERE image.post_id = blog_posts.id
  ), '[]'::json) AS images,
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
  if (previousAttempts && previousAttempts.resetAt > now && previousAttempts.count >= 4) {
    return response.status(429).json({ error: "Too many sign-in attempts. Try again in 15 minutes." });
  }
  const attempts = previousAttempts && previousAttempts.resetAt > now
    ? previousAttempts
    : { count: 0, resetAt: now + 15 * 60 * 1000 };

  if (!safeEqual(email, adminEmail) || !safeEqual(password, adminPassword)) {
    attempts.count += 1;
    if (attempts.count >= 4) {
      attempts.resetAt = now + 15 * 60 * 1000;
      loginAttempts.set(attemptKey, attempts);
      return response.status(429).json({ error: "Too many sign-in attempts. Try again in 15 minutes." });
    }
    loginAttempts.set(attemptKey, attempts);
    return response.status(401).json({ error: "Email or password is incorrect." });
  }

  loginAttempts.delete(attemptKey);
  return response.json({ token: createSession(adminEmail), expiresIn: sessionLifetimeSeconds });
});

app.post("/api/contact", async (request, response) => {
  const read = (field, maxLength) => typeof request.body?.[field] === "string"
    ? request.body[field].trim().slice(0, maxLength + 1)
    : "";
  const contact = {
    name: read("name", 120),
    email: read("email", 254),
    company: read("company", 120),
    role: read("role", 120),
    enquiry: read("enquiry", 80),
    budget: read("budget", 40),
    timeline: read("timeline", 40),
    message: read("message", 2500),
    source: read("source", 40),
  };
  const validEnquiries = new Set([
    "Technology leadership / ICT consulting",
    "Technology strategy & digital transformation",
    "Software / web application",
    "Mobile application",
    "Systems architecture / technical review",
    "Data & analytics",
    "Cloud / DevOps / infrastructure",
    "Technology training",
    "Mentorship",
    "Partnership / collaboration",
    "Speaking / media",
    "Other",
  ]);
  const validBudgets = new Set(["", "under-500k", "500k-1m", "1m-3m", "3m-5m", "5m-plus", "international", "not-sure"]);
  const validTimelines = new Set(["", "urgent", "1-month", "1-3-months", "3-6-months", "6-plus-months", "flexible"]);
  const validSources = new Set(["", "linkedin", "google", "github", "referral", "portfolio", "other"]);
  if (
    !contact.name || contact.name.length > 120
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) || contact.email.length > 254
    || !validEnquiries.has(contact.enquiry)
    || !validBudgets.has(contact.budget)
    || !validTimelines.has(contact.timeline)
    || !validSources.has(contact.source)
    || contact.message.length < 5 || contact.message.length > 2500
    || contact.company.length > 120 || contact.role.length > 120
  ) {
    return response.status(400).json({ error: "Please check the contact form fields and try again." });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return response.status(503).json({ error: "Contact messaging is not configured yet. Please try again later." });
  }

  const clientIp = (request.get("x-client-ip") || "unknown").slice(0, 64);
  const clientKey = createHash("sha256").update(clientIp).digest("hex");
  try {
    const [rateLimit] = await request.sql`
      INSERT INTO contact_message_rate_limits (client_key, window_started_at, request_count)
      VALUES (${clientKey}, NOW(), 1)
      ON CONFLICT (client_key) DO UPDATE
      SET
        window_started_at = CASE
          WHEN contact_message_rate_limits.window_started_at <= NOW() - INTERVAL '10 minutes' THEN NOW()
          ELSE contact_message_rate_limits.window_started_at
        END,
        request_count = CASE
          WHEN contact_message_rate_limits.window_started_at <= NOW() - INTERVAL '10 minutes' THEN 1
          ELSE LEAST(contact_message_rate_limits.request_count + 1, 6)
        END
      RETURNING request_count, window_started_at + INTERVAL '10 minutes' AS "windowEndsAt"
    `;
    if (rateLimit.request_count > 5) {
      const retryAfter = Math.max(1, Math.ceil((new Date(rateLimit.windowEndsAt).getTime() - Date.now()) / 1000));
      return response
        .set("Retry-After", String(retryAfter))
        .status(429)
        .json({ error: "Too many contact messages. Please try again in 10 minutes." });
    }

    const sent = await notifyTelegram([
      "New contact enquiry",
      `Name: ${telegramField(contact.name)}`,
      `Email: ${telegramField(contact.email, 254)}`,
      `Organization: ${telegramField(contact.company || "Not provided")}`,
      `Role: ${telegramField(contact.role || "Not provided")}`,
      `Enquiry: ${telegramField(contact.enquiry, 80)}`,
      `Budget: ${telegramField(contact.budget || "Not provided", 40)}`,
      `Timeline: ${telegramField(contact.timeline || "Not provided", 40)}`,
      `Source: ${telegramField(contact.source || "Not provided", 40)}`,
      "Message:",
      telegramField(contact.message, 2500),
    ].join("\n"));
    if (!sent) return response.status(503).json({ error: "Unable to send your message right now. Please try again later." });
    return response.status(202).json({ sent: true });
  } catch (error) {
    console.error("Failed to send contact enquiry:", error);
    return response.status(500).json({ error: "Unable to send your message right now. Please try again later." });
  }
});

app.post("/api/learning/support", async (request, response) => {
  const allowedTopics = new Set(["Account Issues ?", "Registration Issues ?", "Need Materials ?"]);
  const topic = typeof request.body?.topic === "string" ? request.body.topic.trim() : "";
  const description = typeof request.body?.description === "string"
    ? request.body.description.trim().slice(0, 2000)
    : "";
  if (!allowedTopics.has(topic) || description.length < 10) {
    return response.status(400).json({ error: "Choose a support topic and enter at least 10 characters." });
  }
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return response.status(503).json({ error: "Support messaging is not configured yet. Please try again later." });
  }

  const clientIp = (request.get("x-client-ip") || "unknown").slice(0, 64);
  const clientKey = createHash("sha256").update(clientIp).digest("hex");
  try {
    const [rateLimit] = await request.sql`
      INSERT INTO learning_support_rate_limits (client_key, window_started_at, request_count)
      VALUES (${clientKey}, NOW(), 1)
      ON CONFLICT (client_key) DO UPDATE
      SET
        window_started_at = CASE
          WHEN learning_support_rate_limits.window_started_at <= NOW() - INTERVAL '10 minutes' THEN NOW()
          ELSE learning_support_rate_limits.window_started_at
        END,
        request_count = CASE
          WHEN learning_support_rate_limits.window_started_at <= NOW() - INTERVAL '10 minutes' THEN 1
          ELSE LEAST(learning_support_rate_limits.request_count + 1, 4)
        END
      RETURNING request_count, window_started_at + INTERVAL '10 minutes' AS "windowEndsAt"
    `;
    if (rateLimit.request_count > 3) {
      const retryAfter = Math.max(1, Math.ceil((new Date(rateLimit.windowEndsAt).getTime() - Date.now()) / 1000));
      return response
        .set("Retry-After", String(retryAfter))
        .status(429)
        .json({ error: "Too many support messages. Please try again in 10 minutes." });
    }

    const sent = await notifyTelegram([
      "Learner help request",
      `Topic: ${telegramField(topic, 40)}`,
      "Message:",
      telegramField(description, 2000),
    ].join("\n"));
    if (!sent) return response.status(503).json({ error: "Unable to send your message right now. Please try again later." });
    return response.status(202).json({ sent: true });
  } catch (error) {
    console.error("Failed to submit learner support message:", error);
    return response.status(500).json({ error: "Unable to send your message right now. Please try again later." });
  }
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
      SELECT a.id, a.full_name AS "fullName", a.email,
             e.track_title AS "trackTitle", e.status AS "enrollmentStatus",
             e.payment_plan AS "paymentPlan", e.experience_level AS "experienceLevel",
             e.learning_format AS "learningFormat", e.preferred_days AS "preferredDays",
             e.preferred_time AS "preferredTime", e.preferred_start AS "preferredStart",
                  e.time_zone AS "timeZone", e.goals,
                  ta.tutor_name AS "tutorName", ta.tutor_email AS "tutorEmail"
      FROM learning_accounts a
      JOIN learning_enrollments e ON e.id = a.enrollment_id
                LEFT JOIN learning_tutor_assignments ta ON ta.account_id = a.id
      WHERE a.id = ${Number(session.id)}
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
        tutor: account.tutorName ? {
          name: account.tutorName,
          email: account.tutorEmail,
        } : null,
        enrollment: {
          trackTitle: account.trackTitle,
          status: account.enrollmentStatus,
          paymentPlan: account.paymentPlan,
          experienceLevel: account.experienceLevel,
          learningFormat: account.learningFormat,
          preferredDays: account.preferredDays,
          preferredTime: account.preferredTime,
          preferredStart: account.preferredStart,
          timeZone: account.timeZone,
          goals: account.goals,
        },
      },
    });
  } catch (error) {
    console.error("Failed to load learner session:", error);
    return response.status(500).json({ error: "The learning portal is unavailable. Please try again later." });
  }
});

app.get("/api/learning/progress", async (request, response) => {
  const authorization = request.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const session = getLearnerSession(token);
  if (!session) return response.status(401).json({ error: "Please sign in again." });

  try {
    const entries = await request.sql`
      SELECT p.id, p.topic, p.reflection, p.created_at AS "createdAt"
      FROM learning_progress_entries p
      JOIN learning_accounts a ON a.id = p.account_id
      WHERE p.account_id = ${Number(session.id)} AND a.status = 'active'
      ORDER BY p.created_at DESC
      LIMIT 100
    `;
    return response.json({ entries });
  } catch (error) {
    console.error("Failed to load learner progress:", error);
    return response.status(500).json({ error: "Unable to load your learning log." });
  }
});

app.get("/api/learning/items", async (request, response) => {
  const authorization = request.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const session = getLearnerSession(token);
  if (!session) return response.status(401).json({ error: "Please sign in again." });

  try {
    const rows = await request.sql`
      SELECT i.id, i.track_id AS "trackId", i.type, i.title, i.description,
             i.resource_url AS "resourceUrl", i.due_date AS "dueDate", i.created_at AS "createdAt",
             s.id AS "submissionId", s.response AS "submissionResponse",
             s.response_url AS "submissionUrl", s.status AS "submissionStatus",
                  s.feedback AS "submissionFeedback", s.submitted_at AS "submittedAt",
                  c.completed_at AS "completedAt"
      FROM learning_course_items i
      JOIN learning_accounts a ON a.id = ${Number(session.id)}
      JOIN learning_enrollments e ON e.id = a.enrollment_id AND e.track_id = i.track_id
      LEFT JOIN learning_assignment_submissions s ON s.item_id = i.id AND s.account_id = a.id
                LEFT JOIN learning_item_completions c ON c.item_id = i.id AND c.account_id = a.id
      WHERE a.status = 'active' AND i.status = 'published'
      ORDER BY CASE WHEN i.due_date IS NULL THEN 1 ELSE 0 END, i.due_date ASC, i.created_at DESC
    `;
    const items = rows.map(({ submissionId, submissionResponse, submissionUrl, submissionStatus, submissionFeedback, submittedAt, completedAt, ...item }) => ({
      ...item,
      completed: Boolean(completedAt),
      completedAt,
      submission: submissionId ? {
        id: submissionId,
        response: submissionResponse,
        resourceUrl: submissionUrl,
        status: submissionStatus,
        feedback: submissionFeedback,
        submittedAt,
      } : null,
    }));
    return response.json({ items });
  } catch (error) {
    console.error("Failed to load learner course items:", error);
    return response.status(500).json({ error: "Unable to load your course materials." });
  }
});

app.patch("/api/learning/items/:id/completion", async (request, response) => {
  const authorization = request.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const session = getLearnerSession(token);
  if (!session) return response.status(401).json({ error: "Please sign in again." });
  if (!/^\d+$/.test(request.params.id) || typeof request.body?.completed !== "boolean") {
    return response.status(400).json({ error: "Invalid course item completion update." });
  }

  try {
    if (request.body.completed) {
      const [completion] = await request.sql`
        INSERT INTO learning_item_completions (item_id, account_id)
        SELECT i.id, a.id
        FROM learning_course_items i
        JOIN learning_accounts a ON a.id = ${Number(session.id)} AND a.status = 'active'
        JOIN learning_enrollments e ON e.id = a.enrollment_id AND e.track_id = i.track_id
        WHERE i.id = ${request.params.id} AND i.type = 'resource' AND i.status = 'published'
        ON CONFLICT (item_id, account_id) DO UPDATE SET completed_at = NOW()
        RETURNING item_id AS "itemId", completed_at AS "completedAt"
      `;
      if (!completion) return response.status(404).json({ error: "This resource is not available for your learning track." });
      return response.json({ completed: true, completedAt: completion.completedAt });
    }

    await request.sql`
      DELETE FROM learning_item_completions c
      USING learning_course_items i, learning_accounts a, learning_enrollments e
      WHERE c.item_id = i.id AND c.account_id = a.id AND a.id = ${Number(session.id)}
        AND a.status = 'active' AND e.id = a.enrollment_id AND e.track_id = i.track_id
        AND i.id = ${request.params.id} AND i.type = 'resource' AND i.status = 'published'
    `;
    return response.json({ completed: false, completedAt: null });
  } catch (error) {
    console.error("Failed to update resource completion:", error);
    return response.status(500).json({ error: "Unable to update course progress." });
  }
});

app.post("/api/learning/assignments", async (request, response) => {
  const authorization = request.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const session = getLearnerSession(token);
  if (!session) return response.status(401).json({ error: "Please sign in again." });

  const itemId = typeof request.body?.itemId === "string" || typeof request.body?.itemId === "number"
    ? String(request.body.itemId)
    : "";
  const submission = typeof request.body?.submission === "string" ? request.body.submission.trim().slice(0, 10000) : "";
  const resourceUrl = typeof request.body?.resourceUrl === "string" ? request.body.resourceUrl.trim().slice(0, 1000) : "";
  let validResourceUrl = !resourceUrl;
  if (resourceUrl) {
    try {
      validResourceUrl = ["http:", "https:"].includes(new URL(resourceUrl).protocol);
    } catch {
      validResourceUrl = false;
    }
  }
  if (!/^\d+$/.test(itemId) || (!submission && !resourceUrl) || !validResourceUrl) {
    return response.status(400).json({ error: "Add a written response or a valid link to your work." });
  }

  try {
    const [saved] = await request.sql`
      INSERT INTO learning_assignment_submissions (item_id, account_id, response, response_url)
      SELECT i.id, a.id, ${submission}, ${resourceUrl || null}
      FROM learning_course_items i
      JOIN learning_accounts a ON a.id = ${Number(session.id)} AND a.status = 'active'
      JOIN learning_enrollments e ON e.id = a.enrollment_id AND e.track_id = i.track_id
      WHERE i.id = ${itemId} AND i.type = 'assignment' AND i.status = 'published'
      ON CONFLICT (item_id, account_id) DO UPDATE
      SET response = EXCLUDED.response, response_url = EXCLUDED.response_url,
          status = 'submitted', feedback = NULL, submitted_at = NOW(), updated_at = NOW()
      RETURNING id, item_id AS "itemId", response, response_url AS "resourceUrl",
                status, feedback, submitted_at AS "submittedAt"
    `;
    if (!saved) return response.status(404).json({ error: "This assignment is not available for your learning track." });
    return response.status(201).json({ submission: saved });
  } catch (error) {
    console.error("Failed to save learner assignment:", error);
    return response.status(500).json({ error: "Unable to submit this assignment." });
  }
});

app.post("/api/learning/progress", async (request, response) => {
  const authorization = request.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const session = getLearnerSession(token);
  if (!session) return response.status(401).json({ error: "Please sign in again." });

  const topic = typeof request.body?.topic === "string" ? request.body.topic.trim().slice(0, 120) : "";
  const reflection = typeof request.body?.reflection === "string" ? request.body.reflection.trim().slice(0, 1200) : "";
  if (!topic || !reflection) {
    return response.status(400).json({ error: "Add a topic and a short note about what you learned." });
  }

  try {
    const [entry] = await request.sql`
      INSERT INTO learning_progress_entries (account_id, topic, reflection)
      SELECT id, ${topic}, ${reflection}
      FROM learning_accounts
      WHERE id = ${Number(session.id)} AND status = 'active'
      RETURNING id, topic, reflection, created_at AS "createdAt"
    `;
    if (!entry) return response.status(401).json({ error: "Your learning account could not be found." });
    return response.status(201).json({ entry });
  } catch (error) {
    console.error("Failed to save learner progress:", error);
    return response.status(500).json({ error: "Unable to save this learning log entry." });
  }
});

app.post("/api/enquiries", async (request, response) => {
  const enquiry = readProjectRequest(request.body);
  const attachments = readProjectAttachments(request.body?.attachments);
  if (!enquiry || !attachments) return response.status(400).json({ error: "Please check the project enquiry details and attachments." });

  const fingerprint = projectEnquiryFingerprint(enquiry);
  const clientIp = (request.get("x-client-ip") || "unknown").slice(0, 64);
  const clientKey = createHash("sha256").update(clientIp).digest("hex");
  let hasSubmissionClaim = false;
  let saved;
  try {
    await request.sql`DELETE FROM project_enquiry_submission_claims WHERE expires_at <= NOW()`;
    const [claim] = await request.sql`
      INSERT INTO project_enquiry_submission_claims (fingerprint, expires_at)
      VALUES (${fingerprint}, NOW() + INTERVAL '10 minutes')
      ON CONFLICT (fingerprint) DO UPDATE
      SET expires_at = EXCLUDED.expires_at
      WHERE project_enquiry_submission_claims.expires_at <= NOW()
      RETURNING fingerprint
    `;
    if (!claim) {
      return response.status(409).json({
        error: "Details submitted previously. Please wait 10 minutes before submitting again.",
      });
    }
    hasSubmissionClaim = true;

    const [recentDuplicate] = await request.sql`
      SELECT id
      FROM project_enquiries
      WHERE created_at >= NOW() - INTERVAL '10 minutes'
        AND (
          lower(btrim(email)) = lower(${enquiry.email})
          OR (country_code = ${enquiry.countryCode} AND phone = ${enquiry.phone})
        )
        AND lower(btrim(first_name)) = lower(${enquiry.firstName})
        AND lower(btrim(last_name)) = lower(${enquiry.lastName})
        AND lower(btrim(service)) = lower(${enquiry.service})
        AND regexp_replace(lower(description), '[^[:alnum:]]+', ' ', 'g')
          = regexp_replace(lower(${enquiry.description}), '[^[:alnum:]]+', ' ', 'g')
      LIMIT 1
    `;
    if (recentDuplicate) {
      return response.status(409).json({
        error: "Details submitted previously. Please wait 10 minutes before submitting again.",
      });
    }

    const [rateLimit] = await request.sql`
      INSERT INTO project_enquiry_rate_limits (client_key, window_started_at, request_count)
      VALUES (${clientKey}, NOW(), 1)
      ON CONFLICT (client_key) DO UPDATE
      SET
        window_started_at = CASE
          WHEN project_enquiry_rate_limits.window_started_at <= NOW() - INTERVAL '10 minutes' THEN NOW()
          ELSE project_enquiry_rate_limits.window_started_at
        END,
        request_count = CASE
          WHEN project_enquiry_rate_limits.window_started_at <= NOW() - INTERVAL '10 minutes' THEN 1
          ELSE LEAST(project_enquiry_rate_limits.request_count + 1, 6)
        END
      RETURNING request_count, window_started_at + INTERVAL '10 minutes' AS "windowEndsAt"
    `;
    if (rateLimit.request_count > 5) {
      const retryAfter = Math.max(1, Math.ceil((new Date(rateLimit.windowEndsAt).getTime() - Date.now()) / 1000));
      return response
        .set("Retry-After", String(retryAfter))
        .status(429)
        .json({ error: "Too many project requests. Please try again in 10 minutes." });
    }

    [saved] = await request.sql`
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

    for (const attachment of attachments) {
      await request.sql`
        INSERT INTO project_enquiry_attachments (enquiry_id, name, media_type, size_bytes, data)
        VALUES (${saved.id}, ${attachment.name}, ${attachment.mediaType}, ${attachment.sizeBytes}, ${attachment.data})
      `;
    }
    await notifyTelegram([
      "New project enquiry",
      telegramField(`${enquiry.firstName} ${enquiry.lastName}`),
      telegramField(enquiry.service),
      telegramField(enquiry.email),
      telegramField(`${enquiry.countryCode} ${enquiry.phone}`),
      `Preferred start: ${telegramField(enquiry.startDate, 10)}`,
    ].join("\n"));
    return response.status(201).json({ enquiry: saved });
  } catch (error) {
    if (saved?.id) {
      try {
        await request.sql`DELETE FROM project_enquiries WHERE id = ${saved.id}`;
      } catch (rollbackError) {
        console.error("Failed to roll back incomplete project enquiry:", rollbackError);
      }
    }
    if (hasSubmissionClaim) {
      try {
        await request.sql`DELETE FROM project_enquiry_submission_claims WHERE fingerprint = ${fingerprint}`;
      } catch (claimError) {
        console.error("Failed to release project enquiry submission claim:", claimError);
      }
    }
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
        created_at AS "createdAt",
        COALESCE((
          SELECT json_agg(json_build_object('id', attachment.id::text, 'name', attachment.name, 'sizeBytes', attachment.size_bytes))
          FROM project_enquiry_attachments AS attachment
          WHERE attachment.enquiry_id = project_enquiries.id
        ), '[]'::json) AS attachments
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
        created_at AS "createdAt",
        COALESCE((
          SELECT json_agg(json_build_object('id', attachment.id::text, 'name', attachment.name, 'sizeBytes', attachment.size_bytes))
          FROM project_enquiry_attachments AS attachment
          WHERE attachment.enquiry_id = project_enquiries.id
        ), '[]'::json) AS attachments
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

app.delete("/api/enquiries/:id", requireAdmin, async (request, response) => {
  const id = request.params.id;
  if (!/^\d+$/.test(id)) return response.status(400).json({ error: "Invalid enquiry ID." });

  try {
    const [deleted] = await request.sql`
      DELETE FROM project_enquiries
      WHERE id = ${id}
      RETURNING id
    `;
    if (!deleted) return response.status(404).json({ error: "Enquiry not found." });
    return response.json({ deleted: true });
  } catch (error) {
    console.error("Failed to delete project enquiry:", error);
    return response.status(500).json({ error: "Unable to delete this enquiry." });
  }
});

app.get("/api/enquiries/:id/attachments/:attachmentId", requireAdmin, requireInternalKey, async (request, response) => {
  const { id, attachmentId } = request.params;
  if (!/^\d+$/.test(id) || !/^\d+$/.test(attachmentId)) {
    return response.status(400).json({ error: "Invalid attachment request." });
  }

  try {
    const [attachment] = await request.sql`
      SELECT name, media_type AS "mediaType", data
      FROM project_enquiry_attachments
      WHERE id = ${attachmentId} AND enquiry_id = ${id}
      LIMIT 1
    `;
    if (!attachment) return response.status(404).json({ error: "Attachment not found." });

    const filename = encodeURIComponent(attachment.name);
    return response
      .set("Content-Type", attachment.mediaType)
      .set("Content-Length", String(attachment.sizeBytes))
      .set("Content-Disposition", `attachment; filename*=UTF-8''${filename}`)
      .set("Cache-Control", "private, no-store")
      .set("X-Content-Type-Options", "nosniff")
      .send(Buffer.from(attachment.data, "base64"));
  } catch (error) {
    console.error("Failed to load project enquiry attachment:", error);
    return response.status(500).json({ error: "Unable to load this attachment." });
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
              e.payment_plan AS "paymentPlan", e.email, e.full_name AS "fullName",
              e.track_title AS "trackTitle"
      FROM learning_enrollment_payments p
      JOIN learning_enrollments e ON e.id = p.enrollment_id
      WHERE p.reference = ${reference} AND e.id = ${enrollmentId}
      LIMIT 1
    `;
    if (!payment) return response.status(404).json({ error: "Payment attempt not found." });
    if (Number(payment.amount) * 100 !== amountKobo || payment.email !== providerEmail) {
      return response.status(400).json({ error: "Verified payment does not match this enrollment." });
    }

    const [updatedPayment] = await request.sql`
      UPDATE learning_enrollment_payments
      SET status = 'succeeded', paid_at = COALESCE(paid_at, NOW())
      WHERE id = ${payment.id} AND status = 'pending'
      RETURNING id
    `;
    await request.sql`
      UPDATE learning_enrollments
      SET status = ${payment.paymentPlan === "full" ? "enrolled" : "awaiting_balance"}, updated_at = NOW()
      WHERE id = ${enrollmentId}
    `;

    const accountResult = await ensureLearningAccount(Number(enrollmentId), payment.fullName || "Learner", payment.email);
    if (updatedPayment) {
      await notifyTelegram([
        "Course payment received",
        telegramField(payment.fullName || "Learner"),
        `Program: ${telegramField(payment.trackTitle)}`,
        `Payment plan: ${telegramField(payment.paymentPlan, 20)}`,
        `Amount: NGN ${Number(payment.amount).toLocaleString("en-NG")}`,
        `Reference: ${telegramField(reference, 80)}`,
      ].join("\n"));
    }
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

app.get("/api/blog/:slug/images/:imageId", async (request, response) => {
  const { slug, imageId } = request.params;
  if (!/^\d+$/.test(imageId)) return response.status(400).json({ error: "Invalid image ID." });

  try {
    const [image] = await sql`
      SELECT image.name, image.media_type AS "mediaType", image.size_bytes AS "sizeBytes", image.data
      FROM blog_post_images AS image
      JOIN blog_posts AS post ON post.id = image.post_id
      WHERE post.slug = ${slug} AND post.status = 'published' AND image.id = ${imageId}
      LIMIT 1
    `;
    if (!image) return response.status(404).json({ error: "Blog image not found." });
    return sendBlogImage(response, image);
  } catch (error) {
    console.error("Failed to load public blog image:", error);
    return response.status(500).json({ error: "Unable to load this blog image." });
  }
});

app.get("/api/blog/:slug/engagement", async (request, response) => {
  const visitorId = typeof request.query.visitorId === "string" ? request.query.visitorId : "";
  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(visitorId)) {
    return response.status(400).json({ error: "Invalid reader ID." });
  }

  try {
    const [post] = await sql`
      SELECT id, views_count AS "viewsCount", likes_count AS "likesCount"
      FROM blog_posts
      WHERE slug = ${request.params.slug} AND status = 'published'
      LIMIT 1
    `;
    if (!post) return response.status(404).json({ error: "Blog post not found." });
    const [like] = await sql`
      SELECT 1 FROM blog_post_likes WHERE post_id = ${post.id} AND visitor_id = ${visitorId} LIMIT 1
    `;
    return response.json({ ...post, isLiked: Boolean(like) });
  } catch (error) {
    console.error("Failed to load blog engagement:", error);
    return response.status(500).json({ error: "Unable to load blog engagement." });
  }
});

app.post("/api/blog/:slug/engagement", async (request, response) => {
  const visitorId = typeof request.body?.visitorId === "string" ? request.body.visitorId : "";
  const action = request.body?.action;
  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(visitorId) || !["view", "like", "unlike"].includes(action)) {
    return response.status(400).json({ error: "Invalid engagement request." });
  }

  try {
    const [post] = await sql`
      SELECT id FROM blog_posts WHERE slug = ${request.params.slug} AND status = 'published' LIMIT 1
    `;
    if (!post) return response.status(404).json({ error: "Blog post not found." });

    if (action === "view") {
      const [newView] = await sql`
        INSERT INTO blog_post_views (post_id, visitor_id)
        VALUES (${post.id}, ${visitorId})
        ON CONFLICT DO NOTHING
        RETURNING post_id
      `;
      if (newView) await sql`UPDATE blog_posts SET views_count = views_count + 1 WHERE id = ${post.id}`;
    } else if (action === "like") {
      const [newLike] = await sql`
        INSERT INTO blog_post_likes (post_id, visitor_id)
        VALUES (${post.id}, ${visitorId})
        ON CONFLICT DO NOTHING
        RETURNING post_id
      `;
      if (newLike) await sql`UPDATE blog_posts SET likes_count = likes_count + 1 WHERE id = ${post.id}`;
    } else {
      const [removedLike] = await sql`
        DELETE FROM blog_post_likes WHERE post_id = ${post.id} AND visitor_id = ${visitorId}
        RETURNING post_id
      `;
      if (removedLike) await sql`UPDATE blog_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ${post.id}`;
    }

    const [counts] = await sql`
      SELECT views_count AS "viewsCount", likes_count AS "likesCount"
      FROM blog_posts WHERE id = ${post.id}
    `;
    const [like] = await sql`
      SELECT 1 FROM blog_post_likes WHERE post_id = ${post.id} AND visitor_id = ${visitorId} LIMIT 1
    `;
    return response.json({ ...counts, isLiked: Boolean(like) });
  } catch (error) {
    console.error("Failed to update blog engagement:", error);
    return response.status(500).json({ error: "Unable to update blog engagement." });
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

app.get("/api/admin/blog/:id/images/:imageId", requireAdmin, async (request, response) => {
  const { id, imageId } = request.params;
  if (!/^\d+$/.test(id) || !/^\d+$/.test(imageId)) {
    return response.status(400).json({ error: "Invalid blog image request." });
  }

  try {
    const [image] = await sql`
      SELECT name, media_type AS "mediaType", size_bytes AS "sizeBytes", data
      FROM blog_post_images
      WHERE post_id = ${id} AND id = ${imageId}
      LIMIT 1
    `;
    if (!image) return response.status(404).json({ error: "Blog image not found." });
    return sendBlogImage(response, image);
  } catch (error) {
    console.error("Failed to load admin blog image:", error);
    return response.status(500).json({ error: "Unable to load this blog image." });
  }
});

app.get("/api/admin/learning-items", requireAdmin, async (_request, response) => {
  try {
    const items = await sql`
      SELECT id, track_id AS "trackId", type, title, description,
             resource_url AS "resourceUrl", due_date AS "dueDate", status,
             created_at AS "createdAt", updated_at AS "updatedAt"
      FROM learning_course_items
      ORDER BY updated_at DESC
    `;
    return response.json({ items });
  } catch (error) {
    console.error("Failed to load admin learning items:", error);
    return response.status(500).json({ error: "Unable to load course materials." });
  }
});

app.get("/api/admin/learning-submissions", requireAdmin, async (_request, response) => {
  try {
    const submissions = await sql`
      SELECT s.id, s.item_id AS "itemId", s.account_id AS "accountId",
             s.response, s.response_url AS "resourceUrl", s.status, s.feedback,
             s.submitted_at AS "submittedAt", s.updated_at AS "updatedAt",
             i.title AS "assignmentTitle", i.track_id AS "trackId",
             a.full_name AS "learnerName", a.email AS "learnerEmail"
      FROM learning_assignment_submissions s
      JOIN learning_course_items i ON i.id = s.item_id
      JOIN learning_accounts a ON a.id = s.account_id
      ORDER BY s.updated_at DESC
      LIMIT 300
    `;
    return response.json({ submissions });
  } catch (error) {
    console.error("Failed to load assignment submissions:", error);
    return response.status(500).json({ error: "Unable to load assignment submissions." });
  }
});

app.get("/api/admin/learning-assignments", requireAdmin, async (_request, response) => {
  try {
    const learners = await sql`
      SELECT a.id AS "accountId", a.full_name AS "fullName", a.email,
             e.track_title AS "trackTitle", e.status AS "enrollmentStatus",
             ta.tutor_name AS "tutorName", ta.tutor_email AS "tutorEmail",
             ta.notes AS "tutorNotes", ta.updated_at AS "assignedAt"
      FROM learning_accounts a
      JOIN learning_enrollments e ON e.id = a.enrollment_id
      LEFT JOIN learning_tutor_assignments ta ON ta.account_id = a.id
      WHERE a.status = 'active'
      ORDER BY e.created_at DESC
      LIMIT 500
    `;
    return response.json({ learners });
  } catch (error) {
    console.error("Failed to load learner tutor assignments:", error);
    return response.status(500).json({ error: "Unable to load learners." });
  }
});

app.patch("/api/admin/learning-assignments/:accountId", requireAdmin, async (request, response) => {
  if (!/^\d+$/.test(request.params.accountId)) return response.status(400).json({ error: "Invalid learner account ID." });
  const tutorName = typeof request.body?.tutorName === "string" ? request.body.tutorName.trim().slice(0, 160) : "";
  const tutorEmail = typeof request.body?.tutorEmail === "string" ? request.body.tutorEmail.trim().slice(0, 254).toLowerCase() : "";
  const notes = typeof request.body?.notes === "string" ? request.body.notes.trim().slice(0, 2000) : "";
  if (!tutorName || (tutorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tutorEmail))) {
    return response.status(400).json({ error: "Enter a tutor name and a valid email address." });
  }

  try {
    const [assignment] = await sql`
      INSERT INTO learning_tutor_assignments (account_id, tutor_name, tutor_email, notes)
      SELECT id, ${tutorName}, ${tutorEmail || null}, ${notes}
      FROM learning_accounts
      WHERE id = ${request.params.accountId} AND status = 'active'
      ON CONFLICT (account_id) DO UPDATE
      SET tutor_name = EXCLUDED.tutor_name, tutor_email = EXCLUDED.tutor_email,
          notes = EXCLUDED.notes, updated_at = NOW()
      RETURNING account_id AS "accountId", tutor_name AS "tutorName",
                tutor_email AS "tutorEmail", notes AS "tutorNotes", updated_at AS "assignedAt"
    `;
    if (!assignment) return response.status(404).json({ error: "Active learner account not found." });
    return response.json({ assignment });
  } catch (error) {
    console.error("Failed to assign learner tutor:", error);
    return response.status(500).json({ error: "Unable to save the tutor assignment." });
  }
});

app.patch("/api/admin/learning-submissions/:id", requireAdmin, async (request, response) => {
  if (!/^\d+$/.test(request.params.id)) return response.status(400).json({ error: "Invalid submission ID." });
  const feedback = typeof request.body?.feedback === "string" ? request.body.feedback.trim().slice(0, 5000) : "";
  const status = request.body?.status;
  if (!feedback || !["reviewed", "needs_revision"].includes(status)) {
    return response.status(400).json({ error: "Enter feedback and choose a review outcome." });
  }

  try {
    const [updated] = await sql`
      UPDATE learning_assignment_submissions
      SET feedback = ${feedback}, status = ${status}, updated_at = NOW()
      WHERE id = ${request.params.id}
      RETURNING id, item_id AS "itemId", status, feedback, updated_at AS "updatedAt"
    `;
    if (!updated) return response.status(404).json({ error: "Assignment submission not found." });
    return response.json({ submission: updated });
  } catch (error) {
    console.error("Failed to review assignment submission:", error);
    return response.status(500).json({ error: "Unable to save assignment feedback." });
  }
});

app.post("/api/admin/learning-items", requireAdmin, async (request, response) => {
  const item = readLearningItem(request.body);
  if (!item) return response.status(400).json({ error: "Check the course item fields and try again." });

  try {
    const [created] = await sql`
      INSERT INTO learning_course_items (track_id, type, title, description, resource_url, due_date, status)
      VALUES (${item.trackId}, ${item.type}, ${item.title}, ${item.description}, ${item.resourceUrl || null}, ${item.dueDate || null}, ${item.status})
      RETURNING id, track_id AS "trackId", type, title, description,
                resource_url AS "resourceUrl", due_date AS "dueDate", status,
                created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    return response.status(201).json({ item: created });
  } catch (error) {
    console.error("Failed to create admin learning item:", error);
    return response.status(500).json({ error: "Unable to save this course item." });
  }
});

app.patch("/api/admin/learning-items/:id", requireAdmin, async (request, response) => {
  if (!/^\d+$/.test(request.params.id)) return response.status(400).json({ error: "Invalid course item ID." });
  const item = readLearningItem(request.body);
  if (!item) return response.status(400).json({ error: "Check the course item fields and try again." });

  try {
    const [updated] = await sql`
      UPDATE learning_course_items
      SET track_id = ${item.trackId}, type = ${item.type}, title = ${item.title},
          description = ${item.description}, resource_url = ${item.resourceUrl || null},
          due_date = ${item.dueDate || null}, status = ${item.status}, updated_at = NOW()
      WHERE id = ${request.params.id}
      RETURNING id, track_id AS "trackId", type, title, description,
                resource_url AS "resourceUrl", due_date AS "dueDate", status,
                created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    if (!updated) return response.status(404).json({ error: "Course item not found." });
    return response.json({ item: updated });
  } catch (error) {
    console.error("Failed to update admin learning item:", error);
    return response.status(500).json({ error: "Unable to update this course item." });
  }
});

app.delete("/api/admin/learning-items/:id", requireAdmin, async (request, response) => {
  if (!/^\d+$/.test(request.params.id)) return response.status(400).json({ error: "Invalid course item ID." });

  try {
    const [deleted] = await sql`
      DELETE FROM learning_course_items WHERE id = ${request.params.id} RETURNING id
    `;
    if (!deleted) return response.status(404).json({ error: "Course item not found." });
    return response.json({ deleted: true });
  } catch (error) {
    console.error("Failed to delete admin learning item:", error);
    return response.status(500).json({ error: "Unable to delete this course item." });
  }
});

app.post("/api/admin/blog", requireAdmin, async (request, response) => {
  const post = readBlogPost(request.body);
  const images = readBlogImages(request.body?.images);
  const retainedImageIds = readRetainedBlogImageIds(request.body?.retainedImageIds);
  if (!post || !images || !retainedImageIds || retainedImageIds.length) {
    return response.status(400).json({ error: "Check the blog post fields and images, then try again." });
  }

  let created;
  try {
    [created] = await sql`
      INSERT INTO blog_posts (slug, category, title, description, content, status)
      VALUES (${post.slug}, ${post.category}, ${post.title}, ${post.description}, ${post.content}, ${post.status})
      RETURNING ${sql.unsafe(blogPostFields)}
    `;
    await replaceBlogImages(created.id, retainedImageIds, images);
    const [postWithImages] = await sql`
      SELECT ${sql.unsafe(blogPostFields)} FROM blog_posts WHERE id = ${created.id}
    `;
    return response.status(201).json({ post: postWithImages });
  } catch (error) {
    if (created?.id) {
      try {
        await sql`DELETE FROM blog_posts WHERE id = ${created.id}`;
      } catch (cleanupError) {
        console.error("Failed to roll back incomplete blog post:", cleanupError);
      }
    }
    if (error?.code === "23505") return response.status(409).json({ error: "That blog URL is already in use." });
    console.error("Failed to create blog post:", error);
    return response.status(500).json({ error: "Unable to save this blog post." });
  }
});

app.patch("/api/admin/blog/:id", requireAdmin, async (request, response) => {
  if (!/^\d+$/.test(request.params.id)) return response.status(400).json({ error: "Invalid blog post ID." });
  const post = readBlogPost(request.body);
  const images = readBlogImages(request.body?.images);
  const retainedImageIds = readRetainedBlogImageIds(request.body?.retainedImageIds);
  if (!post || !images || !retainedImageIds || images.length + retainedImageIds.length > 2) {
    return response.status(400).json({ error: "Check the blog post fields and images, then try again." });
  }

  try {
    const existingImages = await sql`
      SELECT id::text AS id FROM blog_post_images WHERE post_id = ${request.params.id}
    `;
    const existingImageIds = new Set(existingImages.map(({ id }) => id));
    if (retainedImageIds.some((imageId) => !existingImageIds.has(imageId))) {
      return response.status(400).json({ error: "One of the selected images no longer belongs to this post." });
    }
    const [updated] = await sql`
      UPDATE blog_posts
      SET slug = ${post.slug}, category = ${post.category}, title = ${post.title},
          description = ${post.description}, content = ${post.content},
          status = ${post.status}, updated_at = NOW()
      WHERE id = ${request.params.id}
      RETURNING ${sql.unsafe(blogPostFields)}
    `;
    if (!updated) return response.status(404).json({ error: "Blog post not found." });
    const retainedImagesAreValid = await replaceBlogImages(updated.id, retainedImageIds, images);
    if (!retainedImagesAreValid) return response.status(400).json({ error: "One of the selected images no longer belongs to this post." });
    const [postWithImages] = await sql`
      SELECT ${sql.unsafe(blogPostFields)} FROM blog_posts WHERE id = ${updated.id}
    `;
    return response.json({ post: postWithImages });
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
    CREATE TABLE IF NOT EXISTS project_enquiry_submission_claims (
      fingerprint TEXT PRIMARY KEY,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS project_enquiry_rate_limits (
      client_key TEXT PRIMARY KEY,
      window_started_at TIMESTAMPTZ NOT NULL,
      request_count INTEGER NOT NULL CHECK (request_count > 0)
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS project_enquiry_rate_limits_window_idx
    ON project_enquiry_rate_limits (window_started_at)
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS learning_support_rate_limits (
      client_key TEXT PRIMARY KEY,
      window_started_at TIMESTAMPTZ NOT NULL,
      request_count INTEGER NOT NULL CHECK (request_count > 0)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS contact_message_rate_limits (
      client_key TEXT PRIMARY KEY,
      window_started_at TIMESTAMPTZ NOT NULL,
      request_count INTEGER NOT NULL CHECK (request_count > 0)
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS learning_support_rate_limits_window_idx
    ON learning_support_rate_limits (window_started_at)
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS project_enquiry_attachments (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      enquiry_id BIGINT NOT NULL REFERENCES project_enquiries(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      media_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      data TEXT NOT NULL,
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
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views_count INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS likes_count INTEGER NOT NULL DEFAULT 0`;
  await sql`
    CREATE TABLE IF NOT EXISTS blog_post_images (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      post_id BIGINT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      media_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      data TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS blog_post_likes (
      post_id BIGINT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
      visitor_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (post_id, visitor_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS blog_post_views (
      post_id BIGINT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
      visitor_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (post_id, visitor_id)
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
  await sql`
    CREATE TABLE IF NOT EXISTS learning_progress_entries (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      account_id BIGINT NOT NULL REFERENCES learning_accounts(id) ON DELETE CASCADE,
      topic TEXT NOT NULL CHECK (char_length(topic) <= 120),
      reflection TEXT NOT NULL CHECK (char_length(reflection) <= 1200),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS learning_course_items (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      track_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('resource', 'assignment')),
      title TEXT NOT NULL CHECK (char_length(title) <= 180),
      description TEXT NOT NULL CHECK (char_length(description) <= 5000),
      resource_url TEXT,
      due_date DATE,
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS learning_item_completions (
      account_id BIGINT NOT NULL REFERENCES learning_accounts(id) ON DELETE CASCADE,
      item_id BIGINT NOT NULL REFERENCES learning_course_items(id) ON DELETE CASCADE,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (account_id, item_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS learning_assignment_submissions (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      item_id BIGINT NOT NULL REFERENCES learning_course_items(id) ON DELETE CASCADE,
      account_id BIGINT NOT NULL REFERENCES learning_accounts(id) ON DELETE CASCADE,
      response TEXT NOT NULL DEFAULT '' CHECK (char_length(response) <= 10000),
      response_url TEXT,
      status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'needs_revision')),
      feedback TEXT CHECK (char_length(feedback) <= 5000),
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (item_id, account_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS learning_tutor_assignments (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      account_id BIGINT NOT NULL UNIQUE REFERENCES learning_accounts(id) ON DELETE CASCADE,
      tutor_name TEXT NOT NULL CHECK (char_length(tutor_name) <= 160),
      tutor_email TEXT,
      notes TEXT NOT NULL DEFAULT '' CHECK (char_length(notes) <= 2000),
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