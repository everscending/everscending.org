/**
 * Dynamically adds a script tag to the HTML DOM
 * @param {string} src - The source URL of the script
 * @param {Object} options - Optional configuration object
 * @param {boolean} options.async - Whether the script should be loaded asynchronously
 * @param {boolean} options.defer - Whether the script should be deferred
 * @param {string} options.type - The MIME type of the script (default: 'text/javascript')
 * @param {string} options.id - Optional ID for the script tag
 * @param {Function} options.onload - Callback function to execute when script loads
 * @param {Function} options.onerror - Callback function to execute when script fails to load
 * @returns {Promise<HTMLScriptElement>} Promise that resolves with the script element
 */
const loadScript = (src, options = {}) => {
    return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            resolve(existingScript);
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
    // Example usage of loadScript function
    return loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js', {
        // async: true,
        onload: () => console.log('Three.js loaded successfully')
    }).then(() => {
    
        loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.waves.min.js', {
            // async: true,
            onload: () => console.log('Vanta.js loaded successfully')
        }).then(() => {
    
            const animationContainer = document.createElement('div');
            animationContainer.id = 'animation-container';
            animationContainer.style.position = 'fixed';
            animationContainer.style.top = '0';
            animationContainer.style.left = '0';
            animationContainer.style.width = '100%';
            animationContainer.style.height = '100%';
            animationContainer.style.zIndex = '-1';
            document.body.appendChild(animationContainer);

            VANTA.WAVES({
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
            })
        })
    })
};

// export default initAnimation;
