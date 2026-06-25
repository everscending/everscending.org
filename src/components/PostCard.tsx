import { Link } from "react-router-dom";
import type { BlogPost } from "../utils/blogApi";
import "./PostCard.css";

/**
 * Format publishedAt for display: "X mins ago" / "X hours ago" when recent, else "Feb 25, 2026".
 */
function formatPostDate(publishedAt: string | undefined): string | null {
    if (!publishedAt) return null;
    const date = new Date(publishedAt);
    if (Number.isNaN(date.getTime())) return null;
    const now = new Date();
    const ms = now.getTime() - date.getTime();
    const mins = Math.floor(ms / 60_000);
    const hours = Math.floor(ms / 3_600_000);
    if (mins < 60) return mins <= 1 ? "1 min ago" : `${mins} mins ago`;
    if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

interface PostCardProps {
    post: BlogPost;
}

const PostCard = ({ post }: PostCardProps) => {
    const dateLabel = formatPostDate(post.publishedAt);
    return (
        <li className="post-card">
            <Link to={post.link} className="post-card__link">
                {dateLabel ? (
                    <span className="post-card__date">{dateLabel}</span>
                ) : null}
                <span className="post-card__title">{post.title}</span>
                {post.excerpt ? (
                    <span className="post-card__excerpt">{post.excerpt}</span>
                ) : null}
            </Link>
        </li>
    );
};

export default PostCard;
