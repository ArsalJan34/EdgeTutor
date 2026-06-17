"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface TopicStat { topic: string; attempts: number; average: number; }
interface Attempt { id: number; topic: string; score: number; total: number; percentage: number; difficulty: string; created_at: string; }
interface Summary { total_quizzes: number; average_score: number; best_score: number; current_difficulty: string; topics: TopicStat[]; recent_attempts: Attempt[]; }

const difficultyColor: Record<string, string> = { easy: "#4ade80", medium: "#e8844a", hard: "#ef4444" };
const scoreColor = (pct: number) => pct >= 70 ? "#e8844a" : pct >= 40 ? "#f5c842" : "#ef4444";

export default function ProgressPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/progress/summary")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Cannot connect to backend."); setLoading(false); });
  }, []);

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#f0ede8] flex flex-col relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{background: "radial-gradient(ellipse at 0% 100%, rgba(232,132,74,0.07) 0%, transparent 60%)"}} />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none"
        style={{background: "radial-gradient(ellipse at 100% 0%, rgba(232,132,74,0.03) 0%, transparent 60%)"}} />

      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.06] backdrop-blur-sm bg-[#0c0c0c]/80">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 blur-sm opacity-50 group-hover:opacity-80 transition-opacity" style={{background:"rgba(232,132,74,0.5)"}} />
            <svg className="relative" width="16" height="20" viewBox="0 0 20 24" fill="none">
              <path d="M10 0C10 0 15 6 15 11C15 13.76 13.21 16.08 10.7 16.79C11.13 15.95 11.38 15 11.38 14C11.38 11.5 9.5 9.5 7.5 8C7.5 8 8 11 6.5 13C5.5 14.5 4 15.5 4 17.5C4 20.54 6.69 23 10 23C13.31 23 16 20.54 16 17.5C16 14.83 14.09 12.62 11.5 12C12.2 10.67 12.5 9.17 12.5 7.5C12.5 4.81 11.09 2.5 10 0Z" fill="url(#fg5)"/>
              <defs><linearGradient id="fg5" x1="10" y1="0" x2="10" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#f5a55a"/><stop offset="1" stopColor="#c4622a"/></linearGradient></defs>
            </svg>
          </div>
          <span className="text-[14px] font-bold tracking-[0.12em] uppercase text-[#f0ede8] group-hover:text-white transition-colors" style={{fontFamily:"var(--font-geist-mono)"}}>EdgeTutor</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/quiz" className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#6b6560] hover:text-[#f0ede8] transition-all duration-200 px-3 py-1.5 border border-white/[0.07] hover:border-white/20 rounded-sm hover:bg-white/[0.03]">Quiz</Link>
          <Link href="/chat" className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#6b6560] hover:text-[#f0ede8] transition-all duration-200 px-3 py-1.5 border border-white/[0.07] hover:border-white/20 rounded-sm hover:bg-white/[0.03]">Chat</Link>
        </div>
      </nav>

      <div className="relative z-10 flex-1 px-5 sm:px-8 lg:px-14 py-10 max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#e8844a] mb-3" style={{fontFamily:"var(--font-geist-mono)"}}>Phase 3</p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#f0ede8] mb-2">Your Progress</h1>
          <p className="text-[#8a8580] text-sm">Track your quiz history, topic mastery, and adaptive difficulty.</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-5">
            <div className="w-10 h-10 border border-[#e8844a]/20 rounded-sm flex items-center justify-center">
              <svg width="16" height="20" viewBox="0 0 20 24" fill="none" className="animate-pulse">
                <path d="M10 0C10 0 15 6 15 11C15 13.76 13.21 16.08 10.7 16.79C11.13 15.95 11.38 15 11.38 14C11.38 11.5 9.5 9.5 7.5 8C7.5 8 8 11 6.5 13C5.5 14.5 4 15.5 4 17.5C4 20.54 6.69 23 10 23C13.31 23 16 20.54 16 17.5C16 14.83 14.09 12.62 11.5 12C12.2 10.67 12.5 9.17 12.5 7.5C12.5 4.81 11.09 2.5 10 0Z" fill="#e8844a"/>
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#e8844a] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-[#e8844a]/70 rounded-full animate-bounce [animation-delay:120ms]" />
              <span className="w-2 h-2 bg-[#e8844a]/40 rounded-full animate-bounce [animation-delay:240ms]" />
            </div>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-sm text-sm border border-red-500/20 bg-red-500/5 text-red-400 flex items-center gap-2">
            <span className="text-xs">✕</span>{error}
          </div>
        )}

        {data && !loading && (
          <div className="flex flex-col gap-8">
            {data.total_quizzes === 0 ? (
              <div className="bg-[#0e0e0e] border border-white/[0.06] rounded-sm p-12 text-center">
                <div className="w-12 h-12 border border-white/[0.08] rounded-sm flex items-center justify-center mx-auto mb-5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a7570" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
                <p className="text-[#8a8580] text-sm mb-5">No quizzes taken yet.</p>
                <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8844a] text-[#0c0c0c] font-bold text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[#f09558] transition-all duration-200 shadow-lg shadow-orange-900/25">
                  Take Your First Quiz
                </Link>
              </div>
            ) : (
              <>
                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05]">
                  {[
                    { label: "Quizzes Taken", value: String(data.total_quizzes), isText: false },
                    { label: "Average Score", value: `${data.average_score}%`, isText: false },
                    { label: "Best Score", value: `${data.best_score}%`, isText: false },
                    { label: "Current Level", value: data.current_difficulty, isText: true },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#0c0c0c] p-6 flex flex-col gap-2 relative overflow-hidden group hover:bg-[#0e0e0e] transition-colors duration-200">
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#e8844a]/0 via-[#e8844a]/20 to-[#e8844a]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#6b6560]" style={{fontFamily:"var(--font-geist-mono)"}}>{s.label}</p>
                      <p className="text-3xl font-black tracking-tight"
                        style={{color: s.isText ? (difficultyColor[s.value] || "#e8844a") : "#f0ede8"}}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Topic mastery */}
                {data.topics.length > 0 && (
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#6b6560] mb-4" style={{fontFamily:"var(--font-geist-mono)"}}>Topic Mastery — weakest first</p>
                    <div className="flex flex-col gap-2">
                      {data.topics.map((t) => (
                        <div key={t.topic} className="bg-[#0e0e0e] border border-white/[0.05] rounded-sm p-4 hover:border-white/[0.09] transition-colors duration-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[#f0ede8] text-sm font-medium capitalize">{t.topic}</span>
                              <span className="text-[10px] text-[#6b6560]" style={{fontFamily:"var(--font-geist-mono)"}}>{t.attempts} attempt{t.attempts !== 1 ? "s" : ""}</span>
                            </div>
                            <span className="text-sm font-bold" style={{color: scoreColor(t.average)}}>{t.average}%</span>
                          </div>
                          <div className="h-0.5 bg-[#181818] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{width:`${t.average}%`, background: `linear-gradient(90deg, ${scoreColor(t.average)}80, ${scoreColor(t.average)})`}} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent attempts */}
                {data.recent_attempts.length > 0 && (
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#6b6560] mb-4" style={{fontFamily:"var(--font-geist-mono)"}}>Recent Attempts</p>
                    <div className="flex flex-col gap-1.5">
                      {data.recent_attempts.map((a) => (
                        <div key={a.id} className="bg-[#0e0e0e] border border-white/[0.05] rounded-sm px-4 py-3.5 flex items-center justify-between gap-4 hover:border-white/[0.09] transition-colors duration-200">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-[#f0ede8] text-sm font-medium capitalize truncate">{a.topic}</span>
                            <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border"
                              style={{ color: difficultyColor[a.difficulty] || "#e8844a", borderColor: `${difficultyColor[a.difficulty]}30`, background: `${difficultyColor[a.difficulty]}08` }}>
                              {a.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-xs text-[#7a7570]" style={{fontFamily:"var(--font-geist-mono)"}}>{a.score}/{a.total}</span>
                            <span className="text-sm font-bold w-12 text-right" style={{color: scoreColor(a.percentage)}}>{a.percentage}%</span>
                            <span className="text-[10px] text-[#6b6560] hidden sm:block">{new Date(a.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/quiz"
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-sm font-bold text-xs tracking-[0.15em] uppercase bg-[#e8844a] hover:bg-[#f09558] text-[#0c0c0c] transition-all duration-200 shadow-lg shadow-orange-900/20">
                  Take Another Quiz
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
