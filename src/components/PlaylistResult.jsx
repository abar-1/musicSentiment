import React from 'react';
import { Music } from 'lucide-react';
import '../index.css'

const PlaylistResult = ({ playlist, onCreateNew }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white bg-opacity-20 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-white mb-2">Your Mood Playlist</h2>
        
        <div className="mb-4">
          <div className="text-white opacity-80 text-sm mb-1">Based on your mood:</div>
          <div className="text-white italic">"{playlist.moodDescription}"</div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Music size={20} className="text-green-400" />
            <span className="text-white">{playlist.tracks.length} songs</span>
          </div>
          
          <a
            href={playlist.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white py-2 px-4 rounded-full text-sm hover:bg-green-600 transition-colors flex items-center gap-1"
          >
            Play on Spotify
          </a>
        </div>
        
        <div className="max-h-64 overflow-y-auto px-2">
          <table className="w-full text-white">
            <tbody>
              {playlist.tracks.map((track, index) => (
                <tr key={index} className="border-b border-white border-opacity-10 last:border-none">
                  <td className="py-2 w-8 text-center opacity-60">{index + 1}</td>
                  <td className="py-2">
                    <div className="font-medium">{track.name}</div>
                    <div className="text-sm opacity-70">{track.artist}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <button
        onClick={onCreateNew}
        className="py-2 px-4 border border-white border-opacity-30 text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
      >
        Create Another Playlist
      </button>
    </div>
  );
};

export default PlaylistResult;