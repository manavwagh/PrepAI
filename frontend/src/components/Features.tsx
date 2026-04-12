"use client";

import { motion } from "framer-motion";
import { ClipboardList, Map, Video } from "lucide-react";

const steps = [
  {
    title: "Upload JD & Resume",
    description: "Provide the job description and your resume. Our AI analyzes the gap between your skills and the role requirements.",
    icon: ClipboardList,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Get a Personalized Roadmap",
    description: "Receive a dynamic checklist of technical topics, behavioral questions, and company-specific research tasks.",
    icon: Map,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Practice with AI",
    description: "Enter our distraction-free mock interview room and practice with an AI interviewer that provides real-time feedback.",
    icon: Video,
    color: "bg-purple-500/10 text-purple-500",
  },
];

export default function Features() {
  return (
    <section id="how-it-works" className="bg-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-base font-semibold uppercase tracking-wider text-primary">How it Works</h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Three Steps to Interview Confidence
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            Our platform simplifies your preparation process by focusing on what matters most for your specific role.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/[0.07]"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${step.color} mb-6`}>
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-4 text-zinc-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
