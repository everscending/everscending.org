/**
 * Blog API client — single module for all SonicJS blog HTTP calls.
 * Blog API base URL is derived from the current frontend host via getBlogApiBaseUrl().
 */

const DEFAULT_TIMEOUT_MS = 10_000;

/** User-facing error message for HTTP/network failures (avoids exposing raw status in UI). */
const BLOG_LOAD_ERROR_MESSAGE = "Couldn't load posts";

/** User-facing error for single-post not found (404 or success=false with no data). */
const POST_NOT_FOUND_MESSAGE = "Post not found";

/** User-facing error for single-post load failures (network, 5xx). */
const POST_LOAD_ERROR_MESSAGE = "Couldn't load post";

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

/** Detail UI type for single-post view; includes HTML content from API. */
export interface BlogPostDetail {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    link: string;
    content: string;
    author?: string;
    publishedAt?: string;
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

export type FetchBlogPostBySlugResult =
    | { ok: true; data: BlogPostDetail }
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

/** Maps SonicJS single-post response to detail UI type including content. */
export function mapSonicJSPostToBlogPostDetail(
    raw: SonicJSPost,
): BlogPostDetail {
    const slugForLink = safeSlugForLink(raw);
    const slug = (raw.slug ?? "").replace(SAFE_SLUG_REGEX, "") || slugForLink;
    return {
        id: raw.id ?? "",
        slug,
        title: raw.title ?? "",
        excerpt: raw.excerpt ?? "",
        link: `/blog/${slugForLink}`,
        content: raw.content ?? "",
        author: raw.author ?? undefined,
        publishedAt: raw.publishedAt ?? undefined,
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

/** Single-post response shape from SonicJS (GET /posts/:slug). */
interface SonicJSPostResponse {
    success: boolean;
    data?: SonicJSPost;
}

/**
 * Returns true if slug is non-empty and contains only safe path characters (a-z, A-Z, 0-9, -, _).
 */
function isValidRequestSlug(slug: string): boolean {
    const trimmed = slug.trim();
    if (!trimmed) return false;
    return trimmed.replace(SAFE_SLUG_REGEX, "") === trimmed;
}

/**
 * Fetches a single blog post by slug from SonicJS API.
 * Return contract: { ok: true, data: BlogPostDetail } | { ok: false, error }.
 * Use error "Post not found" for 404 or success=false with no data; "Couldn't load post" for network/5xx.
 * Invalid slug format (empty or unsafe characters) returns "Post not found" without calling the API.
 */
export async function fetchBlogPostBySlug(
    slug: string,
): Promise<FetchBlogPostBySlugResult> {
    if (!isValidRequestSlug(slug)) {
        return { ok: false, error: POST_NOT_FOUND_MESSAGE };
    }
    const base = getBlogApiBaseUrl();
    if (!base) {
        return { ok: false, error: "Unknown host for blog API" };
    }
    const encodedSlug = encodeURIComponent(slug);
    const url = `${base}/posts/${encodedSlug}`;

    try {
        const res = await fetchWithTimeout(
            url,
            { method: "GET" },
            DEFAULT_TIMEOUT_MS,
        );
        if (res.status === 404) {
            return { ok: false, error: POST_NOT_FOUND_MESSAGE };
        }
        if (!res.ok) {
            return { ok: false, error: POST_LOAD_ERROR_MESSAGE };
        }
        let json: SonicJSPostResponse;
        try {
            json = (await res.json()) as SonicJSPostResponse;
        } catch {
            return {
                ok: false,
                error: "Invalid response from blog API",
            };
        }
        if (json.success !== true || !json.data) {
            return { ok: false, error: POST_NOT_FOUND_MESSAGE };
        }
        const data = mapSonicJSPostToBlogPostDetail(json.data);
        return { ok: true, data };
    } catch {
        return { ok: false, error: POST_LOAD_ERROR_MESSAGE };
    }
}
