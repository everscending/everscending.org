import "./BlogSection.css";

const BlogSection = () => {
    return (
        <section
            className="blog-section"
            aria-label="Blog"
            aria-busy={true}
            aria-live="polite"
            tabIndex={0}
        >
            <h2 className="blog-section__heading">Blog</h2>
            <p className="blog-section__loading">Loading…</p>
        </section>
    );
};

export default BlogSection;
