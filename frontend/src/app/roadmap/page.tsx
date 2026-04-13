"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Bot, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Sparkles, 
  Upload, 
  Loader2 
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function RoadmapGenerator() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jd, setJd] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeParsed, setResumeParsed] = useState(false);

  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null);

  const handleExportPDF = () => {
    if (!generatedRoadmap) return;

    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [99, 102, 241]; // Indigo-500

    // Header
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("PrepAI - Interview Roadmap", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.line(14, 32, 196, 32);

    let yPos = 40;

    const addSection = (title: string, data: string[]) => {
      doc.setFontSize(16);
      doc.setTextColor(50);
      doc.text(title, 14, yPos);
      yPos += 5;

      autoTable(doc, {
        startY: yPos,
        head: [[ "Task / Objective" ]],
        body: data.map(item => [item]),
        theme: 'striped',
        headStyles: { fillColor: primaryColor as [number, number, number] },
        margin: { left: 14, right: 14 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    };

    if (generatedRoadmap.technical_pillar) {
      addSection("Technical Pillar", generatedRoadmap.technical_pillar);
    }
    if (generatedRoadmap.behavioral_pillar) {
      addSection("Behavioral Pillar", generatedRoadmap.behavioral_pillar);
    }
    if (generatedRoadmap.company_research) {
      addSection("Company Research", generatedRoadmap.company_research);
    }

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: "right" });
    }

    doc.save("PrepAI_Interview_Roadmap.pdf");
  };

  const handleNext = async () => {
    if (step < 2) setStep(step + 1);
    else {
      setIsGenerating(true);
      try {
        const formData = new FormData();
        formData.append("jd_text", jd);
        if (resumeFile) {
          formData.append("resume_file", resumeFile);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/generate-roadmap`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        console.log("Generated Roadmap:", data);
        setGeneratedRoadmap(data);
        setStep(3);
      } catch (err) {
        console.error("Roadmap generation failed", err);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const [researchData, setResearchData] = useState<any>(null);
  const [isResearching, setIsResearching] = useState(false);

  const performResearch = async (url: string) => {
    setIsResearching(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_url: url })
      });
      const data = await res.json();
      setResearchData(data);
    } catch (err) {
      console.error("Research failed", err);
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Multi-step Header */}
        <div className="mb-12 flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all ${
                step >= s ? "border-primary bg-primary text-white" : "border-white/10 text-zinc-600"
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`h-px w-12 sm:w-24 ${step > s ? "bg-primary" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-auto max-w-3xl space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Paste Job Description</h1>
                <p className="text-zinc-500 mt-2">Our AI will extract key skills and requirements from the JD.</p>
              </div>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full min-h-[300px] rounded-2xl bg-white/5 border border-white/10 p-6 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              <button
                onClick={handleNext}
                disabled={!jd}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                Next Step
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-auto max-w-3xl space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Upload Your Resume</h1>
                <p className="text-zinc-500 mt-2">We'll cross-reference your experience with the job requirements.</p>
              </div>
              <div className="flex items-center justify-center">
                <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-12 transition-all hover:border-primary/50 hover:bg-white/[0.07]">
                  <Upload className={`h-12 w-12 ${resumeFile ? "text-green-500" : "text-primary"} mb-4`} />
                  <span className="text-lg font-medium text-white">
                    {resumeFile ? resumeFile.name : "Click to upload or drag and drop"}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB` : "PDF, DOCX (Max 10MB)"}
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setResumeFile(file);
                    }}
                  />
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-4 font-bold text-white hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-[2] flex gap-2 items-center justify-center rounded-xl bg-primary py-4 font-bold text-white hover:bg-primary/90 transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Roadmap...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Roadmap
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-5xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Your Interview Roadmap</h1>
                  <p className="text-zinc-500">Personalized preparation plan for Google - SDE Intern</p>
                </div>
                <button 
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-all"
                >
                  <FileText className="h-4 w-4" />
                  Export PDF
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Technical Pillar */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <h2 className="text-lg font-bold">Technical Pillar</h2>
                  </div>
                  {(generatedRoadmap?.technical_pillar || [
                    "Practice Tree and Graph algorithms",
                    "Review Virtual DOM and React Reconciliation",
                    "Understand System Design for scalable apps",
                  ]).map((task: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10">
                      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/10 bg-black text-primary focus:ring-primary" />
                      <span className="text-sm text-zinc-300">{task}</span>
                    </div>
                  ))}
                </div>

                {/* Behavioral Pillar */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <h2 className="text-lg font-bold">Behavioral Pillar</h2>
                  </div>
                  {(generatedRoadmap?.behavioral_pillar || [
                    "STAR story for 'Handling Conflict'",
                    "Prepare 'Why this company?' response",
                    "Review common leadership stories",
                  ]).map((task: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10">
                      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/10 bg-black text-primary focus:ring-primary" />
                      <span className="text-sm text-zinc-300">{task}</span>
                    </div>
                  ))}
                </div>

                {/* Company Pillar */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-orange-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <h2 className="text-lg font-bold">Company Research</h2>
                  </div>
                  {(generatedRoadmap?.company_research || [
                    "Read about Google's recent AI initiatives",
                    "Review 'Don't be evil' legacy and culture",
                    "Check recent stock performance and news",
                  ]).map((task: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10">
                      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/10 bg-black text-primary focus:ring-primary" />
                      <span className="text-sm text-zinc-300">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <Link
                  href="/interview"
                  className="flex items-center gap-2 rounded-full bg-primary px-12 py-4 text-lg font-bold text-white hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all"
                >
                  <Bot className="h-6 w-6" />
                  Enter Mock Interview Room
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
