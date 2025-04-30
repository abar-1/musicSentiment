import React, { useState } from 'react'
import { useRef } from 'react';
import './musicCards.css';

function MusicCard({ imgName, text, onClick }) {
    const imagePath = `/assets/${imgName}`; 
    const [isActive, setIsActive] = useState(false);;

    const handleCardClick = () => {
      setIsActive(prev => !prev);
      console.log("Test");
    }
    
    return (
      <div className="musicCard">
        <button
          className= {`music-card ${isActive ? 'active' : ''}`}
          style={{ backgroundImage: `url(${imagePath})` }}
          onClick={handleCardClick}
        >
          <p className="music-card-text">{text}</p>
        </button>
      </div>
    );
}
  

export default MusicCard;