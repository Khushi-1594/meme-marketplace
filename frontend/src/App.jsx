import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MemeForm from './components/memeForm';
import MemeGallery from './components/memeGallery';
import socket from './socket';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const [memes, setMemes] = useState([]);
  const [highestBids, setHighestBids] = useState({});

  useEffect(() => {
    fetchMemes();
  }, []);

   useEffect(() => {
    socket.on('newBid', (data) => {
      setHighestBids((prev) => {
        const prevBid = prev[data.meme_id];
        if (!prevBid || data.credits > prevBid.credits) {
          return { ...prev, [data.meme_id]: data };
        }
        return prev;
      });
    });

    return () => {
      socket.off('newBid');
    };
  }, []);

  const fetchMemes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/memes/all`);
      setMemes(res.data);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const addMeme = async (memeData) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/memes`, memeData);
      setMemes([res.data.meme, ...memes]);
    } catch (error) {
      console.error('Error creating meme:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-700 via-purple-900 to-blue-700 text-white flex flex-col items-center justify-center p-6">
     <h1 className="text-5xl mb-6 text-center font-mono glitch-text">Meme MarketPlace</h1>
      <MemeForm onAddMeme={addMeme} />
      <MemeGallery memes={memes} highestBids={highestBids}/>
      <Leaderboard />

      <style>{`
        .glitch-text {
          color: #ff00ff;
          text-shadow:
            0 0 5px #ff00ff,
            0 0 10px #ff00ff,
            0 0 20px #ff00ff,
            0 0 40px #00ffff,
            0 0 80px #00ffff;
          animation: flicker 2s infinite;
          font-family: 'Courier New', Courier, monospace;
        }
        .neon-button {
          box-shadow: 0 0 8px #ff00ff, 0 0 20px #ff00ff;
        }
        .neon-border {
          border: 2px solid #ff00ff;
          box-shadow: 0 0 10px #ff00ff;
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
          }
          20%, 22%, 24%, 55% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
