"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#f0ede8] flex flex-col relative overflow-hidden">

      {/* Ember glow */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none"
        style={{background: "radial-gradient(ellipse at 0% 100%, rgba(232,132,74,0.08) 0%, transparent 60%)"}} />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{background: "radial-gradient(ellipse at 100% 0%, rgba(232,132,74,0.04) 0%, transparent 60%)"}} />

      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path d="M10 0C10 0 15 6 15 11C15 13.76 13.21 16.08 10.7 16.79C11.13 15.95 11.38 15 11.38 14C11.38 11.5 9.5 9.5 7.5 8C7.5 8 8 11 6.5 13C5.5 14.5 4 15.5 4 17.5C4 20.54 6.69 23 10 23C13.31 23 16 20.54 16 17.5C16 14.83 14.09 12.62 11.5 12C12.2 10.67 12.5 9.17 12.5 7.5C12.5 4.81 11.09 2.5 10 0Z" fill="url(#flameGrad)" />
              <defs>
                <linearGradient id="flameGrad" x1="10" y1="0" x2="10" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f5a55a"/><stop offset="1" stopColor="#c4622a"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-[15px] font-bold tracking-[0.12em] uppercase text-[#f0ede8]"
            style={{fontFamily: "var(--font-geist-mono)"}}>
            EdgeTutor
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/upload"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-[#a39d97] hover:text-[#f0ede8] transition-colors duration-200 px-4 py-2 border border-white/[0.08] hover:border-white/20 rounded-sm">
            Upload
          </Link>
          <Link href="/chat"
            className="flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase bg-[#e8844a] hover:bg-[#f09558] text-[#0c0c0c] transition-colors duration-200 px-4 py-2 rounded-sm">
            Chat
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-start justify-center flex-1 px-6 sm:px-10 lg:px-16 pt-16 pb-12 max-w-6xl w-full mx-auto">
        <div className="mb-6">
          <span className="inline-block text-[10px] font-medium tracking-[0.25em] uppercase text-[#e8844a] border border-[#e8844a]/30 px-3 py-1.5 rounded-sm">
            AI-Powered Learning
          </span>
        </div>
        <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-[0.92] tracking-[-0.03em] text-[#f0ede8] mb-6 uppercase max-w-4xl">
          Study Smarter.<br />
          <span style={{color: "#e8844a"}}>Ask Anything.</span>
        </h1>
        <p className="text-[#6b6560] text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-light">
          Upload your notes and textbooks. EdgeTutor reads every page and gives you instant, context-aware answers like having a tutor who has read your entire syllabus.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/upload"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#e8844a] hover:bg-[#f09558] text-[#0c0c0c] font-bold text-sm tracking-[0.12em] uppercase transition-all duration-200 rounded-sm w-full sm:w-auto">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload PDF
          </Link>
          <Link href="/chat"
            className="flex items-center justify-center gap-2 px-8 py-4 border border-white/[0.12] hover:border-[#e8844a]/40 text-[#a39d97] hover:text-[#f0ede8] font-medium text-sm tracking-[0.12em] uppercase transition-all duration-200 rounded-sm w-full sm:w-auto">
            Ask AI Tutor
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="relative z-10 border-t border-white/[0.06] px-6 sm:px-10 lg:px-16 py-12 max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06]">
          {[
            { num: "01", label: "Upload", title: "Any PDF Document", desc: "Lecture notes, textbooks, past papers EdgeTutor indexes everything instantly.", href: "/upload" },
            { num: "02", label: "Ask", title: "Natural Questions", desc: "Type exactly what you want to know. No rigid search queries required.", href: "/chat" },
            { num: "03", label: "Learn", title: "In Context", desc: "Get answers grounded in your own material, not generic web results.", href: "/chat" },
          ].map((f) => (
            <Link key={f.num} href={f.href}
              className="group bg-[#0c0c0c] hover:bg-[#141414] transition-colors duration-300 p-7 sm:p-8 flex flex-col gap-5 cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-medium tracking-[0.2em] text-[#e8844a]"
                  style={{fontFamily: "var(--font-geist-mono)"}}>{f.num}</span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#3a3530]">{f.label}</span>
              </div>
              <div>
                <h3 className="text-[#f0ede8] font-bold text-lg mb-2 tracking-tight group-hover:text-white transition-colors">{f.title}</h3>
                <p className="text-[#6b6560] text-sm leading-relaxed">{f.desc}</p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-xs text-[#3a3530] group-hover:text-[#e8844a] transition-colors duration-200">
                <span className="tracking-[0.1em] uppercase font-medium">Explore</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-[11px] text-[#3a3530] tracking-[0.15em] uppercase font-medium">EdgeTutor</span>
        <span className="text-[11px] text-[#2a2520]">RAG-powered document intelligence</span>
      </footer>
    </main>
  );
}
