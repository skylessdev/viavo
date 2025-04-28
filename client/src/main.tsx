import { createRoot } from "react-dom/client";
import ViavoApp from "./ViavoApp"; // Import our new landing page component
import "./index.css"; // Import the CSS

// Find the root element
const rootElement = document.getElementById("root");

console.log("Starting Viavo application...");

if (rootElement) {
  console.log("Root element found, attempting to render Viavo app...");
  try {
    const root = createRoot(rootElement);
    root.render(<ViavoApp />);
    console.log("Viavo app rendered successfully");
  } catch (error) {
    console.error("Error rendering Viavo app:", error);
  }
} else {
  console.error("Could not find root element to mount React application");
}
