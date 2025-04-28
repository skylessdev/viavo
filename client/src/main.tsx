import { createRoot } from "react-dom/client";
import MinimalApp from "./MinimalApp"; // Import the minimal App with working Context

// Find the root element
const rootElement = document.getElementById("root");

console.log("Starting Minimal Viavo App...");

if (rootElement) {
  console.log("Root element found, attempting to render Minimal Viavo app...");
  try {
    const root = createRoot(rootElement);
    root.render(<MinimalApp />);
    console.log("Minimal Viavo app rendered successfully");
  } catch (error) {
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
