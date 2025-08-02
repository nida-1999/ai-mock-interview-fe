"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function InterviewSession({ sessionId, introMsg }: any) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [awaitingUserSpeech, setAwaitingUserSpeech] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://7a189fa91eb7.ngrok-free.app/ws/${sessionId}`
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket opened");
      console.log("introMsg", introMsg);

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN &&
        sessionId &&
        introMsg
      ) {
        console.log("---in if-------");
        socketRef.current.send(
          JSON.stringify({
            type: "user-message",
            content: introMsg,
          })
        );
        setMessages([introMsg]);
        speak(introMsg);
      }
    };

    // socket.onmessage = (event) => {
    //   try {
    //     console.log(event?.data);
    //     const data = event.data;
    //     if (data) {
    //       setMessages((prev) => [...prev, data]);
    //       speak(data);
    //     }
    //   } catch (err) {
    //     console.error("❌ Invalid JSON from server", err);
    //     setError("Invalid message format");
    //   }
    // };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event?.data);
        console.log("type", data?.type);
        console.log("msg", data?.content);
        // if (data.type === "ai-response" && data?.message) {
        //   setMessages((prev) => [...prev, data?.message]);
        //   speak(data?.message);
        // }
        if (data?.content) {
          setMessages((prev) => [...prev, data?.content]);
          speak(data?.content);
        }
      } catch (err) {
        console.error("❌ Invalid JSON from server", err);
        setError("Invalid message format");
      }
    };

    socket.onerror = () => setError("WebSocket Error. Check connection.");
    socket.onclose = () => {
      socketRef.current = null;
      console.warn("🔌 WebSocket closed");
    };
  }, []);

  const checkSilence = (analyser: AnalyserNode, recorder: MediaRecorder) => {
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);

    const volume =
      data.reduce((acc, val) => acc + Math.abs(val - 128), 0) / data.length;

    if (volume < 5) {
      silenceTimeoutRef.current ??= setTimeout(() => {
        if (recorder.state !== "inactive") {
          recorder.stop();
          setIsRecording(false);
          setIsProcessing(true);
        }
      }, 1500);
    } else {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }

    requestAnimationFrame(() => checkSilence(analyser, recorder));
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        try {
          const formData = new FormData();
          formData.append("file", blob, "speech.webm");
          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          const { transcript } = await res.json();
          if (!transcript) throw new Error("Transcription failed");

          setMessages((prev) => [...prev, transcript]);
          console.log("transcript", transcript);
          sendUserMessage(transcript);
        } catch (err: any) {
          setError(err.message || "Failed to process speech.");
        } finally {
          setIsProcessing(false);
        }
      };

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      recorder.start();
      setIsRecording(true);
      requestAnimationFrame(() => checkSilence(analyser, recorder));
    } catch (err) {
      setError("Microphone access denied or unavailable.");
    }
  };

  const sendUserMessage = (message: string) => {
    console.log("socketRef", socketRef);
    console.log("socketRef.current.readyState", socketRef?.current?.readyState);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          // type: "user-message",
          content: message,
        })
      );
      socketRef.current.send(message);
    } else {
      setError("WebSocket not connected.");
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
      console.log("response.ok", response.ok);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Audio generation failed.");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(() => setError("Audio playback error."));
        audioRef.current.onended = () => {
          setIsProcessing(false);
          setAwaitingUserSpeech(true);
        };
      }
    } catch (err: any) {
      setError(err.message || "Audio error.");
      setIsProcessing(false);
    }
  };

  const startInterview = async () => {
    setIsInterviewStarted(true);
    // const intro = "Let's begin your interview. Tell me about yourself.";
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(introMsg);

      // socketRef.current.send(
      //   JSON.stringify({
      //     type: "user-message",
      //     content: introMsg,
      //     sessionId: "123",
      //   })
      // );
    }
    // setMessages([introMsg]);
    // await speak(introMsg);
    setAwaitingUserSpeech(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-xl min-h-screen space-y-6">
      <Button
        className="w-full"
        onClick={startInterview}
        disabled={isInterviewStarted}
      >
        {isInterviewStarted ? "Interview in Progress" : "Start Interview"}
      </Button>

      {isInterviewStarted &&
        awaitingUserSpeech &&
        !isRecording &&
        !isProcessing && (
          <Button
            className="w-full bg-blue-600"
            onClick={() => {
              setAwaitingUserSpeech(false);
              startRecording();
            }}
          >
            🎤 Start Speaking
          </Button>
        )}

      {isInterviewStarted && (
        <>
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg shadow ${
                  i % 2 === 0 ? "bg-gray-700" : "bg-blue-700"
                }`}
              >
                {msg}
              </div>
            ))}
          </div>
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
// socket.onmessage = (event) => {
//   try {
//     const data = JSON.parse(event.data);
//     console.log("type", data?.type);
//     console.log("msg", data?.message);
//     if (data.type === "ai-response" && data?.message) {
//       setMessages((prev) => [...prev, data?.message]);
//       speak(data?.message);
//     }
//   } catch (err) {
//     console.error("❌ Invalid JSON from server", err);
//     setError("Invalid message format");
//   }
// };

// return () => {
//   socket.close();
//   socketRef.current = null;
// };

// socketRef.current.send(
//   JSON.stringify({
//     type: "user-message",
//     message,
//     sessionId: "123",
//   })
// );
