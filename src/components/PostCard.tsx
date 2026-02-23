import type { BlogPost } from "../utils/blogApi";
import "./PostCard.css";

interface PostCardProps {
    post: BlogPost;
}

const PostCard = ({ post }: PostCardProps) => {
    return (
        <li className="post-card">
            <a href={post.link} className="post-card__link">
                <span className="post-card__title">{post.title}</span>
                {post.excerpt ? (
                    <span className="post-card__excerpt">{post.excerpt}</span>
                ) : null}
            </a>
        </li>
    );
};

export default PostCard;
