export function MockModeIndicator() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '0.5rem 1rem',
        fontSize: '0.8rem',
        color: '#666',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      🎭 Running in mock mode for reliable demo experience
    </div>
  );
}
