import { Link } from "react-router-dom";
import Layout from "./Layout";
import "./Projects.css";

const Home = () => {
    return (
        <Layout id="projects">
            <Link to="/agentic-twin" className="project-link">
                Agentic Digital Twin
            </Link>
            <Link to="/research-agent" className="project-link">
                Research Agent
            </Link>
            {/* <Link to="/vision-dojo" className="project-link">
                Vision Dojo
            </Link> */}
        </Layout>
    );
};

export default Home;
