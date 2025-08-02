// "use client"; // Required for React hooks

// import { useState, useRef } from "react";
// import { Mic } from "lucide-react";

// // ==============================================================================
// // DANGER: YOUR SECRET API KEY IS EXPOSED TO THE PUBLIC HERE.
// // ANYONE CAN STEAL THIS KEY FROM YOUR WEBSITE'S CODE.
// // THIS IS FOR LOCAL TESTING ONLY. REVOKE THIS KEY AFTER TESTING.
// const INSECURE_ELEVENLABS_API_KEY =
//   "sk_1e5386d243403bb3f99d19fecba6d71260748528ab966769";
// // ==============================================================================

// const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

// export default function InsecureSpeechToTextPage() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [transcribedText, setTranscribedText] = useState("");
//   const [error, setError] = useState(null);
//   const audioRef = useRef<HTMLAudioElement>(null);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const handleToggleRecording = () => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   };

//   const getAiResponse = async (text: string) => {
//     try {
//       // --- THIS IS THE INSECURE, DIRECT API CALL ---
//       const response = await fetch(
//         `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
//         {
//           method: "POST",
//           headers: {
//             Accept: "audio/mpeg",
//             "Content-Type": "application/json",
//             "xi-api-key": INSECURE_ELEVENLABS_API_KEY, // The key is exposed here
//           },
//           body: JSON.stringify({
//             text: text,
//             model_id: "eleven_flash_v2",
//             voice_settings: {
//               stability: 0.5,
//               similarity_boost: 0.5,
//             },
//           }),
//         }
//       );

//       console.log(response, response.json());
//       // --- END OF DIRECT API CALL ---

//       if (!response.ok) {
//         // Log the error response from ElevenLabs for debugging
//         const errorData = await response.json();
//         console.error("ElevenLabs API Error:", errorData);
//         throw new Error(
//           `Failed to fetch audio from ElevenLabs. Status: ${response.status}`
//         );
//       }

//       const audioBlob = await response.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);

//       audioRef.current.src = audioUrl;
//       audioRef.current.loop = true;
//       audioRef.current.play().catch((err) => {
//         console.error("Audio playback failed:", err);
//         // setAudioError(true);
//       });
//     } catch (error) {
//       console.error("Error setting up interview audio:", error);
//       //   setAudioError(true);
//     } finally {
//       //   setIsLoadingAudio(false);
//     }
//   };

//   const startRecording = async () => {
//     setError(null);
//     setTranscribedText("");
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       mediaRecorderRef.current.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };
//       // When recording stops, call the function to send the audio to ElevenLabs
//       mediaRecorderRef.current.onstop = sendAudioToElevenLabs;
//       audioChunksRef.current = [];
//       mediaRecorderRef.current.start();
//       setIsRecording(true);
//     } catch (err) {
//       setError("Microphone access denied. Please check browser permissions.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop(); // This will trigger the 'onstop' event
//       setIsRecording(false);
//       setIsProcessing(true);
//     }
//   };

//   // This function makes the INSECURE, direct API call from the browser
//   const sendAudioToElevenLabs = async () => {
//     const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//     console.log("audioBlob", audioBlob);
//     const formData = new FormData();
// formData.append("file", audioBlob, "recording.webm");

// formData.append("model_id", "scribe_v1");

//     // Use an appropriate language code, e.g., 'en-US' for American English
//     formData.append("language_code", "eng");
//     // ---------------------------------

//     console.log("formData", formData);

//     try {
//       //   const response = await fetch(
//       //     "https://api.elevenlabs.io/v1/speech-to-text",
//       //     {
//       //       method: "POST",
//       //       headers: {
//       //         // The API key is sent directly from the browser, making it visible
//       //         // to anyone inspecting network traffic.
//       //         // "xi-api-key": INSECURE_ELEVENLABS_API_KEY,
//       //       },
//       //       body: formData,
//       //     }
//       //   );

//       //   console.log("response", response);

//       const data = {
//         sessionId: "123",
//         message: "what is sliding technique?",
//       };

//       const res = await fetch(
//         "https://4292e0a0101b.ngrok-free.app/interview/message",

//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           // 2. Convert the JavaScript object to a JSON string
//           body: JSON.stringify(data),
//         }
//       );

//       const responseData = await res.json();
//       console.log("responseData", responseData);

