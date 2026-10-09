"use client";

import { useEffect, useState } from "react";
import { Eye, Heart, Share2 } from "lucide-react";

type Engagement = {
  viewsCount: number;
  likesCount: number;
  isLiked: boolean;
};

type BlogEngagementProps = {
  slug: string;
  initialViewsCount: number;
  initialLikesCount: number;
};

const readerIdStorageKey = "jolomi-blog-reader-id";

async function readEngagement(response: Response, fallbackMessage: string) {
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error(fallbackMessage);
  }
  const engagement = await response.json() as Engagement & { error?: string };
  if (!response.ok) throw new Error(engagement.error ?? fallbackMessage);
  return engagement;
}

export default function BlogEngagement({ slug, initialViewsCount, initialLikesCount }: BlogEngagementProps) {
  const [readerId, setReaderId] = useState("");
  const [viewsCount, setViewsCount] = useState(initialViewsCount);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEngagement() {
      try {
        let currentReaderId = window.localStorage.getItem(readerIdStorageKey);
        if (!currentReaderId) {
          currentReaderId = crypto.randomUUID();
          window.localStorage.setItem(readerIdStorageKey, currentReaderId);
        }
        if (!active) return;
        setReaderId(currentReaderId);

        const response = await fetch(
          `/api/blog/${encodeURIComponent(slug)}/engagement?visitorId=${encodeURIComponent(currentReaderId)}`,
          { cache: "no-store" },
        );
        const engagement = await readEngagement(response, "Post activity is temporarily unavailable.");
        if (!active) return;
        setLikesCount(engagement.likesCount);
        setViewsCount(engagement.viewsCount);
        setIsLiked(engagement.isLiked);

        const viewResponse = await fetch(`/api/blog/${encodeURIComponent(slug)}/engagement`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: currentReaderId, action: "view" }),
        });
        const updated = await readEngagement(viewResponse, "Post activity is temporarily unavailable.");
        if (!active) return;
        setViewsCount(updated.viewsCount);
        setLikesCount(updated.likesCount);
        setIsLiked(updated.isLiked);
      } catch (error) {
        if (active) setMessage(error instanceof Error ? error.message : "Unable to load post activity.");
      } finally {
        if (active) setIsReady(true);
      }
    }

    void loadEngagement();
    return () => { active = false; };
  }, [slug]);

  async function toggleLike() {
    if (!readerId || isUpdating) return;
    setIsUpdating(true);
    setMessage("");
    try {
      const response = await fetch(`/api/blog/${encodeURIComponent(slug)}/engagement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: readerId, action: isLiked ? "unlike" : "like" }),
      });
      const engagement = await readEngagement(response, "Unable to update your like.");
      setLikesCount(engagement.likesCount);
      setIsLiked(engagement.isLiked);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update your like.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function sharePost() {
    const shareData = { title: document.title, url: window.location.href };
    setMessage("");
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setMessage("Link copied.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessage("Unable to share this post from this browser.");
    }
  }

  return (
    <section aria-label="Post activity" className="mx-auto mt-14 flex max-w-2xl flex-wrap items-center gap-x-6 gap-y-4 border-t border-black/15 pt-5 text-sm">
      <span className="inline-flex items-center gap-2 text-black/55">
        <Eye aria-hidden="true" className="h-4 w-4" />
        <span>{viewsCount.toLocaleString()} views</span>
      </span>
      <button
        type="button"
        onClick={toggleLike}
        disabled={!isReady || isUpdating}
        aria-pressed={isLiked}
        className={`inline-flex items-center gap-2 transition-colors hover:text-[#008c87] disabled:cursor-wait disabled:opacity-60 ${isLiked ? "text-[#008c87]" : "text-black/65"}`}
      >
        <Heart aria-hidden="true" className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
        <span>{likesCount.toLocaleString()} {likesCount === 1 ? "like" : "likes"}</span>
      </button>
      <button type="button" onClick={sharePost} className="inline-flex items-center gap-2 text-black/65 transition-colors hover:text-[#008c87]">
        <Share2 aria-hidden="true" className="h-4 w-4" />
        <span>Share</span>
      </button>
      {message && <p role="status" className="basis-full text-xs text-black/55">{message}</p>}
    </section>
  );
}