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
  const [modelReady, setModelReady] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  
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

  // Define the handler before using it
  const handleGenreSelection = (genreName, isSelected) => {
    try {
      console.log('handleGenreSelection called:', { genreName, isSelected }); // Debug log
      setSelectedGenres(prev => {
        const newSelection = isSelected 
          ? [...prev, genreName]
          : prev.filter(genre => genre !== genreName);
        console.log('New selection:', newSelection); // Debug log
        return newSelection;
      });
    } catch (error) {
      console.error('Error in handleGenreSelection:', error);
    }
  };

  const startAnalysis = async() => {
    console.log("Starting analysis");
    setLoading(true);  

    try {
      const response = await fetch('http://localhost:5000/run_python', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ script_path: "emotional_model.py" }),
      });

      const data = await response.json();
      if (response.ok) {
           console.log('Python script output:', data.output);
           setDetectedEmotion(data.output);
      } else {
          console.error('Error running Python script:', data.error);
      }
    } catch (error) {
      console.error('Failed to call the server:', error);
    } finally {
      setLoading(false);  // Set loading to false when done
    }
  };

  useEffect(() => {
    let mounted = true;  
    
    const checkModelReady = async() => {
      if (!mounted) return;  
      
      try {
        const res = await fetch('http://localhost:5000/warmup');
        const data = await res.json();
        if (data.status === "Ready") {
          console.log("Model Ready!")
          setModelReady(true);
          
        } else {
          setTimeout(checkModelReady, 2000);
        }
      } catch(error) {
        console.error("Error warming up model: ", error);
        setTimeout(checkModelReady, 2000);
      }
    };

    if(!modelReady) {
      checkModelReady();
    }

    return () => {
      mounted = false;  
    };
  }, [modelReady]);
  
  //Handles Playlist Generation
  const handleGenerate = (() => {

  });

  return (
    <div className="container">  
      <div className="app-container invisible-scrollbar">
        <div className="genre-selection">
          <h1 className="genre-title">What Genre(s) of Music would you like to listen to?</h1>
          <div className="musicCards">
            {genres.map(({name, img}) => {
              console.log('Rendering card:', { name, isSelected: selectedGenres.includes(name) }); // Debug log
              return (
                <MusicCard 
                  key={name} 
                  text={name} 
                  imgName={img}
                  onSelect={(isSelected) => handleGenreSelection(name, isSelected)}
                  isSelected={selectedGenres.includes(name)}
                />
              );
            })}
          </div>
        </div>
        <div className="center-btn">
          <div className="app-box">
            <h1 className="app-title">MoodMusic Playlist Generator</h1>
            <MoodAnalysis 
              modelReady={modelReady} 
              startAnalysis={startAnalysis}
              loading={loading}
              detectedEmotion={detectedEmotion}
            />          
            {loading && <LoadingSpinner />}
          </div>
          <button type="submit" className="generate-btn center-btn" onClick={handleGenerate}> Generate My Playlist!</button>
        </div>
      </div>
    </div>
  );
}

export default App;