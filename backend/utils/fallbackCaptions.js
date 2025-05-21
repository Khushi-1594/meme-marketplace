export const fallbackCaptions = [
  { caption: 'To the moon', vibe: 'YOLO Stonks' },
  { caption: 'Doge runs the world', vibe: 'Meme Market Mayhem' },
  { caption: 'When life gives you dips...', vibe: 'Crypto Rollercoaster' },
];

export const getRandomFallback = () => {
  const i = Math.floor(Math.random() * fallbackCaptions.length);
  return fallbackCaptions[i];
};
