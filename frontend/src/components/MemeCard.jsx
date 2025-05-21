import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import socket from '../socket';

export default function MemeCard({ meme, highestBid }) {
  const [bid, setBid] = useState('');
  const [upvotes, setUpvotes] = useState(meme.upvotes || 0);
  const [caption, setCaption] = useState(meme.caption || '');
  const [vibe, setVibe] = useState(meme.vibe || '');
  const [loadingCaption, setLoadingCaption] = useState(false);

  // Real-time upvote updates
  useEffect(() => {
    const handleVoteUpdate = ({ meme_id, upvotes: newUpvotes }) => {
      if (meme_id === meme.id) {
        setUpvotes(newUpvotes);
      }
    };

    socket.on('voteUpdate', handleVoteUpdate);
    return () => socket.off('voteUpdate', handleVoteUpdate);
  }, [meme.id]);

  // Handle bidding
  const handleBid = async () => {
    const credits = parseInt(bid);
    if (isNaN(credits) || credits <= 0) {
      return toast.error('Enter a valid number');
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/memes/${meme.id}/bid`, {
        user_id: 'cyberpunk420', // Replace with actual logged-in user
        credits,
      });
      setBid('');
      toast.success('Bid placed!');
    } catch (err) {
      console.error('Bid error:', err);
      toast.error('Failed to place bid');
    }
  };

  // Handle upvote/downvote
  const handleVote = async (type) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/memes/${meme.id}/vote`, { type });
      setUpvotes(res.data.upvotes);
    } catch (err) {
      console.error('Vote failed:', err);
      toast.error('Vote failed');
    }
  };

  // Handle Gemini caption + vibe generation
  const generateCaption = async () => {
    setLoadingCaption(true);
    toast.loading('Generating AI caption...');
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/memes/${meme.id}/caption`);
      const updated = res.data.meme;
      setCaption(updated.caption);
      setVibe(updated.vibe);
      toast.dismiss();
      toast.success('AI Caption & Vibe generated!');
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to generate caption');
      console.error(err);
    } finally {
      setLoadingCaption(false);
    }
  };

  return (
    <div className="bg-black/40 p-4 m-3 rounded-xl neon-border w-full max-w-md text-white shadow-lg">

      {caption && (
        <div className="text-green-400 italic mb-1">
          <strong>Caption:</strong> {caption}
        </div>
      )}
      {vibe && (
        <div className="text-pink-400 italic mb-3">
          <strong>Vibe:</strong> {vibe}
        </div>
      )}

      <button
        onClick={generateCaption}
        disabled={loadingCaption}
        className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-md text-sm neon-border mb-4"
      >
        {loadingCaption ? 'Generating...' : 'Generate AI Caption'}
      </button>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleVote('up')}
          className="neon-button px-3 py-1 text-sm rounded w-20"
        >
          Upvote
        </button>
        <span className="text-lg font-semibold">{upvotes} upvotes</span>
        <button
          onClick={() => handleVote('down')}
          className="neon-button px-3 py-1 text-sm rounded w-20"
        >
          Downvote
        </button>
      </div>

      {highestBid && (
        <div className="mb-2 text-green-400">
          <strong>Highest Bid:</strong> {highestBid.credits} credits by {highestBid.user_id}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <input
          type="number"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          placeholder="Enter credits"
          className="px-2 py-1 rounded text-black"
        />
        <button
          onClick={handleBid}
          className="neon-button px-4 py-1 rounded hover:scale-105 transition-all"
        >
          Bid
        </button>
      </div>
    </div>
  );
}
