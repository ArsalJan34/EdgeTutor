"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#f0ede8] flex flex-col relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute bottom-0 left-0 w-[700px] h-[500px] pointer-events-none"
        style={{background: "radial-gradient(ellipse at 0% 100%, rgba(232,132,74,0.10) 0%, transparent 60%)"}} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{background: "radial-gradient(ellipse at 100% 0%, rgba(232,132,74,0.05) 0%, transparent 60%)"}} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{background: "radial-gradient(ellipse at 50% 50%, rgba(232,132,74,0.02) 0%, transparent 70%)"}} />

      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/[0.06] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 blur-md opacity-60" style={{background: "rgba(232,132,74,0.4)"}} />
            <svg className="relative" width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path d="M10 0C10 0 15 6 15 11C15 13.76 13.21 16.08 10.7 16.79C11.13 15.95 11.38 15 11.38 14C11.38 11.5 9.5 9.5 7.5 8C7.5 8 8 11 6.5 13C5.5 14.5 4 15.5 4 17.5C4 20.54 6.69 23 10 23C13.31 23 16 20.54 16 17.5C16 14.83 14.09 12.62 11.5 12C12.2 10.67 12.5 9.17 12.5 7.5C12.5 4.81 11.09 2.5 10 0Z" fill="url(#flameGrad)"/>
              <defs><linearGradient id="flameGrad" x1="10" y1="0" x2="10" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#f5a55a"/><stop offset="1" stopColor="#c4622a"/></linearGradient></defs>
            </svg>
          </div>
          <span className="text-[15px] font-bold tracking-[0.12em] uppercase text-[#f0ede8]" style={{fontFamily:"var(--font-geist-mono)"}}>EdgeTutor</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/upload" className="hidden sm:flex text-xs font-medium tracking-widest uppercase text-[#6b6560] hover:text-[#f0ede8] transition-all duration-200 px-4 py-2 border border-white/[0.08] hover:border-white/20 rounded-sm hover:bg-white/[0.03]">Upload</Link>
          <Link href="/progress" className="hidden sm:flex text-xs font-medium tracking-widest uppercase text-[#6b6560] hover:text-[#f0ede8] transition-all duration-200 px-4 py-2 border border-white/[0.08] hover:border-white/20 rounded-sm hover:bg-white/[0.03]">Progress</Link>
          <Link href="/chat" className="flex text-xs font-medium tracking-widest uppercase bg-[#e8844a] hover:bg-[#f09558] text-[#0c0c0c] transition-all duration-200 px-5 py-2 rounded-sm shadow-lg shadow-orange-900/20">Chat</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-start flex-1 px-6 sm:px-10 lg:px-16 pt-20 pb-14 max-w-6xl w-full mx-auto">
        <div className="mb-7">
          <span className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.25em] uppercase text-[#e8844a] border border-[#e8844a]/25 bg-[#e8844a]/5 px-3 py-1.5 rounded-sm">
            <span className="w-1 h-1 rounded-full bg-[#e8844a] animate-pulse" />
            AI-Powered Learning
          </span>
        </div>
        <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-[0.92] tracking-[-0.03em] text-[#f0ede8] mb-7 uppercase max-w-4xl">
          Study Smarter.<br />
          <span className="relative inline-block" style={{color:"#e8844a"}}>
            Ask Anything.
            <span className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-[#e8844a]/60 to-transparent" />
          </span>
        </h1>
        <p className="text-[#6b6560] text-base sm:text-lg max-w-xl mb-12 leading-relaxed font-light">
          Upload your notes and textbooks. EdgeTutor reads every page and gives you instant, context aware answers like having a tutor who has read your entire syllabus.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/upload" className="group flex items-center justify-center gap-2.5 px-8 py-4 bg-[#e8844a] hover:bg-[#f09558] text-[#0c0c0c] font-bold text-sm tracking-[0.12em] uppercase transition-all duration-200 rounded-sm w-full sm:w-auto shadow-xl shadow-orange-900/25 hover:shadow-orange-900/40">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 transition-transform">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload PDF
          </Link>
          <Link href="/chat" className="group flex items-center justify-center gap-2.5 px-8 py-4 border border-white/[0.10] hover:border-[#e8844a]/40 bg-white/[0.02] hover:bg-white/[0.04] text-[#a39d97] hover:text-[#f0ede8] font-medium text-sm tracking-[0.12em] uppercase transition-all duration-200 rounded-sm w-full sm:w-auto">
            Ask AI Tutor
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        {/* Subtle stat strip */}
        <div className="flex items-center gap-8 mt-14 pt-8 border-t border-white/[0.05]">
          {[["RAG-Powered","Document AI"], ["Adaptive","Quiz Engine"], ["Socratic","Learning Mode"]].map(([top, bot]) => (
            <div key={top} className="hidden sm:block">
              <p className="text-[11px] font-bold text-[#f0ede8] tracking-wide">{top}</p>
              <p className="text-[10px] text-[#7a7570] tracking-widest uppercase">{bot}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5 CARDS */}
      <section className="relative z-10 border-t border-white/[0.06] px-6 sm:px-10 lg:px-16 py-0 max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.05]">
          {[
            { num:"01", label:"Upload",   title:"Any PDF",        desc:"Lecture notes, textbooks, past papers — indexed instantly.",          href:"/upload"    },
            { num:"02", label:"Tutor",    title:"Direct Answers", desc:"Ask questions, get clear answers from your material.",                 href:"/chat"      },
            { num:"03", label:"Socratic", title:"Guided Mode",    desc:"AI asks you questions to guide you to the answer.",                   href:"/chat"      },
            { num:"04", label:"Quiz",     title:"Test Yourself",  desc:"Auto-generate MCQ quizzes with adaptive difficulty.",                 href:"/quiz"      },
            { num:"05", label:"Progress", title:"Track Mastery",  desc:"See your scores, weak topics, and current difficulty level.",         href:"/progress"  },
          ].map((f) => (
            <Link key={f.num} href={f.href}
              className="group relative bg-[#0c0c0c] hover:bg-[#111111] transition-all duration-300 p-6 sm:p-7 flex flex-col gap-5 overflow-hidden">
              {/* hover accent line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#e8844a]/0 via-[#e8844a]/60 to-[#e8844a]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#e8844a]" style={{fontFamily:"var(--font-geist-mono)"}}>{f.num}</span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#6b6560]">{f.label}</span>
              </div>
              <div>
                <h3 className="text-[#f0ede8] font-bold text-[15px] mb-2 group-hover:text-white transition-colors">{f.title}</h3>
                <p className="text-[#8a8580] text-xs leading-relaxed group-hover:text-[#6b6560] transition-colors">{f.desc}</p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-[10px] text-[#6b6560] group-hover:text-[#e8844a] transition-colors duration-200">
                <span className="tracking-[0.12em] uppercase font-semibold">Open</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.05] px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-[11px] text-[#7a7570] tracking-[0.15em] uppercase font-medium">EdgeTutor</span>
        <span className="text-[11px] text-[#6b6560]">RAG powered document intelligence</span>
      </footer>
    </main>
  );
}
