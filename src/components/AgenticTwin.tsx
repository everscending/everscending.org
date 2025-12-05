import { useEffect, useRef, useState } from "react";
import Layout from "./Layout";
import "./GradioApp.css";
import loadGradioScript from "../utils/loadGradioScript";

const AgenticTwin = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const gradioContainerRef = useRef<HTMLDivElement>(null);
    const isLoading = useRef(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (!isLoading.current) {
            isLoading.current = true;
            loadGradioScript("LinkedIn Agent", gradioContainerRef, () => {
                setIsLoaded(true);
            });

            // Fallback timeout
            timeout = setTimeout(() => {
                if (!isLoaded) {
                    const loadingElement = document.getElementById("loading");
                    if (loadingElement) {
                        loadingElement.innerHTML =
                            'Loading is taking longer than expected. <a href="https://huggingface.co/spaces/everscending/linkedin_agent" target="_blank">Click here to open in a new tab</a>';
                    }
                }
            }, 15000);
        }
        return () => clearTimeout(timeout);
    }, [isLoaded]);

    return (
        <Layout id="agentic-twin">
            <div className="header">
                <h1>Welcome to my Agentic Digital Twin</h1>
                <p>
                    Demonstration of an agentic digital twin, utilizing Python
                    and OpenAI's Agents SDK. This agent demo is trained on my
                    LinkedIn profile and can answer questions about my career
                    background, skills, and experience.
                </p>
            </div>

            <div
                className="loading-message"
                id="loading"
                style={{ display: isLoaded ? "none" : "flex" }}
            >
                <div className="loading-spinner"></div>
                Loading Agentic Digital Twin...
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
                    href="https://huggingface.co/spaces/everscending/linkedin_agent"
                    target="_blank"
                >
                    HF Space
                </a>
                &nbsp;|&nbsp;
                <a
                    href="https://github.com/everscending/linkedin_agent"
                    target="_blank"
                >
                    GitHub Code
                </a>
            </div>
        </Layout>
    );
};

export default AgenticTwin;
