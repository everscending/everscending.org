import { Link } from "react-router-dom";
import "./Layout.css";
import linkedinIcon from "../assets/InBug-White.png";
import githubIcon from "../assets/github-mark-white.svg";
import emailIcon from "../assets/envelope.png";

const Layout = ({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) => {
    return (
        <div id={id} className="outer-container">
            <div className="inner-container">{children}</div>
            <div id="footer">
                {id !== "home" && (
                    <div id="back-to-home">
                        <Link to="/">← Back to Home</Link>
                    </div>
                )}
                <div id="social-links">
                    <a
                        href="https://linkedin.com/in/jordaneverscending"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={linkedinIcon} alt="LinkedIn" />
                    </a>
                    <a
                        href="https://github.com/everscending"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={githubIcon} alt="Github" />
                    </a>
                    <a
                        href="mailto:everscending@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={emailIcon} alt="Email" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Layout;
