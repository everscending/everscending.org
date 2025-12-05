import { useEffect, useRef, useState } from "react";
import Layout from "./Layout";
import loadGradioScript from "../utils/loadGradioScript";
import "./GradioApp.css";

const ResearchAgent = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const gradioContainerRef = useRef<HTMLDivElement>(null);
    const isLoading = useRef(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (!isLoading.current) {
            isLoading.current = true;
            loadGradioScript("Research Agent", gradioContainerRef, () => {
                setIsLoaded(true);
            });

            // Fallback timeout
            timeout = setTimeout(() => {
                if (!isLoaded) {
                    const loadingElement = document.getElementById("loading");
                    if (loadingElement) {
                        loadingElement.innerHTML =
                            'Loading is taking longer than expected. <a href="https://huggingface.co/spaces/everscending/research_agent" target="_blank">Click here to open in a new tab</a>';
                    }
                }
            }, 15000);
        }
        return () => clearTimeout(timeout);
    }, [isLoaded]);

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
            <div
                className="loading-message"
                id="loading"
                style={{ display: isLoaded ? "none" : "flex" }}
            >
                <div className="loading-spinner"></div>
                Loading Research Agent...
            </div>
            <div
                ref={gradioContainerRef}
                id="gradio-container"
                style={{
                    visibility: isLoaded ? "visible" : "hidden",
                }}
            />

            <div id="gradio-footer-links">
                <a
                    href="https://huggingface.co/spaces/everscending/research_agent"
                    target="_blank"
                >
                    HF Space
                </a>
                &nbsp;|&nbsp;
                <a
                    href="https://github.com/everscending/research_agent"
                    target="_blank"
                >
                    GitHub Code
                </a>
            </div>
        </Layout>
    );
};

export default ResearchAgent;
