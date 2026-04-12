"use client";

import { 
  useAuth,
  useUser,
  SignInButton, 
  UserButton 
} from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const handleMouseEnter = (href: string) => {
    if (href.startsWith("/")) {
      router.prefetch(href);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="flex items-center gap-2"
          onMouseEnter={() => handleMouseEnter("/")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PrepAI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <Link 
            href="#features" 
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            How it Works
          </Link>
          
          {isLoaded && isSignedIn ? (
            <>
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : isLoaded ? (
            <SignInButton mode="modal">
              <button className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="space-y-1 px-4 pb-6 pt-4">
            <Link href="#features" className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
              Features
            </Link>
            <Link href="#how-it-works" className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
              How it Works
            </Link>
            
            {isLoaded && isSignedIn ? (
              <>
                <Link href="/dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
                  Dashboard
                </Link>
                <div className="px-3 py-4 border-t border-white/5 mt-2">
                  <UserButton afterSignOutUrl="/" showName />
                </div>
              </>
            ) : isLoaded ? (
              <SignInButton mode="modal">
                <button className="w-full mt-4 rounded-xl bg-primary px-3 py-3 text-base font-bold text-white shadow-lg shadow-primary/20">
                  Sign In
                </button>
              </SignInButton>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
