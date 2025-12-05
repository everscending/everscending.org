const GRADIO_VERSION = "5.49.1";
const GRADIO_SCRIPT_URL = `https://gradio.s3-us-west-2.amazonaws.com/${GRADIO_VERSION}/gradio.js`;

// Load Gradio script dynamically
const loadGradioScript = (
    title: string,
    gradioContainerRef: React.RefObject<HTMLDivElement | null>,
    onRender: () => void,
) => {
    // console.log("Loading Gradio script..", isLoaded, gradioAppRef.current);

    const script = document.createElement("script");
    script.type = "module";
    script.src = GRADIO_SCRIPT_URL;
    script.onload = () => {
        // Create gradio-app element
        const gradioApp = document.createElement("gradio-app");
        gradioApp.setAttribute(
            "src",
            "https://everscending-research-agent.hf.space",
        );
        gradioApp.setAttribute("title", title);
        gradioApp.setAttribute("id", "gradio-app");

        if (gradioContainerRef?.current) {
            gradioContainerRef.current.appendChild(gradioApp);
            // gradioAppRef.current = gradioApp;
        }

        // Listen for render event
        gradioApp.addEventListener("render", () => {
            onRender();
            console.log("Gradio app rendered");
        });
    };
    document.head.appendChild(script);
};

export default loadGradioScript;
