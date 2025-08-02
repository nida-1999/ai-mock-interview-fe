// pages/api/generate-audio.ts

import type { NextApiRequest, NextApiResponse } from "next";

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID!;
const API_KEY = process.env.ELEVENLABS_API_KEY!;

console.log("API_KEY", API_KEY);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    const elevenResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": "sk_1e5386d243403bb3f99d19fecba6d71260748528ab966769",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!elevenResponse.ok) {
      const err = await elevenResponse.json();
      return res.status(elevenResponse.status).json({
        message: err?.detail?.message || "ElevenLabs API error",
      });
    }

    const audioBuffer = await elevenResponse.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (error: any) {
    console.error("Error from ElevenLabs:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}
