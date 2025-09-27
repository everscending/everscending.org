import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./AgenticTwin.scss";

const AgenticTwin = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const gradioContainerRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gradioAppRef = useRef<any>(null);
    const isLoading = useRef(false);

    useEffect(() => {
        // Load Gradio script dynamically
        const loadGradioScript = () => {
            console.log(
                "Loading Gradio script..",
                isLoaded,
                gradioAppRef.current,
            );

            const script = document.createElement("script");
            script.type = "module";
            script.src =
                "https://gradio.s3-us-west-2.amazonaws.com/5.46.1/gradio.js";
            script.onload = () => {
                // Create gradio-app element
                const gradioApp = document.createElement("gradio-app");
                gradioApp.setAttribute(
                    "src",
                    "https://everscending-linkedin-agent.hf.space",
                );
                gradioApp.setAttribute("title", "LinkedIn Agent");
                gradioApp.setAttribute("id", "gradio-app");

                if (gradioContainerRef.current) {
                    gradioContainerRef.current.appendChild(gradioApp);
                    gradioAppRef.current = gradioApp;
                }

                // Listen for render event
                gradioApp.addEventListener("render", () => {
                    setIsLoaded(true);
                    console.log("Gradio app rendered");
                });
            };
            document.head.appendChild(script);
        };

        let timeout: ReturnType<typeof setTimeout>;

        if (!isLoading.current) {
            isLoading.current = true;
            loadGradioScript();

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
        <div className="agentic-twin-container">
            <div className="header">
                <h1>Welcome to my Agentic Digital Twin</h1>
                <p>
                    Feel free to chat with me about my career, background,
                    skills and experience.
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

            <div id="footer">
                <Link to="/" className="back-link">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
};

export default AgenticTwin;
