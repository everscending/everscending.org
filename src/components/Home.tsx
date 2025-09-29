import { Link } from "react-router-dom";
import "./Home.scss";

const Home = () => {
    return (
        <div id="home" className="outer-container">
            <div className="inner-container">
                <Link to="/ai-engineering-path" className="nav-link">
                    AI Engineering Path
                </Link>
                <Link to="/agentic-twin" className="nav-link">
                    Agentic Digital Twin
                </Link>
                <Link to="/resume" className="nav-link">
                    Resume
                </Link>
                <a
                    href="https://www.linkedin.com/in/jordaneverscending/"
                    className="nav-link"
                    target="_blank"
                >
                    LinkedIn
                </a>

                <a
                    href="mailto:everscending@gmail.com"
                    className="nav-link"
                    target="_blank"
                >
                    Contact
                </a>
            </div>
        </div>
    );
};

export default Home;
