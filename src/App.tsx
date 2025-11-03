import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Resume from "./components/Resume";
import AgenticTwin from "./components/AgenticTwin";
import AIEngineeringPath from "./components/AIEngineeringPath";
import "./App.scss";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/resume" element={<Resume />} />
                    <Route path="/agentic-twin" element={<AgenticTwin />} />
                    <Route
                        path="/ai-engineering-path"
                        element={<AIEngineeringPath />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
