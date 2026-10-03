import seedPosts from "../../backend/blog-seed.json";
import { callRailway } from "../api/portal/railway";

export type BlogPost = {
	id?: string;
	slug: string;
	category: string;
	title: string;
	description: string;
	content: string[];
};

type StoredBlogPost = Omit<BlogPost, "content"> & { content: string | string[] };

export const seededPosts: BlogPost[] = seedPosts;

function normalizePost(post: StoredBlogPost): BlogPost {
	return {
		...post,
		content: Array.isArray(post.content)
			? post.content
			: post.content.split(/\n\s*\n/).filter(Boolean),
	};
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
	try {
		const response = await callRailway("/api/blog");
		if (!response.ok) return seededPosts;
		const result = await response.json() as { posts?: StoredBlogPost[] };
		return (result.posts ?? []).map(normalizePost);
	} catch {
		return seededPosts;
	}
}

export async function getPublishedPost(slug: string): Promise<BlogPost | undefined> {
	try {
		const response = await callRailway(`/api/blog/${encodeURIComponent(slug)}`);
		if (response.status === 404) return undefined;
		if (response.ok) {
			const result = await response.json() as { post?: StoredBlogPost };
			if (result.post) return normalizePost(result.post);
		}
	} catch {
		// The seeded articles keep the public journal available if the API is offline.
	}

	return seededPosts.find((post) => post.slug === slug);
}
