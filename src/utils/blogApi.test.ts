import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
    fetchBlogPosts,
    fetchBlogPostBySlug,
    getBlogApiBaseUrl,
    mapSonicJSPostToBlogPost,
    type SonicJSPost,
} from "./blogApi";

const originalLocationDescriptor = Object.getOwnPropertyDescriptor(
    window,
    "location",
);

function mockWindowLocation(host: string) {
    Object.defineProperty(window, "location", {
        value: { host },
        writable: true,
        configurable: true,
    });
}

function restoreWindowLocation() {
    if (originalLocationDescriptor) {
        Object.defineProperty(window, "location", originalLocationDescriptor);
    }
}

describe("getBlogApiBaseUrl", () => {
    it("returns local dev URL for localhost:5173", () => {
        mockWindowLocation("localhost:5173");
        expect(getBlogApiBaseUrl()).toBe("http://localhost:8787/api/blog");
    });

    it("returns develop URL for hosts under .everscending-org.pages.dev", () => {
        mockWindowLocation("develop.everscending-org.pages.dev");
        expect(getBlogApiBaseUrl()).toBe(
            "https://develop-everscending-blog.everscending.workers.dev/api/blog",
        );
    });

    it("returns production URL for everscending-org.pages.dev", () => {
        mockWindowLocation("everscending-org.pages.dev");
        expect(getBlogApiBaseUrl()).toBe(
            "https://everscending-blog.everscending.workers.dev/api/blog",
        );
    });

    it("returns production URL for everscending.org", () => {
        mockWindowLocation("everscending.org");
        expect(getBlogApiBaseUrl()).toBe(
            "https://everscending-blog.everscending.workers.dev/api/blog",
        );
    });

    it("returns production URL for everscending.ai", () => {
        mockWindowLocation("everscending.ai");
        expect(getBlogApiBaseUrl()).toBe(
            "https://everscending-blog.everscending.workers.dev/api/blog",
        );
    });

    it("returns local dev URL for unknown host", () => {
        mockWindowLocation("unknown.example.com");
        expect(getBlogApiBaseUrl()).toBe("http://localhost:8787/api/blog");
    });

    afterEach(() => {
        restoreWindowLocation();
    });
});

