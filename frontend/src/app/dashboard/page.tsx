"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  Clock, 
  FileText, 
  LayoutDashboard, 
  Plus, 
  Settings, 
  UserCircle,
  Gem
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useProStatus } from "@/hooks/useProStatus";
import CheckoutModal from "@/components/CheckoutModal";

const interviews = [
  {
    company: "Google",
    role: "SDE Intern",
    date: "Dec 15, 2026",
    progress: 65,
    status: "In Progress",
    color: "bg-blue-500",
  },
  {
    company: "Microsoft",
    role: "Software Engineer",
    date: "Jan 10, 2027",
    progress: 40,
    status: "Researching",
    color: "bg-green-500",
  },
  {
    company: "Amazon",
    role: "Applied Scientist",
    date: "Jan 22, 2027",
    progress: 10,
    status: "Just Started",
    color: "bg-orange-500",
  },
];

export default function Dashboard() {
  const { isPro, upgradeToPro } = useProStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={upgradeToPro} 
      />

      <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <nav className="space-y-1">
              <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 text-sm font-medium text-white">
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link href="/roadmap" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
                <FileText className="h-5 w-5" />
                AI Roadmaps
              </Link>
              <Link href="/analytics" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
                <BarChart3 className="h-5 w-5" />
                Performance
              </Link>
              <Link href="/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>

            {!isPro && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-400">Annual Plan</span>
                  <span className="text-white font-bold">₹3,999/year</span>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
                >
                  Upgrade Now
                </button>
                <p className="mt-4 text-[10px] text-zinc-500 text-center">
                  Supports UPI, NetBanking, and all Indian Debit/Credit cards.
                </p>
              </motion.div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            <header className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">Welcome back, Manav!</h1>
                  {isPro && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20">
                      <Gem className="h-3 w-3" />
                      Pro
                    </span>
                  )}
                </div>
                <p className="text-zinc-500">You have 3 active interview preparations.</p>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 border border-white/10 font-bold text-zinc-300 hover:bg-zinc-800 transition-all">
                  <Plus className="h-5 w-5" />
                  Upload Resume
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("file", file);
                      try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/resume/parse`, {
                          method: 'POST',
                          body: formData
                        });
                        const data = await res.json();
                        alert(`Resume parsed! Found ${data.skills?.length || 0} skills.`);
                        console.log("Parsed Data:", data);
                      } catch (err) {
                        console.error("Upload failed", err);
                      }
                    }}
                  />
                </label>
                <Link href="/roadmap" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-white hover:bg-primary/90 transition-all">
                  <Plus className="h-5 w-5" />
                  New Roadmap
                </Link>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { label: "Completion Rate", value: "38%", icon: Clock },
                { label: "Questions Answered", value: "152", icon: FileText },
                { label: "Readiness Score", value: "72", icon: BarChart3 },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Active Preparations */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Active Preparations</h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {interviews.map((interview, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${interview.color}/20 text-white font-bold text-xl`}>
                          {interview.company[0]}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{interview.company}</h3>
                          <p className="text-sm text-zinc-400">{interview.role}</p>
                        </div>
                      </div>
                      <div className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400">
                        {interview.status}
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Progress</span>
                        <span className="font-bold text-white">{interview.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${interview.progress}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className={`h-full rounded-full ${interview.color}`}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Calendar className="h-3 w-3" />
                        {interview.date}
                      </div>
                      <Link href="/roadmap" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                        Resume Preparation
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
