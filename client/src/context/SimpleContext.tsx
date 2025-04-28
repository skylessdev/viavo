import React, { createContext, useContext, ReactNode } from 'react';

// Define a simple context interface to start with
interface SimpleContextType {
  appName: string;
  version: string;
}

// Create context with default values
const SimpleContext = createContext<SimpleContextType>({
  appName: 'Viavo',
  version: '0.1.0'
});

// Create a provider component
export function SimpleProvider({ children }: { children: ReactNode }) {
  // Simple values for our minimal context
  const value = {
    appName: 'Viavo',
    version: '0.1.0'
  };

  return (
    <SimpleContext.Provider value={value}>
      {children}
    </SimpleContext.Provider>
  );
}

// Hook to use this context
export function useSimpleContext() {
  const context = useContext(SimpleContext);
  
  if (context === undefined) {
    throw new Error('useSimpleContext must be used within a SimpleProvider');
  }
  
  return context;
}