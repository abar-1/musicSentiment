import React, { useState } from 'react';
import './index.css';

import MoodForm from './components/MoodForm';
import PlaylistResult from './components/PlaylistResult';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);

  const generatePlaylist = (moodText) => {
    setLoading(true); // Show the spinner

    // Simulate a delay of 2 seconds (2000ms)
    setTimeout(() => {
      // Simulate a playlist based on the moodText
      const fakePlaylist = {
        mood: moodText,
        songs: [
          { title: "Feel Good Inc.", artist: "Gorillaz" },
          { title: "Happy", artist: "Pharrell Williams" },
          { title: "Uptown Funk", artist: "Bruno Mars" }
        ],
      };

      setPlaylist(fakePlaylist); // Update playlist
      setLoading(false); // Hide the spinner after 2 seconds
    }, 2000); // 2 seconds delay
  };

  return (
    <div className="app-container">
      <div className="app-box">
        <h1 className="app-title">MoodMusic Playlist Generator</h1>
        
        {!playlist ? (
          <MoodForm onSubmit={generatePlaylist} />
        ) : (
          <PlaylistResult 
            playlist={playlist} 
            onCreateNew={() => setPlaylist(null)} 
          />
        )}
        
        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
}

export default App;
