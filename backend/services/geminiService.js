import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCaptionAndVibe(tags = [], title = '') {
  const promptText = `Generate a funny caption and a vibe for a meme with tags: ${tags.join(', ')} and title: "${title}". Return JSON with "caption" and "vibe" fields.`;

  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-pro-preview-03-25",
      contents: [{ text: promptText }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 256,
      },
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No output from Gemini API");
    
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}
