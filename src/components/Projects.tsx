import { Link } from "react-router-dom";
import Layout from "./Layout";
import "./Projects.css";

const Home = () => {
    return (
        <Layout id="projects">
            <Link to="/agentic-twin" className="project-link">
                Agentic Digital Twin
            </Link>
            <div className="project-description">
                Demonstration of an agentic digital twin, utilizing Python and
                OpenAI's Agents SDK. This agent demo is trained on my LinkedIn
                profile and can answer questions about my career background,
                skills, and experience.
            </div>

            <Link to="/research-agent" className="project-link">
                Research Agent
            </Link>
            <div className="project-description">
                Demonstration of a research agent, utilizing Python and OpenAI's
                Agents framework, that can perform web searches and write a
                report.
            </div>

            <a
                href="https://hadoken-high-roller.everscending.org/"
                className="project-link"
                target="_blank"
                rel="noopener noreferrer"
            >
                Hadoken Highroller
            </a>
            <div className="project-description">
                A Street Fighter themed slot machine game built using Cloudflare
                Workers/D1, React and TypeScript. Built primarily with agentic
                coding workflows using Cursor/OpenCode/BMAD w/ some manual
                coding here and there.
            </div>

            <a
                href="https://astra.everscending.ai/"
                className="project-link"
                target="_blank"
                rel="noopener noreferrer"
            >
                Astra
            </a>
            <div className="project-description">
                A toy project that started years ago where I hand-coded a
                <a
                    target="_blank"
                    href="https://astra.everscending.ai/stars.html"
                >
                    starfield simulation
                </a>{" "}
                leveraging my knowledge of trigonometry, before the era of
                agentic coding. Updated with a shiny new{" "}
                <a target="_blank" href="https://astra.everscending.ai/">
                    version
                </a>{" "}
                built with Codex and Three.js.
            </div>
        </Layout>
    );
};

export default Home;
