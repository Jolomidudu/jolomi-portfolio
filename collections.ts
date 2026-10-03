import type { Access, CollectionConfig, GlobalConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

const publishedPosts: Access = ({ req }) =>
  req.user ? true : { status: { equals: "published" } };

const publishedItems: Access = ({ req }) =>
  req.user ? true : { isPublished: { equals: true } };

export const Admins: CollectionConfig = {
  slug: "admins",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "updatedAt"],
  },
  access: {
    admin: authenticated,
    create: async ({ req }) => {
      if (req.user) return true;
      if (process.env.ADMIN_BOOTSTRAP_ENABLED !== "true") return false;

      const { totalDocs } = await req.payload.count({
        collection: "admins",
        limit: 1,
        overrideAccess: true,
      });

      return totalDocs === 0;
    },
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: "name", type: "text", required: true },
  ],
};

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "publishedAt"],
  },
  access: {
    read: publishedPosts,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: ["Technology", "Business", "Finance", "Lifestyle", "Other"],
    },
    { name: "summary", type: "textarea", required: true },
    { name: "content", type: "richText", required: true },
    { name: "coverImage", type: "relationship", relationTo: "media" },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
    { name: "publishedAt", type: "date" },
  ],
};

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "startingPrice", "isPublished", "updatedAt"],
  },
  access: {
    read: publishedItems,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "description", type: "textarea", required: true },
    { name: "startingPrice", type: "number", required: true, min: 0 },
    { name: "currency", type: "text", defaultValue: "NGN", required: true },
    { name: "pricingUnit", type: "text" },
    { name: "isPublished", type: "checkbox", defaultValue: true },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
};

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "isPublished", "updatedAt"],
  },
  access: {
    read: publishedItems,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "description", type: "textarea", required: true },
    { name: "image", type: "relationship", relationTo: "media" },
    { name: "projectUrl", type: "text" },
    { name: "technologies", type: "text", hasMany: true },
    { name: "isPublished", type: "checkbox", defaultValue: true },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
};

export const Experiences: CollectionConfig = {
  slug: "experiences",
  admin: {
    useAsTitle: "company",
    defaultColumns: ["role", "company", "startDate", "isCurrent"],
  },
  access: {
    read: publishedItems,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: "company", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "location", type: "text" },
    { name: "startDate", type: "date", required: true },
    { name: "endDate", type: "date" },
    { name: "isCurrent", type: "checkbox", defaultValue: false },
    { name: "isPublished", type: "checkbox", defaultValue: true },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
};

export const TutoringOffers: CollectionConfig = {
  slug: "tutoring-offers",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "price", "pricingUnit", "isPublished"],
  },
  access: {
    read: publishedItems,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "description", type: "textarea", required: true },
    { name: "price", type: "number", required: true, min: 0 },
    { name: "currency", type: "text", defaultValue: "NGN", required: true },
    { name: "pricingUnit", type: "text", required: true },
    { name: "isPublished", type: "checkbox", defaultValue: true },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
};

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "authorName",
    defaultColumns: ["authorName", "company", "status", "createdAt"],
  },
  access: {
    read: ({ req }) =>
      req.user ? true : { status: { equals: "approved" } },
    create: () => true,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: "authorName", type: "text", required: true },
    { name: "company", type: "text" },
    { name: "quote", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending review", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
      access: {
        create: ({ req }) => Boolean(req.user),
        update: authenticated,
      },
    },
  ],
};

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 480, height: 320, fit: "cover" },
      { name: "card", width: 1200, height: 800, fit: "cover" },
    ],
  },
  fields: [
    { name: "alt", type: "text", required: true },
  ],
};

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    { name: "contactEmail", type: "email" },
    { name: "phone", type: "text" },
    { name: "whatsapp", type: "text" },
    { name: "location", type: "text" },
    { name: "linkedinUrl", type: "text" },
    { name: "githubUrl", type: "text" },
    { name: "instagramUrl", type: "text" },
  ],
};

export const collections = [
  Admins,
  BlogPosts,
  Services,
  Projects,
  Experiences,
  TutoringOffers,
  Testimonials,
  Media,
];
