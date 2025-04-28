import { createRoot } from "react-dom/client";
import MinimalApp from "./MinimalApp"; // Keep for fallback reference
import ViavoMVP from "./ViavoMVP"; // Import our new MVP app
import './index.css';

// Find the root element
const rootElement = document.getElementById("root");

console.log("Starting Viavo App...");

if (rootElement) {
  console.log("Root element found, attempting to render Viavo app...");
  try {
    const root = createRoot(rootElement);
    
    // Use our new ViavoMVP component instead of the minimal one
    root.render(<ViavoMVP />);
    
    console.log("Viavo app rendered successfully");
  } catch (error: any) { // Explicitly type as 'any' to avoid TS errors
    console.error("Error rendering app:", error);
    // Show error directly in the DOM for easier debugging
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; background: #ffeeee; border: 1px solid red; margin: 20px;">
        <h2>React Error:</h2>
        <p>${error?.message || 'Unknown error'}</p>
        <pre>${error?.stack || ''}</pre>
      </div>
    `;
  }
} else {
  console.error("Could not find root element to mount React application");
}
