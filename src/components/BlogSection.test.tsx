import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BlogSection from "./BlogSection";
import * as blogApi from "../utils/blogApi";
import type { BlogPost } from "../utils/blogApi";

vi.mock("../utils/blogApi");

const mockFetchBlogPosts = vi.mocked(blogApi.fetchBlogPosts);

function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
}

function renderWithClient(ui: React.ReactElement): ReturnType<typeof render> {
    const client = createTestQueryClient();
    return render(
        <QueryClientProvider client={client}>
            <MemoryRouter>{ui}</MemoryRouter>
        </QueryClientProvider>,
    );
}

const mockPosts: BlogPost[] = [
    {
        id: "1",
        slug: "first-post",
        title: "First Post",
        excerpt: "First excerpt",
        link: "/blog/first-post",
    },
    {
        id: "2",
        slug: "second-post",
        title: "Second Post",
        excerpt: "Second excerpt",
        link: "/blog/second-post",
    },
];

describe("BlogSection", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls fetchBlogPosts with page 1 and limit 2", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 2, total: 0, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByText(/no posts yet/i);
        expect(mockFetchBlogPosts).toHaveBeenCalledWith({ page: 1, limit: 2 });
    });

    it("renders a section with aria-label Blog", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByText(/no posts yet/i);
        const section = screen.getByRole("region", { name: /blog/i });
        expect(section).toBeInTheDocument();
    });

    it("renders a visible heading (Blog or Latest)", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByText(/no posts yet/i);
        const heading = screen.getByRole("heading", {
            name: /^(blog|latest)$/i,
        });
        expect(heading).toBeInTheDocument();
    });

    it("shows an in-place loading state when content is not available", () => {
        mockFetchBlogPosts.mockImplementation(
            () =>
                new Promise(() => {
                    /* never resolves to keep loading */
                }),
        );
        renderWithClient(<BlogSection />);
        expect(
            screen.getByText(/loading/i, { exact: false }),
        ).toBeInTheDocument();
    });

    it("uses semantic structure (section landmark and heading)", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByText(/no posts yet/i);
        const section = screen.getByRole("region", { name: /blog/i });
        const heading = section.querySelector("h2");
        expect(heading).toBeInTheDocument();
    });

    it("sets aria-busy from actual loading state", async () => {
        let resolveFetch: (
            value: Awaited<ReturnType<typeof blogApi.fetchBlogPosts>>,
        ) => void;
        const fetchPromise = new Promise<
            Awaited<ReturnType<typeof blogApi.fetchBlogPosts>>
        >((resolve) => {
            resolveFetch = resolve;
        });
        mockFetchBlogPosts.mockReturnValueOnce(fetchPromise);
        renderWithClient(<BlogSection />);
        const section = screen.getByRole("region", { name: /blog/i });
        expect(section).toHaveAttribute("aria-busy", "true");
        resolveFetch!({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
        });
        await screen.findByText(/no posts yet/i);
        expect(section).toHaveAttribute("aria-busy", "false");
    });

    it("renders list of posts when fetch returns success with data", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: mockPosts,
            pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        const links = await screen.findAllByRole("link");
        expect(links).toHaveLength(2);
        expect(links[0]).toHaveAttribute("href", "/blog/first-post");
        expect(links[1]).toHaveAttribute("href", "/blog/second-post");
        const list = screen.getByRole("list");
        expect(list).toBeInTheDocument();
        expect(list.querySelectorAll("li").length).toBe(2);
    });

    it("has exactly one focusable link per post", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: mockPosts,
            pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        const listItems = screen.getByRole("list").querySelectorAll("li");
        listItems.forEach((li) => {
            const links = li.querySelectorAll("a[href]");
            expect(links).toHaveLength(1);
        });
    });

    it("shows empty message when data is empty", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        expect(await screen.findByText(/no posts yet/i)).toBeInTheDocument();
    });

    it("shows error message when fetch fails", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: false,
            error: "Couldn't load posts",
        });
        renderWithClient(<BlogSection />);
        expect(
            await screen.findByText(/couldn't load posts/i),
        ).toBeInTheDocument();
    });

    it("shows custom error message from API in UI", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: false,
            error: "Unknown host for blog API",
        });
        renderWithClient(<BlogSection />);
        expect(
            await screen.findByText(/unknown host for blog api/i),
        ).toBeInTheDocument();
    });

    it("shows loading then error when fetch fails after delay", async () => {
        let resolveFetch: (
            value: Awaited<ReturnType<typeof blogApi.fetchBlogPosts>>,
        ) => void;
        const fetchPromise = new Promise<
            Awaited<ReturnType<typeof blogApi.fetchBlogPosts>>
        >((resolve) => {
            resolveFetch = resolve;
        });
        mockFetchBlogPosts.mockReturnValueOnce(fetchPromise);
        renderWithClient(<BlogSection />);
        expect(
            screen.getByText(/loading/i, { exact: false }),
        ).toBeInTheDocument();
        resolveFetch!({ ok: false, error: "Couldn't load posts" });
        expect(
            await screen.findByText(/couldn't load posts/i),
        ).toBeInTheDocument();
    });
});
