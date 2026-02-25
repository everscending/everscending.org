import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchBlogPosts, DEFAULT_PAGE, DEFAULT_LIMIT } from "../utils/blogApi";
import type { BlogPost, FetchBlogPostsResult } from "../utils/blogApi";
import PostCard from "./PostCard";
import "./BlogSection.css";

const BLOG_POSTS_QUERY_KEY = ["blog", "posts"] as const;
const BLOG_ERROR_MESSAGE = "Couldn't load posts";
const MAX_PAGE_LINKS = 5;

/** Returns up to MAX_PAGE_LINKS page numbers to show, centered on current when possible. */
function getPageNumbers(current: number, totalPages: number): number[] {
    if (totalPages <= 0) return [];
    if (totalPages <= MAX_PAGE_LINKS) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const start = Math.max(
        1,
        Math.min(current - 2, totalPages - MAX_PAGE_LINKS + 1),
    );
    const end = Math.min(totalPages, start + MAX_PAGE_LINKS - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/** Home-section preview: limit < 20 is valid during development; architecture default is 20 for full list/pagination. */
function blogPostsQueryFn({
    queryKey,
}: {
    queryKey: readonly unknown[];
}): Promise<FetchBlogPostsResult> {
    const params = queryKey[2] as { page: number; limit: number };
    const page = params?.page ?? DEFAULT_PAGE;
    const limit = params?.limit ?? DEFAULT_LIMIT;
    return fetchBlogPosts({ page, limit }).then((result) => {
        if (!result.ok) throw new Error(result.error);
        return result;
    });
}

const BlogSection = () => {
    const [page, setPage] = useState(DEFAULT_PAGE);
    const limit = DEFAULT_LIMIT;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [...BLOG_POSTS_QUERY_KEY, { page, limit }],
        queryFn: blogPostsQueryFn,
    });

    const posts: BlogPost[] = data?.ok === true ? data.data : [];
    const isEmpty = data?.ok === true && posts.length === 0;
    const errorMessage =
        error instanceof Error && error.message
            ? error.message
            : BLOG_ERROR_MESSAGE;

    const totalPages = data && data.ok ? (data.pagination?.totalPages ?? 0) : 0;
    const showPagination = data?.ok === true && totalPages > 1 && !isError;
    const isFirstPage = page <= 1;
    const isLastPage = page >= totalPages;
    const pageNumbers = getPageNumbers(page, totalPages);

    // Clamp page to valid range when totalPages shrinks (e.g. API now returns fewer pages)
    useEffect(() => {
        if (data?.ok !== true || totalPages < 1) return;
        if (page > totalPages) setPage(totalPages);
        else if (page < 1) setPage(1);
    }, [data?.ok, totalPages, page]);

    return (
        <section
            className="blog-section"
            aria-label="Blog"
            aria-busy={isLoading}
            aria-live="polite"
        >
            {isLoading && <p className="blog-section__loading">Loading…</p>}
            {data?.ok === true && posts.length > 0 && !isError && (
                <ul className="blog-section__list">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </ul>
            )}
            {showPagination && (
                <nav
                    className="blog-section__pagination"
                    aria-label="Blog pagination"
                >
                    <button
                        type="button"
                        className="blog-section__pagination-btn"
                        aria-label="First page"
                        disabled={isFirstPage}
                        onClick={() => setPage(1)}
                    >
                        First
                    </button>
                    <button
                        type="button"
                        className="blog-section__pagination-btn"
                        aria-label="Previous page"
                        disabled={isFirstPage}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </button>
                    {pageNumbers.map((n) => (
                        <button
                            key={n}
                            type="button"
                            className={`blog-section__pagination-btn blog-section__pagination-page ${
                                n === page
                                    ? "blog-section__pagination-page--current"
                                    : ""
                            }`}
                            aria-label={`Page ${n}`}
                            aria-current={n === page ? "page" : undefined}
                            onClick={() => setPage(n)}
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="blog-section__pagination-btn"
                        aria-label="Next page"
                        disabled={isLastPage}
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                    >
                        Next
                    </button>
                    <button
                        type="button"
                        className="blog-section__pagination-btn"
                        aria-label="Last page"
                        disabled={isLastPage}
                        onClick={() => setPage(totalPages)}
                    >
                        Last
                    </button>
                </nav>
            )}
            {isEmpty && !isError && (
                <h2 className="blog-section__empty">No posts yet</h2>
            )}
            {isError && <p className="blog-section__error">{errorMessage}</p>}
        </section>
    );
};

export default BlogSection;
