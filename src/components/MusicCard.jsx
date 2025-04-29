import React from 'react';
import './musicCards.css';

function MusicCard({imgName, text, onClick}) {
    const imagePath = `/src/assets/${imgName}`; 
    const message = text;

    return(
        <div className="musicCard">
            <button 
            className="music-card" 
            style={{ backgroundImage: `url(${imagePath})` }}
            onClick={onClick}
        >
            <p className="music-card-text">{text}</p>
        </button>
            
        </div>
    );
}

export default MusicCard;