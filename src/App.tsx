// NOTE: Keeping three/Vanta related code commented out for now
// import { useEffect, useRef } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
// import * as THREE from "three";
// import WAVES from "vanta/dist/vanta.waves.min";
import Home from "./components/Home";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import AgenticTwin from "./components/AgenticTwin";
import ResearchAgent from "./components/ResearchAgent";
import AIEngineeringPath from "./components/AIEngineeringPath";
import BlogPostPage from "./components/BlogPostPage";
import "./App.css";

function App() {
    // const vantaEffectRef = useRef(null);

    // useEffect(() => {
    //     if (!vantaEffectRef.current) {
    //         const vantaEffectReturn = WAVES({
    //             THREE: THREE,
    //             el: "#animation-container",
    //             mouseControls: true,
    //             touchControls: true,
    //             gyroControls: false,
    //             minHeight: 200.0,
    //             minWidth: 200.0,
    //             scale: 1.0,
    //             scaleMobile: 1.0,
    //             color: 0x0,
    //             shininess: 50.0,
    //             waveHeight: 10.5,
    //             waveSpeed: 0.3,
    //             zoom: 0.98,
    //         });
    //         vantaEffectRef.current = vantaEffectReturn;
    //         console.log("vantaEffectRef", vantaEffectRef.current);
    //     }

    //     return (): void => {
    //         if (vantaEffectRef.current) {
    //             console.log("destroying vantaEffect");
    //             (vantaEffectRef.current as any).destroy();
    //         }
    //     };
    // }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/resume" element={<Resume />} />
                    <Route path="/agentic-twin" element={<AgenticTwin />} />
                    <Route path="/research-agent" element={<ResearchAgent />} />
                    <Route
                        path="/ai-engineering-path"
                        element={<AIEngineeringPath />}
                    />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
