"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function InterviewSession() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkSilence = (
    analyser: AnalyserNode,
    mediaRecorder: MediaRecorder
  ) => {
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);

    const volume =
      data.reduce((acc, val) => acc + Math.abs(val - 128), 0) / data.length;

    if (volume < 5) {
      silenceTimeoutRef.current ??= setTimeout(() => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          setIsRecording(false);
          setIsProcessing(true);
        }
      }, 3000);
    } else {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }

    requestAnimationFrame(() => checkSilence(analyser, mediaRecorder));
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        try {
          const formData = new FormData();
          formData.append("file", blob, "speech.webm");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          const { transcript } = await res.json();

          console.log("Transcript.", transcript);

          if (!transcript) throw new Error("Transcription failed");

          setMessages((prev) => [...prev, transcript]);

          const backendRes = await fetch(
            "https://80eb788b89a9.ngrok-free.app/interview/message",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: "123", message: transcript }),
            }
          );

          const backendJson = await backendRes.json();

          console.log("backendJson", backendJson);

          const aiResponse = backendJson?.message;
          console.log("aiResponse", aiResponse);
          setMessages((prev) => [...prev, aiResponse]);

          if (aiResponse) {
            await speak(aiResponse);
          }
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Failed to process speech.");
        } finally {
          setIsProcessing(false);
        }
      };

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.start();
      setIsRecording(true);
      requestAnimationFrame(() => checkSilence(analyser, mediaRecorder));
    } catch (err) {
      setError("Microphone access denied. Please check permissions.");
    }
  };

  const speak = async (text: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate audio.");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch((err) => {
          console.error("Playback failed:", err);
          setError("Could not play audio.");
        });

        audioRef.current.onended = () => {
          setIsProcessing(false);
          // startRecording();
        };
      }
    } catch (err: any) {
      console.error("Speech error:", err);
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const startInterviewFlow = async () => {
    setIsInterviewStarted(true);
    const intro = "Let's begin your interview. Tell me about yourself.";
    setMessages([intro]);
    setIsRecording(false);
    await speak(intro);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-xl min-h-screen space-y-6">
      <Button
        className="w-full"
        onClick={() => {
          if (!isInterviewStarted) {
            startInterviewFlow();
          } else {
            // startR
          }
        }}
      >
        {isInterviewStarted
          ? "Click here to interact with Agent"
          : "Start interview"}
      </Button>

      {isInterviewStarted && (
        <>
          {messages.map((msg, i) => (
            <div key={i} className="bg-gray-700 p-4 rounded-lg shadow">
              {msg}
            </div>
          ))}

          {isRecording && (
            <div className="text-blue-400 animate-pulse">🎤 Listening...</div>
          )}
          {isProcessing && (
            <div className="text-yellow-400">🧠 Thinking...</div>
          )}
        </>
      )}

      {error && <div className="text-red-500">❗ {error}</div>}

      <audio ref={audioRef} hidden>
        <track kind="captions" srcLang="en" label="English captions" />
      </audio>
    </div>
  );
}
