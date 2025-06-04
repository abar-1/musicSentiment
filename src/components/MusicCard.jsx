import React from 'react';
import './musicCards.css';

function MusicCard({ imgName, text, onSelect, isSelected }) {
    const imagePath = `/assets/${imgName}`; 

    const handleCardClick = () => {
      try {
        console.log('Card clicked:', { text, isSelected, onSelect }); // Debug log
        if (typeof onSelect === 'function') {
          onSelect(!isSelected);
        } else {
          console.error('onSelect is not a function:', onSelect);
        }
      } catch (error) {
        console.error('Error in handleCardClick:', error);
      }
    }
    
    return (
      <div className="musicCard">
        <button
          className={`music-card ${isSelected ? 'active' : ''}`}
          style={{ backgroundImage: `url(${imagePath})` }}
          onClick={handleCardClick}
        >
          <p className="music-card-text">{text}</p>
        </button>
      </div>
    );
}

export default MusicCard;