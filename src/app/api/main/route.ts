// src/app/api/main/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path param" }, { status: 400 });
  }

  try {
    const apiUrl = process.env.URL; // Make sure this is defined in .env.local

    console.log("`${apiUrl}/${path}`", `${apiUrl}/${path}`);

    const response = await fetch(`${apiUrl}/${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}`, // optional
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to fetch data", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Request failed", message: error.message },
      { status: 500 }
    );
  }
}
