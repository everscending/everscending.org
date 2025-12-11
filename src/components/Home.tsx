import { Link } from "react-router-dom";
import Layout from "./Layout";
import digitalLotusMobileLogo from "../assets/Everscending_Digital_Lotus_Logo.png";
import digitalLotusDesktopLogo from "../assets/Everscending_Digital_Lotus_Logo2.png";
import "./Home.css";

const Home = () => {
    return (
        <Layout id="home">
            <img
                className="home-logo mobile-logo"
                src={digitalLotusMobileLogo}
                alt="Digital Lotus"
            />

            <img
                className="home-logo desktop-logo"
                src={digitalLotusDesktopLogo}
                alt="Digital Lotus"
            />

            <Link to="/ai-engineering-path" className="nav-link">
                AI Engineering Path
            </Link>
            <Link to="/agentic-twin" className="nav-link">
                Agentic Digital Twin
            </Link>
            <Link to="/research-agent" className="nav-link">
                Research Agent
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
        </Layout>
    );
};

export default Home;
