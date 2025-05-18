import React, { useState } from 'react';
import '../index.css';

function MoodForm({ onSubmit }) {
  const [moodText, setMoodText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(moodText);
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
      
    </form>
  );
}

export default MoodForm;
