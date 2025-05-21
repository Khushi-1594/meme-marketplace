import supabase from '../supabase/supabaseClient.js';

export const placeBid = (io) => async (req, res) => {
  const { id: meme_id } = req.params;
  const { user_id, credits } = req.body;

  const { data, error } = await supabase
    .from('Bids')
    .insert([{ meme_id, user_id, credits }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  io.emit('newBid', {
    meme_id, 
    user_id,
    credits,
  });

  res.status(200).json({ message: 'Bid placed', bid: data[0] });
};
