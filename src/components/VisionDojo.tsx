import { useEffect, useRef } from "react";
import Layout from "./Layout";
import ConcentricCircles from "./ConcentricCircles";
import "./VisionDojo.css";

const VisionDojo = () => {
    const dojoContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dojoContainerRef.current) {
            console.log(
                "Vision Dojo Width",
                dojoContainerRef.current.clientWidth,
            );
        }
    }, [dojoContainerRef]);

    return (
        <Layout id="vision-dojo">
            <h1>Vision Dojo</h1>
            <div id="dojo-container" ref={dojoContainerRef}>
                <ConcentricCircles width={600} />
            </div>
        </Layout>
    );
};

export default VisionDojo;
