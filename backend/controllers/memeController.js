import supabase from '../supabase/supabaseClient.js';

export const createMeme = async (req, res) => {
  try {
    const { title, image_url, tags } = req.body;
    const finalImageUrl = image_url || 'https://th.bing.com/th/id/OIP.AS8rkTKWhsA8Z6a-Hi_vrgHaEJ?cb=iwp2&rs=1&pid=ImgDetMain';

    let tagsArray = tags;
    if (typeof tags === 'string') {
      tagsArray = tags.split(',').map(tag => tag.trim());
    }

    const { data, error } = await supabase
      .from('Memes')
      .insert([{ title, image_url: finalImageUrl, tagsArray }])
      .select();
    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Meme created', meme: data[0] });
  } catch (err) {
    console.error('Unexpected Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getMemes = async (req, res) => {
  const { data, error } = await supabase
    .from('Memes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const voteMeme = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!['up', 'down'].includes(type)) {
    return res.status(400).json({ error: 'Invalid vote type. Use "up" or "down".' });
  }

  const delta = type === 'up' ? 1 : -1;

  const { data, error } = await supabase
    .rpc('increment_upvotes', {
      meme_id_input: id,
      delta_input: delta
    });

  if (error) {
    console.error('Vote error:', error);
    return res.status(500).json({ error: error.message });
  }

  if (req.io) {
    req.io.emit('voteUpdate', { meme_id: id, upvotes: data });
  }

  res.status(200).json({ message: 'Vote registered', upvotes: data });
};

export const getLeaderboard = async (req, res) => {
  const top = parseInt(req.query.top) || 10;

  const { data, error } = await supabase
    .from('Memes')
    .select('*')
    .order('upvotes', { ascending: false })
    .limit(top);

  if (error) {
    console.error('Leaderboard Error:', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
};
