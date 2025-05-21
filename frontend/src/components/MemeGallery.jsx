import MemeCard from "./MemeCard";

function MemeGallery({ memes, highestBids }) {
  return (
    <>
      <h2 className="text-3xl mb-6 text-center font-mono glitch-text">
        Gallery
      </h2>
     <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className="bg-black bg-opacity-60 rounded-lg p-4 shadow-lg hover:scale-[1.03] transition-transform duration-300 neon-border"
          >
            <img
              src={meme.image_url || defaultImage}
              alt={meme.title}
              className="w-full h-48 object-cover rounded-md mb-3"
              loading="lazy"
            />
            <h3 className="text-xl font-bold glitch-text">{meme.title}</h3>
            <p className="text-sm italic text-pink-400 mt-1">
              {meme.tagsArray?.join(", ") || ""}
            </p>

             <MemeCard meme={meme} highestBid={highestBids[meme.id]}/>
          </div>
        ))}
      </div>
    </>
  );
}

export default MemeGallery;
