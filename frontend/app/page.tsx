"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight font-mono text-emerald-400">EdgeTutor</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
          Your AI-Powered
          <span className="block bg-gradient-to-r from-red-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
            Study Assistant
          </span>
        </h1>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          Upload your notes and textbooks. Ask anything. Get instant, context-aware answers powered by AI.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <Link href="/upload" className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-emerald-500/10 hover:border-emarald-500/40 transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <h2 className="text-white font-bold text-lg mb-1">Upload PDF</h2>
            <p className="text-gray-400 text-sm">Upload lecture notes, textbooks, or any study material.</p>
            <div className="mt-4 text-emarald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Get started <span>→</span>
            </div>
          </Link>

          <Link href="/chat" className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-teal-500/10 hover:border-teal-500/40 transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500/30 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h2 className="text-white font-bold text-lg mb-1">Ask AI Tutor</h2>
            <p className="text-gray-400 text-sm">Ask questions and get intelligent answers from your documents.</p>
            <div className="mt-4 text-violet-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Start chatting <span>→</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
