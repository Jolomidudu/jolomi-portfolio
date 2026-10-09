import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import SiteChrome from "../../site-chrome";
import { getPublishedPost, seededPosts } from "../posts";
import BlogEngagement from "./blog-engagement";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seededPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) notFound();

  return {
    title: `${post.title} | Jolomi Dudu`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) notFound();

  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">
        <article className="mx-auto max-w-5xl px-6 pb-24 pt-12 md:px-12 md:pb-32 md:pt-20 lg:px-16">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-black/55 transition-colors hover:text-[#008c87]"><ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to blog</Link>

          <header className="mt-14 border-b border-black/15 pb-10 md:mt-20 md:pb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">{post.category}</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-7xl">{post.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">{post.description}</p>
          </header>

          {post.images && post.images.length > 0 && (
            <div className={`mt-10 grid gap-4 ${post.images.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {post.images.map((image) => (
                <Image
                  key={image.id}
                  src={`/api/blog/${encodeURIComponent(post.slug)}/images/${encodeURIComponent(image.id)}`}
                  alt={image.name}
                  width={1400}
                  height={875}
                  unoptimized
                  className="h-auto max-h-[38rem] w-full object-cover"
                />
              ))}
            </div>
          )}

          <div className="mx-auto mt-10 max-w-2xl space-y-6 text-base leading-8 text-black/75 md:mt-14 md:text-lg md:leading-9">
            {post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          <BlogEngagement
            slug={post.slug}
            initialViewsCount={post.viewsCount ?? 0}
            initialLikesCount={post.likesCount ?? 0}
          />

          <footer className="mt-16 flex flex-col gap-4 border-t border-black/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/blog" className="text-sm font-semibold underline decoration-[#00A9A5] underline-offset-4">More from the blog</Link>
            <Link href="/services" className="inline-flex items-center justify-between gap-3 bg-[#111111] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#008c87]">
              <span>Explore services</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </footer>
        </article>
      </main>
    </SiteChrome>
  );
}
