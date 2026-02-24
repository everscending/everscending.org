import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BlogPostPage from "./BlogPostPage";
import * as blogApi from "../utils/blogApi";
import type { BlogPostDetail } from "../utils/blogApi";

vi.mock("../utils/blogApi");

const mockFetchBlogPostBySlug = vi.mocked(blogApi.fetchBlogPostBySlug);

function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
}

function renderWithClient(slug: string): ReturnType<typeof render> {
    const client = createTestQueryClient();
    return render(
        <QueryClientProvider client={client}>
            <MemoryRouter initialEntries={[`/blog/${slug}`]}>
                <Routes>
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>,
    );
}

/** Renders BlogPostPage with no slug (route /blog with optional :slug so slug is undefined). */
function renderWithEmptySlug(): ReturnType<typeof render> {
    const client = createTestQueryClient();
    return render(
        <QueryClientProvider client={client}>
            <MemoryRouter initialEntries={["/blog"]}>
                <Routes>
                    <Route path="/blog/:slug?" element={<BlogPostPage />} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>,
    );
}

const mockPost: BlogPostDetail = {
    id: "1",
    slug: "hello",
    title: "Hello World",
    excerpt: "An excerpt",
    link: "/blog/hello",
    content: "<p>Hello <strong>world</strong> content</p>",
    author: "Jordan",
    publishedAt: "2026-01-01",
};

describe("BlogPostPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading while fetching", () => {
        mockFetchBlogPostBySlug.mockImplementation(
            () =>
                new Promise(() => {
                    /* never resolves */
                }),
        );
        renderWithClient("hello");
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("renders post title and content when success", async () => {
        mockFetchBlogPostBySlug.mockResolvedValueOnce({
            ok: true,
            data: mockPost,
        });
        renderWithClient("hello");
        await screen.findByRole("heading", { name: /hello world/i });
        expect(screen.getByText(/hello world/i)).toBeInTheDocument();
        const article = screen.getByRole("article", { name: /blog post/i });
        expect(article).toHaveTextContent(/hello world content/i);
    });

    it("shows Post not found for not-found error", async () => {
        mockFetchBlogPostBySlug.mockResolvedValueOnce({
            ok: false,
            error: "Post not found",
        });
        renderWithClient("missing");
        await screen.findByText(/post not found/i);
        expect(screen.getByText(/post not found/i)).toBeInTheDocument();
    });

    it("shows Couldn't load post for generic error", async () => {
        mockFetchBlogPostBySlug.mockResolvedValueOnce({
            ok: false,
            error: "Couldn't load post",
        });
        renderWithClient("any");
        await screen.findByText(/couldn't load post/i);
        expect(screen.getByText(/couldn't load post/i)).toBeInTheDocument();
    });

    it("calls fetchBlogPostBySlug with slug from route", async () => {
        mockFetchBlogPostBySlug.mockResolvedValueOnce({
            ok: true,
            data: mockPost,
        });
        renderWithClient("my-post-slug");
        await screen.findByRole("heading", { name: /hello world/i });
        expect(mockFetchBlogPostBySlug).toHaveBeenCalledWith("my-post-slug");
    });

    it("uses article landmark with accessible name", async () => {
        mockFetchBlogPostBySlug.mockResolvedValueOnce({
            ok: true,
            data: mockPost,
        });
        renderWithClient("hello");
        await screen.findByRole("heading", { name: /hello world/i });
        const article = screen.getByRole("article", { name: /blog post/i });
        expect(article).toBeInTheDocument();
    });

    it("shows Post not found when slug is missing or empty", () => {
        renderWithEmptySlug();
        expect(screen.getByText(/post not found/i)).toBeInTheDocument();
        expect(mockFetchBlogPostBySlug).not.toHaveBeenCalled();
    });

    it("sanitizes HTML content with DOMPurify (strips script and event handlers)", async () => {
        mockFetchBlogPostBySlug.mockResolvedValueOnce({
            ok: true,
            data: {
                ...mockPost,
                content:
                    '<p>Safe paragraph</p><script>window.evil = true</script><img src=x onerror="window.evil = true">',
            },
        });
        renderWithClient("hello");
        await screen.findByText(/safe paragraph/i);
        expect(screen.getByText(/safe paragraph/i)).toBeInTheDocument();
        expect(
            screen.queryByText("window.evil = true"),
        ).not.toBeInTheDocument();
    });
});