describe("blogApi", () => {
    beforeEach(() => {
        mockWindowLocation("localhost:5173");
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        restoreWindowLocation();
    });

    describe("fetchBlogPosts", () => {
        it("uses host-derived base and correct path with default page and limit", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    data: [],
                    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
                }),
            });
            await fetchBlogPosts();
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringMatching(
                    /^http:\/\/localhost:8787\/api\/blog\/posts\?limit=\d+&page=1$/,
                ),
                expect.objectContaining({ method: "GET" }),
            );
        });

        it("uses provided page and limit in URL", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    data: [],
                    pagination: { page: 2, limit: 10, total: 0, totalPages: 0 },
                }),
            });
            await fetchBlogPosts({ page: 2, limit: 10 });
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8787/api/blog/posts?limit=10&page=2",
                expect.any(Object),
            );
        });

        it("returns ok: true with mapped UI shape on success", async () => {
            const raw: SonicJSPost = {
                id: "id-1",
                slug: "hello",
                title: "Hello",
                excerpt: "Excerpt",
                content: "<p>Hi</p>",
                featuredImage: "/img.jpg",
                author: "Jordan",
                publishedAt: "2026-01-01",
                status: "published",
                tags: "meta",
            };
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    data: [raw],
                    pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
                }),
            });
            const result = await fetchBlogPosts();
            expect(result).toEqual({
                ok: true,
                data: [
                    {
                        id: "id-1",
                        slug: "hello",
                        title: "Hello",
                        excerpt: "Excerpt",
                        link: "/blog/hello",
                        publishedAt: "2026-01-01",
                    },
                ],
                pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
            });
        });

        it("returns ok: false when success is false", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: false }),
            });
            const result = await fetchBlogPosts();
            expect(result).toEqual({
                ok: false,
                error: "Invalid response: success or data missing",
            });
        });

        it("returns ok: false when data is missing", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            });
            const result = await fetchBlogPosts();
            expect(result).toEqual({
                ok: false,
                error: "Invalid response: success or data missing",
            });
        });

        it("returns ok: false when data is not an array", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true, data: {} }),
            });
            const result = await fetchBlogPosts();
            expect(result).toEqual({
                ok: false,
                error: "Invalid response: success or data missing",
            });
        });

        it("returns ok: false with user-friendly message when 2xx body is not JSON", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => {
                    throw new SyntaxError("Unexpected token '<' in JSON");
                },
            });
            const result = await fetchBlogPosts();
            expect(result).toEqual({
                ok: false,
                error: "Invalid response from blog API",
            });
        });

        it("returns ok: false with user-facing message when response is non-2xx", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: "Internal Server Error",
            });
            const result = await fetchBlogPosts();
            expect(result).toEqual({
                ok: false,
                error: "Couldn't load posts",
            });
        });

        it("falls back to local dev base for unknown host and calls fetch", async () => {
            mockWindowLocation("unknown.example.com");
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    data: [],
                    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
                }),
            });
            await fetchBlogPosts();
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringMatching(
                    /^http:\/\/localhost:8787\/api\/blog\/posts\?limit=\d+&page=1$/,
                ),
                expect.objectContaining({ method: "GET" }),
            );
        });

        it("returns ok: false with user-facing message on network error", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new Error("Network error"),
            );
            const result = await fetchBlogPosts();
            expect(result).toEqual({ ok: false, error: "Couldn't load posts" });
        });

        it("returns ok: false with user-facing message when request times out (abort after 10s)", async () => {
            vi.useFakeTimers();
            (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
                (_url: string, options?: RequestInit) =>
                    new Promise((_, reject) => {
                        const signal = options?.signal;
                        if (signal) {
                            signal.addEventListener(
                                "abort",
                                () =>
                                    reject(
                                        new DOMException(
                                            "The operation was aborted.",
                                            "AbortError",
                                        ),
                                    ),
                                { once: true },
                            );
                        }
                    }),
            );
            const resultP = fetchBlogPosts();
            await vi.advanceTimersByTimeAsync(9_999);
            expect(resultP).toBeInstanceOf(Promise);
            await vi.advanceTimersByTimeAsync(2);
            const result = await resultP;
            vi.useRealTimers();
            expect(result).toEqual({ ok: false, error: "Couldn't load posts" });
        });
    });

    describe("mapSonicJSPostToBlogPost", () => {
        it("maps raw post to UI model with link from slug", () => {
            const raw: SonicJSPost = {
                id: "a",
                slug: "my-post",
                title: "Title",
                excerpt: "Excerpt",
                content: "",
                featuredImage: "",
                author: "",
                publishedAt: "",
                status: "",
                tags: "",
            };
            expect(mapSonicJSPostToBlogPost(raw)).toEqual({
                id: "a",
                slug: "my-post",
                title: "Title",
                excerpt: "Excerpt",
                link: "/blog/my-post",
            });
        });

        it("uses defensive fallbacks for missing id, slug, or title", () => {
            const raw = {
                id: undefined,
                slug: undefined,
                title: undefined,
                excerpt: "Excerpt",
                content: "",
                featuredImage: "",
                author: "",
                publishedAt: "",
                status: "",
                tags: "",
            } as unknown as SonicJSPost;
            expect(mapSonicJSPostToBlogPost(raw)).toEqual({
                id: "",
                slug: "untitled",
                title: "",
                excerpt: "Excerpt",
                link: "/blog/untitled",
            });
        });

        it("sanitizes slug to safe URL segment (alphanumeric, hyphen, underscore only)", () => {
            const raw: SonicJSPost = {
                id: "b",
                slug: "my/post?x=1",
                title: "Title",
                excerpt: "",
                content: "",
                featuredImage: "",
                author: "",
                publishedAt: "",
                status: "",
                tags: "",
            };
            expect(mapSonicJSPostToBlogPost(raw)).toEqual({
                id: "b",
                slug: "mypostx1",
                title: "Title",
                excerpt: "",
                link: "/blog/mypostx1",
            });
        });
    });

    describe("fetchBlogPostBySlug", () => {
        it("returns ok: true with data including content for successful response", async () => {
            const raw: SonicJSPost = {
                id: "id-1",
                slug: "hello",
                title: "Hello",
                excerpt: "Excerpt",
                content: "<p>Hello <strong>world</strong></p>",
                featuredImage: "/img.jpg",
                author: "Jordan",
                publishedAt: "2026-01-01",
                status: "published",
                tags: "meta",
            };
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true, data: raw }),
            });
            const result = await fetchBlogPostBySlug("hello");
            expect(result).toEqual({
                ok: true,
                data: {
                    id: "id-1",
                    slug: "hello",
                    title: "Hello",
                    excerpt: "Excerpt",
                    link: "/blog/hello",
                    content: "<p>Hello <strong>world</strong></p>",
                    author: "Jordan",
                    publishedAt: "2026-01-01",
                },
            });
        });

        it("returns ok: false with Post not found for HTTP 404", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                status: 404,
            });
            const result = await fetchBlogPostBySlug("missing");
            expect(result).toEqual({
                ok: false,
                error: "Post not found",
            });
        });

        it("returns ok: false with Post not found when success is false and no data", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: false }),
            });
            const result = await fetchBlogPostBySlug("missing");
            expect(result).toEqual({
                ok: false,
                error: "Post not found",
            });
        });

        it("returns ok: false with Couldn't load post for 5xx", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                status: 500,
            });
            const result = await fetchBlogPostBySlug("any");
            expect(result).toEqual({
                ok: false,
                error: "Couldn't load post",
            });
        });

        it("returns ok: false with Couldn't load post on network error", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new Error("Network error"),
            );
            const result = await fetchBlogPostBySlug("any");
            expect(result).toEqual({
                ok: false,
                error: "Couldn't load post",
            });
        });

        it("calls GET posts/:slug with slug in path", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        id: "1",
                        slug: "my-post",
                        title: "Title",
                        excerpt: "",
                        content: "",
                        featuredImage: "",
                        author: "",
                        publishedAt: "",
                        status: "",
                        tags: "",
                    },
                }),
            });
            await fetchBlogPostBySlug("my-post");
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8787/api/blog/posts/my-post",
                expect.objectContaining({ method: "GET" }),
            );
        });

        it("returns ok: false with Post not found for empty slug and does not call fetch", async () => {
            const result = await fetchBlogPostBySlug("");
            expect(result).toEqual({
                ok: false,
                error: "Post not found",
            });
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it("returns ok: false with Post not found for slug with unsafe characters and does not call fetch", async () => {
            const result = await fetchBlogPostBySlug("hello/world");
            expect(result).toEqual({
                ok: false,
                error: "Post not found",
            });
            expect(global.fetch).not.toHaveBeenCalled();
        });
    });
});
