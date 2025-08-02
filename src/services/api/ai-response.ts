// pages/api/ai-response.ts

import type { NextApiRequest, NextApiResponse } from "next";

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID!;
const API_KEY = process.env.ELEVENLABS_API_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    const elevenLabsRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!elevenLabsRes.ok) {
      const errorData = await elevenLabsRes.json();
      return res.status(elevenLabsRes.status).json({
        message: errorData.detail?.message || "ElevenLabs API error",
      });
    }

    const audioBuffer = await elevenLabsRes.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (err: any) {
    console.error("BFF Error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}
