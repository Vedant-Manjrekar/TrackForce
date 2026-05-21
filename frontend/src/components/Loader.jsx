import React from 'react';

function Loader({ message = 'Loading telemetry data...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="loading-text">{message}</div>
    </div>
  );
}

export default Loader;
