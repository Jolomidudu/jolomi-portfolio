import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { Admins, BlogPosts, Experiences, Media, Projects, Services, SiteSettings, Testimonials, TutoringOffers, collections } from "./collections";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "replace-me-with-a-long-random-secret",
  admin: {
    user: "admins",
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  collections,
  globals: [SiteSettings],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/postgres",
    },
  }),
  plugins: [
    s3Storage({
      bucket: process.env.NEON_S3_BUCKET || "",
      config: {
        region: process.env.NEON_S3_REGION || "auto",
        credentials: {
          accessKeyId: process.env.NEON_S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.NEON_S3_SECRET_ACCESS_KEY || "",
        },
        endpoint: process.env.NEON_S3_ENDPOINT || "",
        forcePathStyle: true,
      },
      collections: {
        media: {
          prefix: "media",
        },
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  localization: {
    defaultLocale: "en",
    fallback: true,
    locales: ["en"],
  },
});
