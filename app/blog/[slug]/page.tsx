import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteChrome from "../../site-chrome";
import { posts } from "../posts";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function findPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);

  if (!post) notFound();

  return {
    title: `${post.title} | Jolomi Dudu`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = findPost(slug);

  if (!post) notFound();

  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f5f5f0] text-[#111111]">
        <article className="mx-auto max-w-5xl px-6 pb-24 pt-12 md:px-12 md:pb-32 md:pt-20 lg:px-16">
          <Link href="/blog" className="text-sm font-medium text-black/55 transition-colors hover:text-[#008c87]">← Back to journal</Link>

          <header className="mt-14 border-b border-black/15 pb-10 md:mt-20 md:pb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00A9A5]">{post.category}</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-7xl">{post.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">{post.description}</p>
          </header>

          <div className="mx-auto mt-10 max-w-2xl space-y-6 text-base leading-8 text-black/75 md:mt-14 md:text-lg md:leading-9">
            {post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          <footer className="mt-16 flex flex-col gap-4 border-t border-black/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/blog" className="text-sm font-semibold underline decoration-[#00A9A5] underline-offset-4">More from the journal</Link>
            <Link href="/services" className="inline-flex items-center justify-between gap-5 bg-[#111111] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#008c87]">
              Explore services <span aria-hidden="true">↗</span>
            </Link>
          </footer>
        </article>
      </main>
    </SiteChrome>
  );
}
