import { createHmac, timingSafeEqual } from "node:crypto";
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