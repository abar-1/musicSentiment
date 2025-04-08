import React from 'react';
import '../spinner.css'

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-box">
        <div className="spinner-circle"></div>
        <div className="spinner-text">Creating your perfect playlist...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;