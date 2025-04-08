import React, { useState } from 'react';
import '../index.css';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component

function MoodForm() {
  const [moodText, setMoodText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    
    setLoading(true); // Show the loading spinner
    
    // Simulate a delay (3 seconds) before hiding the spinner and showing the result
    setTimeout(() => {
      setLoading(false); // Hide the loading spinner after the delay
      // You can handle further actions here like generating a playlist or whatever
    }, 3000); // 3 seconds delay
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-description">
        Tell us how you're feeling and we'll create a personalized playlist for you
      </div>
      
      <textarea
        className="mood-input"
        placeholder="Describe your mood, feelings, or the vibe you're looking for..."
        rows="4"
        value={moodText}
        onChange={(e) => setMoodText(e.target.value)}
      />
      
      <button type="submit" className="generate-btn">
        Generate My Playlist
      </button>

      {/* Show loading spinner if loading is true */}
      {loading && <LoadingSpinner />}
    </form>
  );
}

export default MoodForm;
