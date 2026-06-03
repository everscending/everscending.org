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
                {id === "home" && (
                    <div id="nav-links">
                        <Link to="/ai-engineering-path" className="nav-link">
                            AI Engineering Path
                        </Link>
                        <Link to="/projects" className="nav-link">
                            Projects
                        </Link>
                        <Link to="/resume" className="nav-link">
                            Resume
                        </Link>

                        <a
                            href="https://open.spotify.com/playlist/0UZBoDDX7SluAzqzFLSC2T?si=e8ce0beed4db4934"
                            className="nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            धर्मकाय
                        </a>
                    </div>
                )}

                {id !== "home" && (
                    <div id="back-to-home">
                        <Link to="/">← Back to Home</Link>
                    </div>
                )}

                <div id="social-links">
                    <a
                        href="https://linkedin.com/in/jordaneverscending"
                        title="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={linkedinIcon} alt="LinkedIn" />
                    </a>
                    <a
                        href="https://github.com/everscending"
                        title="Github"
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
