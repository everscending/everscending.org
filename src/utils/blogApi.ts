/**
 * Blog API client — single module for all SonicJS blog HTTP calls.
 * Blog API base URL is derived from the current frontend host via getBlogApiBaseUrl().
 */

const DEFAULT_TIMEOUT_MS = 10_000;

/** User-facing error message for HTTP/network failures (avoids exposing raw status in UI). */
const BLOG_LOAD_ERROR_MESSAGE = "Couldn't load posts";

/** Host → blog API base URL (includes /api/blog). Used by getBlogApiBaseUrl. */
const HOST_TO_BLOG_API_BASE: Record<string, string> = {
    "localhost:5173": "http://localhost:8787/api/blog",
    "develop.everscending-org.pages.dev":
        "https://develop-everscending-blog.everscending.workers.dev/api/blog",
    "everscending-org.pages.dev":
        "https://everscending-blog.everscending.workers.dev/api/blog",
    "everscending.org":
        "https://everscending-blog.everscending.workers.dev/api/blog",
    "everscending-web.everscending.workers.dev":
        "https://everscending-blog.everscending.workers.dev/api/blog",
    "everscending.ai":
        "https://everscending-blog.everscending.workers.dev/api/blog",
};

/**
 * Returns the blog API base URL for the current frontend host (e.g. origin + /api/blog).
 * Uses window.location.host; returns empty string when host is unknown or not in a browser.
 */
export function getBlogApiBaseUrl(): string {
    const host = typeof window !== "undefined" ? window.location.host : "";
    return HOST_TO_BLOG_API_BASE[host] ?? "";
}

// ——— Raw SonicJS API types (align with architecture) ———
export interface SonicJSPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: string;
    publishedAt: string;
    status: string;
    tags: string;
}

export interface SonicJSPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface SonicJSPostsResponse {
    success: boolean;
    data: SonicJSPost[];
    pagination?: SonicJSPagination;
}

// ——— UI model (after mapping) ———
export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    link: string;
}

export interface BlogPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export type FetchBlogPostsResult =
    | { ok: true; data: BlogPost[]; pagination: BlogPagination }
    | { ok: false; error: string };

/** Allowed characters for safe URL path segment (slug). */
const SAFE_SLUG_REGEX = /[^a-zA-Z0-9-_]/g;

/**
 * Sanitizes slug for use in /blog/{slug} link. Uses id as fallback when slug is empty or invalid.
 */
function safeSlugForLink(raw: SonicJSPost): string {
    const slug = (raw.slug ?? "").replace(SAFE_SLUG_REGEX, "");
    if (slug) return slug;
    const idSegment = (raw.id ?? "").replace(SAFE_SLUG_REGEX, "");
    return idSegment || "untitled";
}

export function mapSonicJSPostToBlogPost(raw: SonicJSPost): BlogPost {
    const slugForLink = safeSlugForLink(raw);
    const slug = (raw.slug ?? "").replace(SAFE_SLUG_REGEX, "") || slugForLink;
    return {
        id: raw.id ?? "",
        slug,
        title: raw.title ?? "",
        excerpt: raw.excerpt ?? "",
        link: `/blog/${slugForLink}`,
    };
}

function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number,
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, {
        ...options,
        signal: controller.signal,
    }).finally(() => clearTimeout(id));
}

/**
 * Fetches blog posts from SonicJS API.
 * Return contract: { ok: true, data, pagination } | { ok: false, error }.
 */
export async function fetchBlogPosts(params?: {
    page?: number;
    limit?: number;
}): Promise<FetchBlogPostsResult> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const base = getBlogApiBaseUrl();
    if (!base) {
        return { ok: false, error: "Unknown host for blog API" };
    }
    const url = `${base}/posts?limit=${limit}&page=${page}`;

    try {
        const res = await fetchWithTimeout(
            url,
            { method: "GET" },
            DEFAULT_TIMEOUT_MS,
        );
        if (!res.ok) {
            return { ok: false, error: BLOG_LOAD_ERROR_MESSAGE };
        }
        let json: SonicJSPostsResponse;
        try {
            json = (await res.json()) as SonicJSPostsResponse;
        } catch {
            return {
                ok: false,
                error: "Invalid response from blog API",
            };
        }
        if (json.success !== true || !Array.isArray(json.data)) {
            return {
                ok: false,
                error: "Invalid response: success or data missing",
            };
        }
        // Fallback when API omits pagination (e.g. legacy or malformed response): assume single page.
        const pagination: BlogPagination = json.pagination
            ? {
                  page: Number(json.pagination.page) || 1,
                  limit: Number(json.pagination.limit) || limit,
                  total: Number(json.pagination.total) || 0,
                  totalPages: Number(json.pagination.totalPages) || 1,
              }
            : {
                  page: 1,
                  limit: json.data.length,
                  total: json.data.length,
                  totalPages: 1,
              };
        const data = json.data.map(mapSonicJSPostToBlogPost);
        return { ok: true, data, pagination };
    } catch {
        return { ok: false, error: BLOG_LOAD_ERROR_MESSAGE };
    }
}
