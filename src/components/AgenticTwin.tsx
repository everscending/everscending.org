import { useEffect, useRef } from "react";
import Layout from "./Layout";
import "./GradioApp.css";
import loadGradioScript from "../utils/loadGradioScript";

const AgenticTwin = () => {
    const gradioContainerRef = useRef<HTMLDivElement>(null);
    const isLoading = useRef(false);

    useEffect(() => {
        if (!isLoading.current) {
            isLoading.current = true;
            return loadGradioScript(
                "LinkedIn Agent",
                gradioContainerRef,
                () => {
                    isLoading.current = false;
                },
            );
        }
    }, []);

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

            <div ref={gradioContainerRef} id="gradio-container" />

            <div id="gradio-footer-links">
                <a
                    href="https://huggingface.co/spaces/everscending/linkedin_agent"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    HF Space
                </a>
                &nbsp;|&nbsp;
                <a
                    href="https://github.com/everscending/linkedin_agent"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub Code
                </a>
            </div>
        </Layout>
    );
};

export default AgenticTwin;
