import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import '../index.css';

function MoodAnalysis({ modelReady, startAnalysis, loading, detectedEmotion }) {
  const [analyzeClicked, setAnalyzeClicked] = useState(false);

  useEffect(() => {
    if (modelReady && analyzeClicked) {
      startAnalysis();
      setAnalyzeClicked(false);
    }
  }, [modelReady, analyzeClicked, startAnalysis]);

  const handleClick = () => {
    if (!modelReady) {
      setAnalyzeClicked(true);
      alert("Model is loading, please wait...");
    } else {
      alert("Your webcam will be used!");
      startAnalysis();
    }
  };

  return (
    <div className='center-btn'>
      <button 
        className={`toggle-btn ${analyzeClicked ? 'active' : ''}`} 
        onClick={handleClick}
        disabled={loading}
      >
        Analyze My Facial Expression
      </button>
      {loading && <LoadingSpinner />}
      {detectedEmotion && (
        <div className="detected-emotion">
          <h3>Detected Emotion:</h3>
          <p className="emotion-text">{detectedEmotion}</p>
        </div>
      )}
    </div>
  );
}

export default MoodAnalysis;
