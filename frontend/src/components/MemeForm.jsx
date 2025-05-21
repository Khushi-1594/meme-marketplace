import React, { useState } from 'react';

export default function MemeForm({ onAddMeme }) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const memeData = {
      title,
      image_url: imageUrl || '', 
      tags,
    };
    onAddMeme(memeData);
    setTitle('');
    setImageUrl('');
    setTags('');
  };

  return (
    <div className="w-full max-w-md bg-black bg-opacity-50 rounded-lg p-8 mb-12 shadow-lg">
      <h2 className="text-3xl mb-6 text-center font-mono glitch-text">Create a Meme</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="px-4 py-2 rounded bg-gray-900 bg-opacity-70 border border-pink-500 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          className="px-4 py-2 rounded bg-gray-900 bg-opacity-70 border border-purple-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="px-4 py-2 rounded bg-gray-900 bg-opacity-70 border border-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 transition-colors py-3 rounded shadow-lg text-lg font-semibold neon-button"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