//       if (responseData?.message) {
//         getAiResponse(responseData?.message);
//       }

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(
//           errorData.detail?.message || "Failed to transcribe audio."
//         );
//       }

//       setTranscribedText(responseData.message);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
//       <div className="p-8 max-w-2xl w-full mx-auto bg-slate-800 rounded-xl shadow-lg text-center">
//         <h1 className="text-2xl font-bold mb-8">
//           Direct-to-API Speech Transcription
//         </h1>
//         <p className="text-sm text-yellow-400 mb-4 font-semibold">
//           Warning: This page uses an insecure method for demonstration only.
//         </p>
//         <button
//           onClick={handleToggleRecording}
//           disabled={isProcessing}
//           className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all ${
//             isRecording ? "bg-red-600 animate-pulse" : "bg-blue-600"
//           } ${isProcessing ? "bg-gray-500 cursor-not-allowed" : ""}`}
//         >
//           <Mic className="w-10 h-10" />
//         </button>
//         <div className="h-24 mt-6 flex items-center justify-center">
//           {isProcessing && <p className="text-blue-400">Processing audio...</p>}
//           {error && <p className="text-red-400 font-semibold">{error}</p>}
//           {transcribedText && (
//             <div className="p-4 bg-slate-700 rounded-md w-full">
//               <p className="whitespace-pre-wrap">{transcribedText}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }

("use client"); // Required for React hooks

import { useState, useRef } from "react";
import { Mic } from "lucide-react";

const INSECURE_ELEVENLABS_API_KEY = process.env.ELEVEN_LABS_KEY;
// ==============================================================================

const VOICE_ID = process.env.VOICE_ID;

export default function FixedSpeechToTextPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [error, setError] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // const audioChunksRef = useRef<Blob[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);

  // const mediaRecorderRef = useRef(null);
  // const audioChunksRef = useRef([]);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getAiResponse = async (text: string) => {
    try {
      const response = await fetch("/api/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch AI response");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (err: any) {
      console.error("Error playing audio:", err);
      setError(err.message);
    }
  };

  const startRecording = async () => {
    setError(null);
    setTranscribedText("");

    try {
      // Stop previous recording if still active
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Reset chunks
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Store audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event?.data);
        }
      };

      // Send audio when recording stops
      mediaRecorder.onstop = () => {
        sendAudioToBackend();
        stream.getTracks().forEach((track) => track.stop()); // stop mic stream
      };

      // Optional: error handler
      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        setError("Recording error occurred. Please try again.");
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording failed:", err);
      setError("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  // Renamed for clarity
  const sendAudioToBackend = async () => {
    // --- For now, we are skipping the speech-to-text part ---
    // --- and sending a hardcoded message to your backend. ---
    const userMessage = "I am thinking of using stack, is this correct?"; // Hardcoded for testing

    try {
      const response = await fetch(
        "https://4292e0a0101b.ngrok-free.app/interview/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: "123",
            message: userMessage,
          }),
        }
      );

      // --- FIX #3: MORE ROBUST ERROR HANDLING ---
      // Check status before trying to parse JSON
      if (!response.ok) {
        throw new Error(`Backend server error: ${response.status}`);
      }

      const responseData = await response.json();

      setTranscribedText(`AI is responding to: "${userMessage}"`);

      // If the backend sent back a message, convert it to speech
      if (responseData?.message) {
        await getAiResponse(responseData.message);
      } else {
        setError("Backend did not provide a message to speak.");
      }
    } catch (err) {
      console.error("Error communicating with backend:", err);
      // setError(err?.message ?? "");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      {/* FIX #4: ADD THE HIDDEN AUDIO ELEMENT TO THE JSX */}
      <audio ref={audioRef} />

      <div className="p-8 max-w-2xl w-full mx-auto bg-slate-800 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-8">Conversational AI Test</h1>
        <p className="text-sm text-yellow-400 mb-4 font-semibold">
          Warning: This page uses an insecure method for demonstration only.
        </p>
        <button
          onClick={handleToggleRecording}
          disabled={isProcessing}
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all ${
            isRecording ? "bg-red-600 animate-pulse" : "bg-blue-600"
          } ${isProcessing ? "bg-gray-500 cursor-not-allowed" : ""}`}
        >
          <Mic className="w-10 h-10" />
        </button>
        <div className="h-24 mt-6 flex items-center justify-center">
          {isProcessing && <p className="text-blue-400">Processing...</p>}
          {error && <p className="text-red-400 font-semibold">{error}</p>}
          {transcribedText && (
            <div className="p-4 bg-slate-700 rounded-md w-full">
              <p className="whitespace-pre-wrap">{transcribedText}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
