"use client";

import { useEffect, useState, type FormEvent } from "react";

type BlogPost = {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  content: string;
  status: "draft" | "published";
  images: BlogImage[];
  createdAt: string;
  updatedAt: string;
};

type BlogImage = {
  id: string;
  name: string;
  mediaType: string;
  sizeBytes: number;
};

type PendingBlogImage = {
  file: File;
  preview: string;
};

type PostForm = Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "images">;

const categories = [
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
];

const emptyForm: PostForm = {
  slug: "",
  category: categories[0],
  title: "",
  description: "",
  content: "",
  status: "draft",
};

function toForm(post: BlogPost): PostForm {
  return {
    slug: post.slug,
    category: post.category,
    title: post.title,
    description: post.description,
    content: post.content,
    status: post.status,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string"
      ? resolve(reader.result)
      : reject(new Error("Unable to read this image."));
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read this image."));
    reader.readAsDataURL(file);
  });
}

const maxBlogImageCount = 2;
const maxBlogImageSize = 2 * 1024 * 1024;
const allowedBlogImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [retainedImages, setRetainedImages] = useState<BlogImage[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingBlogImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [slugWasEdited, setSlugWasEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        const response = await fetch("/api/portal/blog", { cache: "no-store" });
        const result = await response.json() as { posts?: BlogPost[]; error?: string };
        if (!active) return;
        if (!response.ok) throw new Error(result.error ?? "Unable to load blog posts.");
        setPosts(result.posts ?? []);
      } catch (error) {
        if (active) setErrorMessage(error instanceof Error ? error.message : "Unable to load blog posts.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadPosts();
    return () => { active = false; };
  }, []);

  const filteredPosts = posts.filter((post) =>
    `${post.title} ${post.category} ${post.status}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function startNewPost() {
    setForm(emptyForm);
    setRetainedImages([]);
    setPendingImages([]);
    setSelectedId(null);
    setIsCreating(true);
    setSlugWasEdited(false);
    setErrorMessage("");
    setNotice("");
  }

  function selectPost(post: BlogPost) {
    setForm(toForm(post));
    setRetainedImages(post.images ?? []);
    setPendingImages([]);
    setSelectedId(post.id);
    setIsCreating(false);
    setErrorMessage("");
    setNotice("");
  }

  async function addImages(files: FileList | null) {
    if (!files?.length) return;
    const selectedFiles = Array.from(files);
    if (selectedFiles.length + retainedImages.length + pendingImages.length > maxBlogImageCount) {
      setErrorMessage("A blog post can have at most two images.");
      return;
    }

    for (const file of selectedFiles) {
      const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
      if (!allowedBlogImageExtensions.has(extension)) {
        setErrorMessage("Use a JPG, PNG, WEBP or GIF image.");
        return;
      }
      if (file.size > maxBlogImageSize) {
        setErrorMessage("Each image must be 2 MB or smaller.");
        return;
      }
    }

    try {
      const additions = await Promise.all(selectedFiles.map(async (file) => ({
        file,
        preview: await readImageAsDataUrl(file),
      })));
      setPendingImages((current) => [...current, ...additions]);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to read this image.");
    }
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setNotice("");

    try {
      const response = await fetch(isCreating ? "/api/portal/blog" : `/api/portal/blog/${selectedId}`, {
        method: isCreating ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          retainedImageIds: retainedImages.map(({ id }) => id),
          images: pendingImages.map(({ file, preview }) => ({
            name: file.name,
            data: preview.split(",", 2)[1],
          })),
        }),
      });
      const result = await response.json() as { post?: BlogPost; error?: string };
      if (!response.ok || !result.post) throw new Error(result.error ?? "Unable to save this post.");

      const savedPost = result.post;
      setPosts((current) => [savedPost, ...current.filter(({ id }) => id !== savedPost.id)]);
      setSelectedId(savedPost.id);
      setForm(toForm(savedPost));
      setRetainedImages(savedPost.images ?? []);
      setPendingImages([]);
      setIsCreating(false);
      setNotice(savedPost.status === "published" ? "Post published." : "Draft saved.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save this post.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePost() {
    if (!selectedId || !window.confirm("Delete this post? This cannot be undone.")) return;

    setIsSaving(true);
    setErrorMessage("");
    setNotice("");
    try {
      const response = await fetch(`/api/portal/blog/${selectedId}`, { method: "DELETE" });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to delete this post.");
      setPosts((current) => current.filter(({ id }) => id !== selectedId));
      setForm(emptyForm);
      setRetainedImages([]);
      setPendingImages([]);
      setSelectedId(null);
      setIsCreating(false);
      setNotice("Post deleted.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete this post.");
    } finally {
      setIsSaving(false);
    }
  }

  const hasSelection = isCreating || selectedId !== null;

  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.5fr)]">
      <section className="border-b border-black/10 bg-white lg:border-b-0 lg:border-r">
        <div className="border-b border-black/10 p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-semibold">blog posts</h2>
            <span className="text-xs text-black/45">{posts.length} total</span>
          </div>
          <button
            type="button"
            onClick={startNewPost}
            className="mt-4 w-full bg-[#111111] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#008c87]"
          >
            Write a post
          </button>
          <input
            type="search"
            aria-label="Search blog posts"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, category, status"
            className="mt-3 w-full rounded-md border border-black/15 bg-[#f5f5f0] px-3 py-2.5 text-sm outline-none focus:border-[#00A9A5]"
          />
        </div>

        {isLoading ? (
          <p className="p-5 text-sm text-black/50">Loading posts...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="p-5 text-sm text-black/50">
            {posts.length === 0 ? "No posts yet. Start with a new post." : "No posts match your search."}
          </p>
        ) : (
          <ul className="divide-y divide-black/10">
            {filteredPosts.map((post) => (
              <li key={post.id}>
                <button
                  type="button"
                  onClick={() => selectPost(post)}
                  aria-current={selectedId === post.id ? "true" : undefined}
                  className={`w-full border-l-2 px-4 py-4 text-left transition-colors sm:px-5 ${selectedId === post.id ? "border-[#00A9A5] bg-[#00A9A5]/5" : "border-transparent hover:bg-black/[0.025]"}`}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold">{post.title}</span>
                    <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] ${post.status === "published" ? "text-[#007d79]" : "text-black/40"}`}>
                      {post.status}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-black/50">{post.category} · {formatDate(post.updatedAt)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-live="polite" className="p-5 sm:p-8">
        {hasSelection ? (
          <form className="mx-auto max-w-3xl space-y-5" onSubmit={savePost}>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#008e8a]">
                  {isCreating ? "New article" : "Edit article"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{form.title || "Untitled post"}</h2>
              </div>
              {!isCreating && (
                <button
                  type="button"
                  onClick={deletePost}
                  disabled={isSaving}
                  className="border border-red-700/25 px-3 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  Delete post
                </button>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium sm:col-span-2">
                Title
                <input
                  required
                  maxLength={180}
                  value={form.title}
                  onChange={(event) => setForm((current) => ({
                    ...current,
                    title: event.target.value,
                    ...(isCreating && !slugWasEdited ? { slug: slugify(event.target.value) } : {}),
                  }))}
                  className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]"
                />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                URL slug
                <input
                  required
                  maxLength={120}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugWasEdited(true);
                    setForm((current) => ({ ...current, slug: slugify(event.target.value) }));
                  }}
                  placeholder="your-post-url"
                  className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]"
                />
              </label>
              <label className="block text-sm font-medium">
                Category
                <select
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]"
                >
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Visibility
                <select
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as PostForm["status"] }))}
                  className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Short description
                <textarea
                  required
                  maxLength={500}
                  rows={3}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="mt-2 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-3 leading-6 outline-none focus:border-[#00A9A5]"
                />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Article text
                <textarea
                  required
                  maxLength={50000}
                  rows={16}
                  value={form.content}
                  onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                  placeholder="Write in plain text. Separate paragraphs with a blank line."
                  className="mt-2 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-3 leading-7 outline-none focus:border-[#00A9A5]"
                />
              </label>
              <div className="sm:col-span-2">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">Post images</p>
                  <span className="text-xs text-black/45">{retainedImages.length + pendingImages.length} / {maxBlogImageCount}</span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {retainedImages.map((image) => (
                    <div key={image.id} className="relative border border-black/10 bg-white p-2">
                      <img
                        src={`/api/portal/blog/${selectedId}/images/${image.id}`}
                        alt={image.name}
                        className="aspect-[16/10] w-full object-cover"
                      />
                      <p className="mt-2 truncate pr-9 text-xs text-black/60">{image.name}</p>
                      <button
                        type="button"
                        onClick={() => setRetainedImages((current) => current.filter(({ id }) => id !== image.id))}
                        aria-label={`Remove ${image.name}`}
                        className="absolute right-3 top-3 bg-white px-2 py-1 text-xs font-semibold text-red-800 shadow-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {pendingImages.map(({ file, preview }, index) => (
                    <div key={`${file.name}-${index}`} className="relative border border-black/10 bg-white p-2">
                      <img src={preview} alt={file.name} className="aspect-[16/10] w-full object-cover" />
                      <p className="mt-2 truncate pr-9 text-xs text-black/60">{file.name}</p>
                      <button
                        type="button"
                        onClick={() => setPendingImages((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                        aria-label={`Remove ${file.name}`}
                        className="absolute right-3 top-3 bg-white px-2 py-1 text-xs font-semibold text-red-800 shadow-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                {retainedImages.length + pendingImages.length < maxBlogImageCount && (
                  <label className="mt-3 inline-flex cursor-pointer items-center border border-black/15 px-3 py-2 text-sm font-medium transition-colors hover:border-[#00A9A5]">
                    Add image
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.gif"
                      multiple
                      className="sr-only"
                      onChange={(event) => {
                        void addImages(event.target.files);
                        event.target.value = "";
                      }}
                    />
                  </label>
                )}
                <p className="mt-2 text-xs text-black/45">JPG, PNG, WEBP or GIF. Maximum 2 MB each.</p>
              </div>
            </div>

            {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
            {notice && <p role="status" className="text-sm text-[#007d79]">{notice}</p>}
            <div className="flex flex-wrap items-center gap-3 border-t border-black/10 pt-5">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#008c87] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : form.status === "published" ? "Publish post" : "Save draft"}
              </button>
              {form.status === "published" && selectedId && (
                <a href={`/blog/${form.slug}`} target="_blank" rel="noreferrer" className="text-sm font-semibold underline decoration-[#00A9A5] underline-offset-4">
                  View published post
                </a>
              )}
            </div>
          </form>
        ) : (
          <div className="flex min-h-64 items-center justify-center text-center text-sm text-black/45">
            Select a post to edit it, or start a new one.
          </div>
        )}
      </section>
    </div>
  );
}