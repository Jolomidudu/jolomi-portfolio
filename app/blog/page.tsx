import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteChrome from "../site-chrome";
import { getPublishedPosts } from "./posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on business, technology, lifestyle and finance from Jolomi Dudu.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">
        <section className="px-6 pb-20 pt-20 md:px-12 md:pb-28 md:pt-28 lg:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">The blog</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <h1 className="max-w-4xl text-6xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">Ideas for building a better life and business.</h1>
            <p className="max-w-md text-lg leading-8 text-black/60">Short, useful essays about technology, business, lifestyle and finance.</p>
          </div>
        </section>

        <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
            {posts.map((post, index) => (
              <article key={post.slug} className="border-t border-black/15 pt-5">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                  <span>{post.category}</span>
                  <span>0{index + 1}</span>
                </div>
                <h2 className="mt-16 max-w-lg text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{post.title}</h2>
                <p className="mt-4 max-w-md leading-7 text-black/60">{post.description}</p>
                <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline decoration-[#00A9A5] underline-offset-4">
                  <span>Read more</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
