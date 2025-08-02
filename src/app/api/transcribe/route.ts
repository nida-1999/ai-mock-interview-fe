// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const elevenResponse = await fetch(
      "https://api.elevenlabs.io/v1/speech-to-text",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        },
        body: (() => {
          const fd = new FormData();
          fd.append("file", new Blob([buffer]), file.name || "audio.webm");
          fd.append("model_id", "scribe_v1");
          return fd;
        })(),
      }
    );

    if (!elevenResponse.ok) {
      const errorText = await elevenResponse.text();
      return NextResponse.json(
        { error: "STT failed", details: errorText },
        { status: 500 }
      );
    }

    const result = await elevenResponse.json();
    return NextResponse.json({ transcript: result.text });
  } catch (err) {
    console.error("STT error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
