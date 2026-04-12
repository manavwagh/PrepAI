import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <HeroSection />
        <Features />
      </main>
      <footer className="border-t border-white/10 bg-black py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-zinc-500 text-sm">
            © 2026 PrepAI. Built for candidates at VIT and beyond.
          </p>
        </div>
      </footer>
    </div>
  );
}
