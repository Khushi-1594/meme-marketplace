import supabase from '../supabase/supabaseClient.js';
import { generateCaptionAndVibe } from '../services/geminiService.js';
import { getRandomFallback } from '../utils/fallbackCaptions.js';

export const generateCaption = async (req, res) => {
  const { id } = req.params;

  const { data: meme, error: fetchError } = await supabase
    .from('Memes')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !meme) return res.status(404).json({ error: 'Meme not found' });

  const result = await generateCaptionAndVibe(meme.tagsArray || [], meme.title);

  const finalResult = result || getRandomFallback();

  const { data, error: updateError } = await supabase
    .from('Memes')
    .update({
      caption: finalResult.caption,
      vibe: finalResult.vibe
    })
    .eq('id', id)
    .select();

  if (updateError) return res.status(500).json({ error: updateError.message });

  res.status(200).json({ message: 'Caption and Vibe updated', meme: data[0] });
};
