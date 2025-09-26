import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="outer-container">
      <div className="inner-container">
        <Link to="/resume" className="nav-link">Resume</Link>
        <Link to="/agentic-twin" className="nav-link">Agentic Digital Twin</Link>
        <Link to="/ai-engineering-path" className="nav-link">AI Engineering Path</Link>
      </div>
    </div>
  );
};

export default Home;
