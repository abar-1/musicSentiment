import React, { useState } from 'react';
import './index.css';

import MoodForm from './components/MoodForm';
import PlaylistResult from './components/PlaylistResult';
import LoadingSpinner from './components/LoadingSpinner';
import MusicCard from './components/MusicCard';

function App() {
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);

  const genres = [
    { name: "R&B", img: "R&B.jpg" }
  ];

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

      setPlaylist(fakePlaylist); 
      setLoading(false); 
    }, 2000); 
  };

  return (
    <div className="app-container invisible-scrollbar">
      <div className="genre-selection">
        <h1 className="genre-title">What Genre(s) of Music would you like to listen to?</h1>
        <div className="musicCards">
          <MusicCard text="R&B" imgName="R&B.jpg" />
          <MusicCard text="Rock" imgName="rock.jpg" />
          <MusicCard text="Pop" imgName="pop.jpg" />
          <MusicCard text="Jazz" imgName = "jazz.jpg" />
          <MusicCard text="Country" imgName = "country.jpg" />
          <MusicCard text="Electronic" imgName="electronic.jpg" />
          <MusicCard text="Hip-Hop" imgName ="hiphop.jpg" />
          <MusicCard text="Urbano Latino" imgName="urbanolatino.jpg" />
          <MusicCard text=""/>
          {/* Add more MusicCard components here if needed */}
        </div>
    </div>
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