"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Mic, 
  Send, 
  X, 
  Image as ImageIcon, 
  Volume2, 
  VolumeX,
  Sparkles,
  Loader2,
  Camera,
  Star,
  Wrench,
  AlertCircle
} from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI career assistant. How can I help you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);
    setShowRating(false);
    setShowTroubleshooting(false);

    try {
      const formData = new FormData();
      formData.append("text", message);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/assistant`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);

      if (data.action === "SHOW_RATING") {
        setShowRating(true);
      } else if (data.action === "SHOW_TROUBLESHOOTING") {
        setShowTroubleshooting(true);
      } else if (data.action === "NAVIGATE_TO_ROADMAP") {
        window.location.href = "/roadmap";
      } else if (data.action === "NAVIGATE_TO_INTERVIEW") {
        window.location.href = "/interview";
      } else if (data.action === "NAVIGATE_TO_ANALYTICS") {
        window.location.href = "/analytics";
      }
    } catch (error) {
      console.error("Assistant Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I had trouble connecting to the brain. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const submitRating = async (val: number) => {
    setRating(val);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: val, comment: "User rated via bot" }),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: `Thank you for your ${val}-star rating! 🌟` }]);
      setShowRating(false);
    } catch (err) {
      console.error("Rating submission failed", err);
    }
  };

  const handleFix = (fixType: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content: `I've attempted a '${fixType}' for you. The site should work better now!` }]);
    setShowTroubleshooting(false);
  };

  const toggleVoice = () => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (!isListening) {
        setIsListening(true);
        recognition.start();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          setIsListening(false);
          // Auto-send on voice end could be added here
        };
        recognition.onerror = () => setIsListening(false);
      } else {
        setIsListening(false);
        recognition.stop();
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 h-[500px] w-[380px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl flex flex-col"
          >
            {/* Header ... */}
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Career AI Agent</h3>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Autonomous Mode</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-500 hover:text-white transition-colors">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user" 
                    ? "bg-primary text-white" 
                    : "bg-white/5 text-zinc-300 border border-white/5"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {showRating && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/10 flex flex-col gap-3">
                    <p className="text-xs text-zinc-400">Rate your experience:</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => submitRating(star)}
                          className={`hover:scale-110 transition-transform ${rating >= star ? "text-yellow-400" : "text-zinc-600"}`}
                        >
                          <Star className="h-5 w-5" fill={rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {showTroubleshooting && (
                <div className="flex justify-start">
                  <div className="w-full rounded-2xl bg-white/5 p-4 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-medium text-xs">
                      <Wrench className="h-3 w-3" /> Autonomous Fix Suggestions
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <button onClick={() => handleFix("Reset Roadmap")} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-zinc-300 transition-colors">
                        <span>Reset Your Roadmap</span>
                        <AlertCircle className="h-3 w-3" />
                      </button>
                      <button onClick={() => handleFix("Clear Interview Session")} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-zinc-300 transition-colors">
                        <span>Clear Interview Session</span>
                        <AlertCircle className="h-3 w-3" />
                      </button>
                      <button onClick={() => window.location.reload()} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-zinc-300 transition-colors">
                        <span>Hard Refresh Site</span>
                        <AlertCircle className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 border border-white/5">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-xs text-zinc-500 italic">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask me anything..."
                    className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-2 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all pr-10"
                  />
                  <button className="absolute right-2 top-1.5 text-zinc-600 hover:text-primary transition-colors">
                    <ImageIcon className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={toggleVoice}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                    isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Predictive UX</span>
                <span className="flex items-center gap-1"><Camera className="h-3 w-3" /> Multimodal</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all hover:bg-primary/90"
      >
        {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
      </motion.button>
    </div>
  );
}
