"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Square, 
  Video, 
  VideoOff,
  Bot,
  MessageSquare,
  UserCircle
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function MockInterviewRoom() {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("Tell me about a time you had to handle a conflict within your team.");
  const [transcription, setTranscription] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft]);

  const speakQuestion = async (text: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/interview/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error("Speech error:", error);
    }
  };

  useEffect(() => {
    // Speak the question when it changes or on initial load
    speakQuestion(currentQuestion);
  }, [currentQuestion]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate transcription starting
      setTranscription("I once worked on a group project where...");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 h-[calc(100vh-64px)] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <Link href="/roadmap" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            End Session
          </Link>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-zinc-900 px-4 py-2 border border-white/5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium tabular-nums">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <button className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-all">
              Submit Answer
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
          {/* AI / Intervewer Pane */}
          <div className="relative flex flex-col gap-6 rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Bot className="h-6 w-6" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={currentQuestion}
                className="space-y-4"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Current Question</span>
                <h2 className="text-2xl font-bold leading-relaxed">
                  "{currentQuestion}"
                </h2>
              </motion.div>
            </div>

            <div className="mt-auto">
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                    <MessageSquare className="h-4 w-4 text-zinc-400" />
                  </div>
                  <span className="text-sm font-medium text-zinc-400">AI Transcription Active</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: isRecording ? [4, 12, 4] : 4 }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 rounded-full bg-primary"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User / Camera Pane */}
          <div className="relative flex flex-col rounded-2xl border border-white/5 bg-zinc-900 overflow-hidden shadow-2xl">
            {!isCameraOn ? (
              <div className="flex-1 flex items-center justify-center bg-zinc-950">
                <UserCircle className="h-32 w-32 text-zinc-800" />
              </div>
            ) : (
              <div className="flex-1 relative bg-black">
                {/* Simulated Camera Feed Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="text-sm font-medium text-white">Manav - Live</span>
                </div>
              </div>
            )}

            {/* Transcription Overlay */}
            <AnimatePresence>
              {isRecording && transcription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-24 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10"
                >
                  <p className="text-zinc-300 italic text-sm">
                    "{transcription}..."
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls Bar */}
            <div className="p-6 bg-black/80 backdrop-blur-md border-t border-white/5">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                    isMicOn ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-red-500 text-white"
                  }`}
                >
                  {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </button>
                <button
                  onClick={toggleRecording}
                  className={`flex h-20 w-20 flex-col items-center justify-center rounded-full transition-all ${
                    isRecording 
                    ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-pulse" 
                    : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isRecording ? <Square className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white" />}
                  <span className="text-[10px] font-bold mt-1 uppercase">
                    {isRecording ? "Stop" : "Record"}
                  </span>
                </button>
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                    isCameraOn ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-red-500 text-white"
                  }`}
                >
                  {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
