// This is a debug file to test the AppContext
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useAppContext } from "./context/AppContext";
import "./index.css";

// Simple component to check if AppContext works
function AppTest() {
  try {
    const { screen } = useAppContext();
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug: AppContext Test</h1>
        <p>Current screen: {screen}</p>
      </div>
    );
  } catch (error) {
    console.error("AppContext error:", error);
    return (
      <div className="p-8 text-red-500">
        <h1 className="text-2xl font-bold mb-4">Debug: AppContext Error</h1>
        <p>Error: {error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
}

// Create a minimal test component wrapped with necessary providers
function DebugApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <AppTest />
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Mount to a debug container
const debugRoot = document.createElement("div");
debugRoot.id = "debug-root";
document.body.appendChild(debugRoot);

createRoot(debugRoot).render(<DebugApp />);