import { createRoot } from "react-dom/client";
import TestApp from "./TestApp";
import "./index.css";

// Find the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  // Create React root and render the simple test app
  const root = createRoot(rootElement);
  root.render(<TestApp />);
} else {
  console.error("Could not find root element to mount React application");
}
