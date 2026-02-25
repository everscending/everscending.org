import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
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

    it("calls fetchBlogPosts with page and limit", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByText(/no posts yet/i);
        expect(mockFetchBlogPosts).toHaveBeenCalledTimes(1);
        const callArg = mockFetchBlogPosts.mock.calls[0][0];
        expect(callArg).toBeDefined();
        if (!callArg) throw new Error("expected one call");
        expect(callArg).toHaveProperty("page", 1);
        expect(callArg).toHaveProperty("limit");
        expect(typeof callArg.limit).toBe("number");
    });

    it("renders a section with aria-label Blog", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByText(/no posts yet/i);
        const section = screen.getByRole("region", { name: /blog/i });
        expect(section).toBeInTheDocument();
    });

    it("uses semantic structure (section landmark)", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByText(/no posts yet/i);
        const section = screen.getByRole("region", { name: /blog/i });
        expect(section).toBeInTheDocument();
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
            pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        });
        await screen.findByText(/no posts yet/i);
        expect(section).toHaveAttribute("aria-busy", "false");
    });

    it("renders list of posts when fetch returns success with data", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: mockPosts,
            pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
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
            pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
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
            pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        expect(await screen.findByText(/no posts yet/i)).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: /no posts yet/i }),
        ).toBeInTheDocument();
    });

    it("when API returns success with empty array, empty message is shown and list/pagination are not", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByText(/no posts yet/i);
        expect(
            screen.getByRole("heading", { name: /no posts yet/i }),
        ).toBeInTheDocument();
        expect(screen.queryByRole("list")).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /first page/i }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(/loading/i, { exact: false }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(/couldn't load posts/i),
        ).not.toBeInTheDocument();
    });

    it("when API returns error, empty message is not shown", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: false,
            error: "Couldn't load posts",
        });
        renderWithClient(<BlogSection />);
        await screen.findByText(/couldn't load posts/i);
        expect(screen.queryByText(/no posts yet/i)).not.toBeInTheDocument();
    });

    it("when API returns posts, empty message is not shown", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: mockPosts,
            pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        expect(screen.queryByText(/no posts yet/i)).not.toBeInTheDocument();
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

    it("shows pagination controls when totalPages > 1", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: mockPosts,
            pagination: { page: 1, limit: 2, total: 5, totalPages: 3 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        expect(
            screen.getByRole("button", { name: /first page/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /previous page/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /next page/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /last page/i }),
        ).toBeInTheDocument();
    });

    it("hides pagination when totalPages <= 1", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: mockPosts,
            pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        expect(
            screen.queryByRole("button", { name: /first page/i }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /previous page/i }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /next page/i }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /last page/i }),
        ).not.toBeInTheDocument();
    });

    it("disables Previous on first page and Next on last page", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: mockPosts,
            pagination: { page: 1, limit: 2, total: 5, totalPages: 3 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        const first = screen.getByRole("button", { name: /first page/i });
        const prev = screen.getByRole("button", { name: /previous page/i });
        const next = screen.getByRole("button", { name: /next page/i });
        const last = screen.getByRole("button", { name: /last page/i });
        expect(first).toBeDisabled();
        expect(prev).toBeDisabled();
        expect(next).not.toBeDisabled();
        expect(last).not.toBeDisabled();
    });

    it("disables Next and Last when on last page", async () => {
        mockFetchBlogPosts
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 1, limit: 2, total: 6, totalPages: 3 },
            })
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 2, limit: 2, total: 6, totalPages: 3 },
            })
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 3, limit: 2, total: 6, totalPages: 3 },
            });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        const nextBtn = screen.getByRole("button", { name: /next page/i });
        await act(async () => {
            nextBtn.click();
        });
        await screen.findByRole("list");
        await act(async () => {
            screen.getByRole("button", { name: /next page/i }).click();
        });
        await screen.findByRole("list");
        const first = screen.getByRole("button", { name: /first page/i });
        const prev = screen.getByRole("button", { name: /previous page/i });
        const next = screen.getByRole("button", { name: /next page/i });
        const last = screen.getByRole("button", { name: /last page/i });
        expect(first).not.toBeDisabled();
        expect(prev).not.toBeDisabled();
        expect(next).toBeDisabled();
        expect(last).toBeDisabled();
    });

    it("calls fetchBlogPosts with next page when Next is clicked", async () => {
        mockFetchBlogPosts
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 1, limit: 2, total: 5, totalPages: 3 },
            })
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 2, limit: 2, total: 5, totalPages: 3 },
            });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        const next = screen.getByRole("button", { name: /next page/i });
        await act(async () => {
            next.click();
        });
        await screen.findByRole("list");
        expect(mockFetchBlogPosts).toHaveBeenCalledTimes(2);
        expect(mockFetchBlogPosts).toHaveBeenNthCalledWith(2, {
            page: 2,
            limit: 2,
        });
    });

    it("calls fetchBlogPosts with page 1 when First is clicked", async () => {
        mockFetchBlogPosts
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 1, limit: 2, total: 6, totalPages: 3 },
            })
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 2, limit: 2, total: 6, totalPages: 3 },
            })
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 1, limit: 2, total: 6, totalPages: 3 },
            });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        await act(async () => {
            screen.getByRole("button", { name: /next page/i }).click();
        });
        await screen.findByRole("list");
        await act(async () => {
            screen.getByRole("button", { name: /first page/i }).click();
        });
        await screen.findByRole("list");
        expect(mockFetchBlogPosts).toHaveBeenCalledTimes(3);
        expect(mockFetchBlogPosts).toHaveBeenNthCalledWith(3, {
            page: 1,
            limit: 2,
        });
    });

    it("calls fetchBlogPosts with last page when Last is clicked", async () => {
        mockFetchBlogPosts
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 1, limit: 2, total: 6, totalPages: 3 },
            })
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 3, limit: 2, total: 6, totalPages: 3 },
            });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        await act(async () => {
            screen.getByRole("button", { name: /last page/i }).click();
        });
        await screen.findByRole("list");
        expect(mockFetchBlogPosts).toHaveBeenCalledTimes(2);
        expect(mockFetchBlogPosts).toHaveBeenNthCalledWith(2, {
            page: 3,
            limit: 2,
        });
    });

    it("shows up to 5 page number links with current page highlighted", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: mockPosts,
            pagination: { page: 1, limit: 2, total: 5, totalPages: 3 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        expect(
            screen.getByRole("button", { name: "Page 1" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Page 2" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Page 3" }),
        ).toBeInTheDocument();
        const page1 = screen.getByRole("button", { name: "Page 1" });
        expect(page1).toHaveAttribute("aria-current", "page");
    });

    it("shows at most 5 page number buttons when totalPages > 5 (sliding window)", async () => {
        mockFetchBlogPosts.mockResolvedValueOnce({
            ok: true,
            data: mockPosts,
            pagination: { page: 1, limit: 2, total: 20, totalPages: 10 },
        });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        const pageButtons = [
            screen.getByRole("button", { name: "Page 1" }),
            screen.getByRole("button", { name: "Page 2" }),
            screen.getByRole("button", { name: "Page 3" }),
            screen.getByRole("button", { name: "Page 4" }),
            screen.getByRole("button", { name: "Page 5" }),
        ];
        pageButtons.forEach((btn) => expect(btn).toBeInTheDocument());
        expect(
            screen.queryByRole("button", { name: "Page 6" }),
        ).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
            "aria-current",
            "page",
        );
    });

    it("shows sliding window of 5 page numbers when navigating to middle page", async () => {
        mockFetchBlogPosts
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 1, limit: 2, total: 20, totalPages: 10 },
            })
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 5, limit: 2, total: 20, totalPages: 10 },
            });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        await act(async () => {
            screen.getByRole("button", { name: "Page 5" }).click();
        });
        await screen.findByRole("list");
        expect(
            screen.getByRole("button", { name: "Page 3" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Page 4" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Page 5" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Page 6" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Page 7" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute(
            "aria-current",
            "page",
        );
    });

    it("shows loading state when changing page until refetch completes", async () => {
        let resolvePage2: (
            value: Awaited<ReturnType<typeof blogApi.fetchBlogPosts>>,
        ) => void;
        const page2Promise = new Promise<
            Awaited<ReturnType<typeof blogApi.fetchBlogPosts>>
        >((resolve) => {
            resolvePage2 = resolve;
        });
        mockFetchBlogPosts
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 1, limit: 2, total: 6, totalPages: 3 },
            })
            .mockReturnValueOnce(page2Promise);
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        const nextBtn = screen.getByRole("button", { name: /next page/i });
        await act(async () => {
            nextBtn.click();
        });
        expect(
            screen.getByText(/loading/i, { exact: false }),
        ).toBeInTheDocument();
        resolvePage2!({
            ok: true,
            data: mockPosts,
            pagination: { page: 2, limit: 2, total: 6, totalPages: 3 },
        });
        await screen.findByRole("list");
        expect(mockFetchBlogPosts).toHaveBeenCalledTimes(2);
    });

    it("calls fetchBlogPosts with selected page when page number is clicked", async () => {
        mockFetchBlogPosts
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 1, limit: 2, total: 10, totalPages: 5 },
            })
            .mockResolvedValueOnce({
                ok: true,
                data: mockPosts,
                pagination: { page: 3, limit: 2, total: 10, totalPages: 5 },
            });
        renderWithClient(<BlogSection />);
        await screen.findByRole("list");
        const page3 = screen.getByRole("button", { name: "Page 3" });
        await act(async () => {
            page3.click();
        });
        await screen.findByRole("list");
        expect(mockFetchBlogPosts).toHaveBeenCalledTimes(2);
        expect(mockFetchBlogPosts).toHaveBeenNthCalledWith(2, {
            page: 3,
            limit: 2,
        });
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
