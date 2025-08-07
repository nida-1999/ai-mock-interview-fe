import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { text } = await request.json();

  console.log("text", text);

  const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
  const API_KEY = process.env.ELEVENLABS_API_KEY;

  console.log(API_KEY, "API_KEY");

  if (!VOICE_ID || !API_KEY) {
    return NextResponse.json(
      { message: "Missing environment variables" },
      { status: 500 }
    );
  }

  try {
    const elevenResponse = await fetch(
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
          model_id: "eleven_flash_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    console.log("elevenResponse", elevenResponse);

    if (!elevenResponse.ok) {
      const errorData = await elevenResponse.json();
      return NextResponse.json(
        { message: errorData.detail?.message || "ElevenLabs API Error" },
        { status: elevenResponse.status }
      );
    }

    const audioBuffer = await elevenResponse.arrayBuffer();
    return new Response(Buffer.from(audioBuffer), {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error: any) {
    console.log("in catch");
    console.error("ElevenLabs error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
