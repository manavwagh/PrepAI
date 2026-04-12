"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const [isPlacementMode, setIsPlacementMode] = useState(false);

  const content = {
    default: {
      tag: "Autonomous Interview Prep",
      headline: "Master Your Next Interview with Precision",
      subtext: "Transform from an 'anxious applicant' to a 'confident interviewee' with our AI-powered roadmap generator and immersive mock interview room."
    },
    placement: {
      tag: "Campus Placement Special",
      headline: "Ace Your On-Campus Placements at VIT",
      subtext: "Targeting TCS, Amazon, or Microsoft? Get custom questions and patterns specific to companies visiting VIT Bhopal this season."
    }
  };

  const current = isPlacementMode ? content.placement : content.default;

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 pt-20">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/30 blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[128px]" />

      <div className="z-10 mx-auto max-w-5xl text-center">
        <motion.button
          onClick={() => setIsPlacementMode(!isPlacementMode)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium transition-all ${
            isPlacementMode ? "bg-primary/20 text-primary border-primary/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]" : "bg-white/5 text-primary-foreground backdrop-blur-sm"
          }`}
        >
          <Sparkles className={`h-4 w-4 ${isPlacementMode ? "text-primary anim-pulse" : "text-primary"}`} />
          <span>{current.tag}</span>
        </motion.button>

        <motion.h1
          key={isPlacementMode ? "placement" : "default"}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6 }}
          className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl"
        >
          {current.headline.split("Interview")[0]}
          {current.headline.includes("Interview") && (
            <>
              <span className="animate-gradient bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                Interview
              </span>
              {current.headline.split("Interview")[1]}
            </>
          )}
          {!current.headline.includes("Interview") && current.headline}
        </motion.h1>

        <motion.p
          key={isPlacementMode ? "sub-p" : "sub-d"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-zinc-400 sm:text-xl"
        >
          {current.subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/dashboard"
            className="group flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-lg font-bold text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
          >
            Start Preparing for Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#how-it-works"
            className="flex h-14 items-center rounded-full border border-white/10 bg-white/5 px-8 text-lg font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            See How it Works
          </Link>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
