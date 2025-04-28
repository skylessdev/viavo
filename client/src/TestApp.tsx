import { useState } from 'react';

export default function TestApp() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Viavo Test App</h1>
      <p className="mb-4">This is a test component to verify that React is working properly.</p>
      
      <div className="flex flex-col items-center">
        <p className="text-xl mb-2">Count: {count}</p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
      </div>
    </div>
  );
}