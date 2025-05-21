import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [topMemes, setTopMemes] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/memes/leaderboard?top=10`);
        setTopMemes(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold mb-8 text-center glitch-text">🏆 Meme Leaderboard</h2>
      <table className="w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="p-5 border border-gray-400">Rank</th>
            <th className="p-5 border border-gray-400">Image</th>
            <th className="p-5 border border-gray-400 text-left">Title</th>
            <th className="p-5 border border-gray-400">Upvotes</th>
          </tr>
        </thead>
        <tbody>
          {topMemes.map((meme, index) => (
            <tr
              key={meme.id}
              className={index % 2 === 0 ? 'bg-transparent' : 'bg-transparent'}
            >
              <td className="text-center p-6 border border-gray-300 font-semibold text-lg">{index + 1}</td>
              <td className="p-6 border border-gray-300">
                <div className="w-20 h-20 overflow-hidden rounded-md mx-auto">
                  <img
                    src={meme.image_url}
                    alt={meme.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              </td>
              <td className="p-6 border border-gray-300 text-lg">{meme.title}</td>
              <td className="text-center p-6 border border-gray-300 font-semibold text-lg">{meme.upvotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
