import { useEffect, useRef } from "react";
import Layout from "./Layout";
import loadGradioScript from "../utils/loadGradioScript";
import "./GradioApp.css";

const ResearchAgent = () => {
    const gradioContainerRef = useRef<HTMLDivElement>(null);
    const isLoading = useRef(false);

    useEffect(() => {
        if (!isLoading.current) {
            isLoading.current = true;
            return loadGradioScript(
                "Research Agent",
                gradioContainerRef,
                () => {
                    isLoading.current = false;
                },
            );
        }
    }, []);

    return (
        <Layout id="research-agent">
            <div className="header">
                <h1>Research Agent</h1>
                <p>
                    Demonstration of a research agent, utilizing Python and
                    OpenAI's Agents framework, that can perform web searches and
                    write a report.
                </p>
            </div>
            <div ref={gradioContainerRef} id="gradio-container" />

            <div id="gradio-footer-links">
                <a
                    href="https://huggingface.co/spaces/everscending/research_agent"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    HF Space
                </a>
                &nbsp;|&nbsp;
                <a
                    href="https://github.com/everscending/research_agent"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub Code
                </a>
            </div>
        </Layout>
    );
};

export default ResearchAgent;
