import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { fetchBlogPostBySlug } from "../utils/blogApi";
import Layout from "./Layout";
import "./BlogPostPage.css";

const BLOG_POST_QUERY_KEY = ["blog", "post"] as const;

/** True if the string parses as a valid date (so dateTime attribute is valid). */
function isValidDateString(value: string): boolean {
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
}

function blogPostQueryFn(slug: string) {
    return fetchBlogPostBySlug(slug).then((result) => {
        if (!result.ok) throw new Error(result.error);
        return result;
    });
}

const BlogPostPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [...BLOG_POST_QUERY_KEY, slug],
        queryFn: () => {
            if (!slug) throw new Error("Post not found");
            return blogPostQueryFn(slug);
        },
        enabled: Boolean(slug),
    });

    const post = data?.data;
    const errorMessage =
        error instanceof Error && error.message ? error.message : "";
    const isNotFound = errorMessage === "Post not found";
    /** Defensive: app route is /blog/:slug so slug is normally always set; handle noSlug for tests or if route ever changes. */
    const noSlug = !slug;

    return (
        <Layout id="blog-post">
            <article
                className="blog-post-page"
                aria-label="Blog post"
                aria-busy={isLoading}
                aria-live="polite"
            >
                {noSlug && (
                    <p className="blog-post-page__error" role="alert">
                        Post not found
                    </p>
                )}
                {isLoading && (
                    <p className="blog-post-page__loading">Loading…</p>
                )}
                {isError && (
                    <p className="blog-post-page__error" role="alert">
                        {isNotFound ? "Post not found" : "Couldn't load post"}
                    </p>
                )}
                {post && (
                    <>
                        <header className="blog-post-page__header">
                            <h1 className="blog-post-page__title">
                                {post.title}
                            </h1>
                            {post.excerpt && (
                                <p className="blog-post-page__excerpt">
                                    {post.excerpt}
                                </p>
                            )}
                            {(post.author || post.publishedAt) && (
                                <p className="blog-post-page__meta">
                                    {post.author && <span>{post.author}</span>}
                                    {post.author && post.publishedAt && " · "}
                                    {post.publishedAt &&
                                        (isValidDateString(post.publishedAt) ? (
                                            <time dateTime={post.publishedAt}>
                                                {post.publishedAt}
                                            </time>
                                        ) : (
                                            <span>{post.publishedAt}</span>
                                        ))}
                                </p>
                            )}
                        </header>
                        <div
                            className="blog-post-page__content"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(post.content, {
                                    USE_PROFILES: { html: true },
                                }),
                            }}
                        />
                    </>
                )}
            </article>
        </Layout>
    );
};

export default BlogPostPage;
