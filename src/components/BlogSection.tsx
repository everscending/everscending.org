import { useQuery } from "@tanstack/react-query";
import { fetchBlogPosts } from "../utils/blogApi";
import type { BlogPost } from "../utils/blogApi";
import PostCard from "./PostCard";
import "./BlogSection.css";

const BLOG_POSTS_QUERY_KEY = ["blog", "posts"] as const;
const BLOG_ERROR_MESSAGE = "Couldn't load posts";

function blogPostsQueryFn() {
    return fetchBlogPosts({ page: 1, limit: 20 }).then((result) => {
        if (!result.ok) throw new Error(result.error);
        return result;
    });
}

const BlogSection = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [...BLOG_POSTS_QUERY_KEY, { page: 1, limit: 20 }],
        queryFn: blogPostsQueryFn,
    });

    const posts: BlogPost[] = data?.data ?? [];
    const isEmpty = data?.ok === true && posts.length === 0;
    const errorMessage =
        error instanceof Error && error.message
            ? error.message
            : BLOG_ERROR_MESSAGE;

    return (
        <section
            className="blog-section"
            aria-label="Blog"
            aria-busy={isLoading}
            aria-live="polite"
        >
            <h2 className="blog-section__heading">Blog</h2>
            {isLoading && <p className="blog-section__loading">Loading…</p>}
            {data?.ok === true && posts.length > 0 && !isError && (
                <ul className="blog-section__list">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </ul>
            )}
            {isEmpty && !isError && (
                <p className="blog-section__empty">No posts yet</p>
            )}
            {isError && <p className="blog-section__error">{errorMessage}</p>}
        </section>
    );
};

export default BlogSection;
