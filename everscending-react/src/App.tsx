import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './components/Home';
import Resume from './components/Resume';
import AgenticTwin from './components/AgenticTwin';
import AIEngineeringPath from './components/AIEngineeringPath';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize background animation when app loads
    initAnimation();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/agentic-twin" element={<AgenticTwin />} />
          <Route path="/ai-engineering-path" element={<AIEngineeringPath />} />
        </Routes>
      </div>
    </Router>
  );
}

// Background animation function (ported from bganimation.js)
const loadScript = (src: string, options: any = {}): Promise<HTMLScriptElement> => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve(existingScript as HTMLScriptElement);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = src;
    script.type = options.type || 'text/javascript';
    
    // Set optional attributes
    if (options.async) script.async = true;
    if (options.defer) script.defer = true;
    if (options.id) script.id = options.id;

    // Set up event listeners
    script.onload = () => {
      if (options.onload) options.onload(script);
      resolve(script);
    };

    script.onerror = () => {
      if (options.onerror) options.onerror(script);
      reject(new Error(`Failed to load script: ${src}`));
    };

    // Add script to DOM
    document.head.appendChild(script);
  });
};

const initAnimation = async () => {
  try {
    // Load Three.js
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js', {
      onload: () => console.log('Three.js loaded successfully')
    });

    // Load Vanta.js
    await loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.waves.min.js', {
      onload: () => console.log('Vanta.js loaded successfully')
    });

    // Create animation container
    const animationContainer = document.createElement('div');
    animationContainer.id = 'animation-container';
    animationContainer.style.position = 'fixed';
    animationContainer.style.top = '0';
    animationContainer.style.left = '0';
    animationContainer.style.width = '100%';
    animationContainer.style.height = '100%';
    animationContainer.style.zIndex = '-1';
    document.body.appendChild(animationContainer);

    // Initialize Vanta waves animation
    (window as any).VANTA.WAVES({
      el: "#animation-container",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x0,
      shininess: 50.00,
      waveHeight: 10.50,
      waveSpeed: 0.30,
      zoom: 0.98
    });
  } catch (error) {
    console.error('Failed to initialize animation:', error);
  }
};

export default App;