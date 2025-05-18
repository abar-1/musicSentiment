import React, { useState, useEffect } from 'react';
import './index.css';

import MoodForm from './components/MoodForm';
import PlaylistResult from './components/PlaylistResult';
import LoadingSpinner from './components/LoadingSpinner';
import MusicCard from './components/musicCard';
import VideoFeed from './components/videoFeed';
import MoodAnalysis from './components/MoodAnalysis';

function App() {
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  

  const genres = [
    { name: "R&B", img: "r&b.jpg" },
    { name: "Rock", img: "rock.jpg"},
    { name: "Pop", img: "pop.jpg"},
    { name: "Jazz", img: "jazz.jpg"},
    { name: "Country", img: "country.jpg"},
    { name: "Electronic", img: "electronic.jpg"},
    { name: "Hip-Hop", img: "hiphop.jpg"},
    { name: "Urbano Latino", img: "urbanolatino.jpg"},
    { name: "Pop-Rap", img: "poprap.jpg"},
    { name: "Indie", img:"indie.jpg"},
    { name: "Trap", img: "trap.jpg"},
    { name: "K-Pop", img: "kpop.jpg"}
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
    <div className="container">  
      <div className="app-container invisible-scrollbar">
        <div className="genre-selection">
          <h1 className="genre-title">What Genre(s) of Music would you like to listen to?</h1>
          <div className="musicCards">
            
            {genres.map(({name, img}) => (
              <MusicCard key={name} text={name} imgName={img}/>
            ))}
          </div>
      </div>
        
      <div className="app-box">
      
        <MoodAnalysis />
        
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
      
    </div>
  );
}

export default App;