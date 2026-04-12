"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  BarChart3, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  PieChart, 
  ShieldAlert, 
  Target,
  Trophy
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useProStatus } from "@/hooks/useProStatus";
import CheckoutModal from "@/components/CheckoutModal";
import { useState } from "react";

const strengths = [
  "Technical Depth: Excellent explanation of K-means clustering and its applications.",
  "Communication: Clear and concise speech patterns with minimal rambling.",
  "STAR Framework: Strong use of the Situation-Task-Action-Result structure in behavioral questions.",
];

const weaknesses = [
  "Technical Gap: Struggled to explain the difference between L1 and L2 regularization.",
  "Confidence: Body language showed signs of nervousness during the 'conflict' story.",
  "Specifics: Needed more concrete metrics for the project impact section.",
];

const resources = [
  { title: "Regularization in ML", platform: "Coursera", link: "#" },
  { title: "Advanced STAR Techniques", platform: "LinkedIn Learning", link: "#" },
  { title: "System Design Primer", platform: "GitHub", link: "#" },
];

export default function PerformanceAnalytics() {
  const { isPro, upgradeToPro } = useProStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const readinessScore = 85;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={upgradeToPro} 
      />

      <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Previous Header code... */}
        <header className="mb-12 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Interview Performance Analysis</h1>
              {isPro && (
                <span className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20">
                  Pro Feature
                </span>
              )}
            </div>
            <p className="text-zinc-500">Session: Google SDE Intern Mock #1 — Dec 12, 2026</p>
          </div>
          <button 
            onClick={async () => {
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/interview/send-report`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    user_email: "user@example.com", // Mock email
                    username: "Manav",
                    report_link: window.location.href
                  })
                });
                if (res.ok) alert("Report sent to your email!");
              } catch (err) {
                console.error("Email failed", err);
              }
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-bold text-white hover:bg-primary/90 transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            Email Report
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Scorecard */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-8 shadow-2xl">
              {/* Scorecard content... */}
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
              
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative flex h-48 w-48 items-center justify-center">
                  <svg className="h-48 w-48 -rotate-90 transform">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 88}
                      initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - readinessScore / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-extrabold">{readinessScore}</span>
                    <span className="text-xs uppercase tracking-widest text-zinc-500">Readiness</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Excellent Progress!</h2>
                  <p className="text-zinc-400 leading-relaxed">
                    You're in the top 15% of candidates for this role. Your technical foundation is solid, but polishing your situational storytelling will push you to 90+.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
                      <Trophy className="h-4 w-4" />
                      Above Average
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
                      <Target className="h-4 w-4" />
                      Role Fit: High
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights - Pro Feature */}
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Advanced Vocal Emotion Analysis</h3>
                </div>
                {!isPro && (
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Pro Required
                  </span>
                )}
              </div>

              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 ${!isPro ? "blur-md select-none" : ""}`}>
                {[
                  { label: "Confidence", value: 92, color: "bg-green-500" },
                  { label: "Articulateness", value: 85, color: "bg-blue-500" },
                  { label: "Anxiety", value: 12, color: "bg-red-500" },
                  { label: "Calmness", value: 78, color: "bg-purple-500" },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">{item.label}</span>
                      <span className="font-bold text-white">{item.value}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {!isPro && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <p className="mb-4 text-center text-sm font-medium text-white px-8">
                    Upgrade to Pro to unlock detailed vocal tone and emotional analysis from Hume AI.
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-full bg-primary px-8 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-all font-bold"
                  >
                    Unlock Pro Insights
                  </button>
                </div>
              )}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-green-400 mb-6">
                  <CheckCircle2 className="h-5 w-5" />
                  <h3 className="font-bold">Key Strengths</h3>
                </div>
                <ul className="space-y-4">
                  {strengths.map((s, i) => (
                    <li key={i} className="text-sm text-zinc-300 leading-relaxed flex gap-3">
                      <span className="mt-1 h-1 w-1 rounded-full bg-green-400 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-red-400 mb-6">
                  <ShieldAlert className="h-5 w-5" />
                  <h3 className="font-bold">Areas for Improvement</h3>
                </div>
                <ul className="space-y-4">
                  {weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-zinc-300 leading-relaxed flex gap-3">
                      <span className="mt-1 h-1 w-1 rounded-full bg-red-400 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Actionable Advice & Resources */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Actionable Advice
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Immediate Task</h4>
                  <p className="text-sm text-zinc-300 underline underline-offset-4 decoration-primary">
                    Re-write your conflict story using the STAR framework.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Next Session</h4>
                  <p className="text-sm text-zinc-300">
                    Focus solely on Behavioral questions for 30 minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-primary" />
                Recommended Resources
              </h3>
              <div className="space-y-3">
                {resources.map((res, i) => (
                  <Link
                    key={i}
                    href={res.link}
                    className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/5 transition-all outline-none"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200 group-hover:text-primary transition-colors">{res.title}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{res.platform}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-zinc-700 group-hover:text-white transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
