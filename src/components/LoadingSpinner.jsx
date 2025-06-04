import React, {useState, useEffect} from 'react';
import '../spinner.css'

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-box">
        <div className="spinner-circle"></div>
        <div className="spinner-text">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;