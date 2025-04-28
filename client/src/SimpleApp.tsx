// A super simple React component with no dependencies
function SimpleApp() {
  return (
    <div id="simple-app" style={{
      padding: '20px',
      margin: '20px',
      backgroundColor: 'lightblue',
      border: '4px solid blue',
      borderRadius: '8px'
    }}>
      <h1 style={{ fontSize: '24px', color: 'blue' }}>
        Hello from SimpleApp
      </h1>
      <p style={{ fontSize: '16px', marginTop: '8px' }}>
        This is a minimal React component
      </p>
      <button 
        style={{ 
          backgroundColor: 'blue',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          marginTop: '16px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Click Me
      </button>
    </div>
  );
}

export default SimpleApp;