// Note: Gradio version here needs to match the version of the Gradio Python package in the HF space
const GRADIO_VERSION = "5.49.1";
const GRADIO_SCRIPT_URL = `https://gradio.s3-us-west-2.amazonaws.com/${GRADIO_VERSION}/gradio.js`;

// Load Gradio script dynamically
const loadGradioScript = (
    title: string,
    gradioContainerRef: React.RefObject<HTMLDivElement | null>,
    onRender: () => void,
) => {
    const hfSpaceId = title.toLowerCase().replaceAll(" ", "_");
    const gradioAppId = hfSpaceId.replaceAll("_", "-");
    let isLoading = true;
    const script = document.createElement("script");
    script.type = "module";
    script.src = GRADIO_SCRIPT_URL;
    script.onload = () => {
        // Create gradio-app element
        const gradioApp = document.createElement("gradio-app");
        gradioApp.setAttribute(
            "src",
            `https://everscending-${gradioAppId}.hf.space`,
        );
        gradioApp.setAttribute("title", title);
        gradioApp.setAttribute("id", "gradio-app");
        gradioApp.style.visibility = "hidden";
        gradioApp.style.height = "0";

        if (gradioContainerRef?.current) {
            gradioContainerRef.current.appendChild(gradioApp);

            // Listen for render event
            const gradioAppOnRender = () => {
                // Remove loading UI if it exists
                gradioContainerRef.current
                    ?.querySelector(".loading-message")
                    ?.remove();
                gradioApp.style.visibility = "visible";
                gradioApp.style.height = "auto";
                onRender();
                console.info("Gradio app rendered...");
                isLoading = false;
                gradioApp.removeEventListener("render", gradioAppOnRender);
            };
            gradioApp.addEventListener("render", gradioAppOnRender);
        }
    };

    if (gradioContainerRef?.current) {
        gradioContainerRef.current.innerHTML = `
            <div
                class="loading-message"
                style="display: flex;"
            >
                <div class="loading-spinner"></div>
                Loading ${title}...
            </div>`;
        document.head.appendChild(script);
    }

    // Fallback timeout
    const timeoutId = setTimeout(() => {
        if (isLoading) {
            const loadingElement =
                gradioContainerRef.current?.querySelector(".loading-message");
            if (loadingElement) {
                loadingElement.innerHTML = `Loading is taking longer than expected. <a href="https://huggingface.co/spaces/everscending/${hfSpaceId}" target="_blank" rel="noopener noreferrer">Click here to open in a new tab</a>`;
            }
        }
    }, 15000);

    return () => {
        clearTimeout(timeoutId);
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    };
};

export default loadGradioScript;
