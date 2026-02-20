import { useEffect, useRef } from "react";
// import webgazer from "webgazer";
import ccRed from "../assets/CCRed_Base.png";
import ccGreen from "../assets/CCGreen_Base.png";
import "./ConcentricCircles.css";

const ConcentricCircles = ({ width }: { width: number }) => {
    const concentricCirclesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (concentricCirclesRef.current) {
            console.log("CC Width", concentricCirclesRef.current.clientWidth);
        }
    }, [concentricCirclesRef]);

    useEffect(() => {
        console.log("Setting up WebGazer");
        // webgazer.setGazeListener((data, elapsedTime) => {
        //     console.log("Gaze data", data, elapsedTime);
        // });
    }, []);

    return (
        <div
            id="concentric-circles"
            ref={concentricCirclesRef}
            style={{ width: `${width}px` }}
        >
            <img src={ccRed} alt="Red Concentric Circles" />
            <img src={ccGreen} alt="Green Concentric Circles" />
        </div>
    );
};

export default ConcentricCircles;
