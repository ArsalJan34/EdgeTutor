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

      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3">
          <svg width="16" height="20" viewBox="0 0 20 24" fill="none">
            <path d="M10 0C10 0 15 6 15 11C15 13.76 13.21 16.08 10.7 16.79C11.13 15.95 11.38 15 11.38 14C11.38 11.5 9.5 9.5 7.5 8C7.5 8 8 11 6.5 13C5.5 14.5 4 15.5 4 17.5C4 20.54 6.69 23 10 23C13.31 23 16 20.54 16 17.5C16 14.83 14.09 12.62 11.5 12C12.2 10.67 12.5 9.17 12.5 7.5C12.5 4.81 11.09 2.5 10 0Z" fill="url(#fg5)"/>
            <defs><linearGradient id="fg5" x1="10" y1="0" x2="10" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#f5a55a"/><stop offset="1" stopColor="#c4622a"/></linearGradient></defs>
          </svg>
          <span className="text-[14px] font-bold tracking-[0.12em] uppercase text-[#f0ede8]" style={{fontFamily:"var(--font-geist-mono)"}}>EdgeTutor</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/quiz" className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#6b6560] hover:text-[#f0ede8] transition-colors px-3 py-1.5 border border-white/[0.07] hover:border-white/20 rounded-sm">Quiz</Link>
          <Link href="/chat" className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#6b6560] hover:text-[#f0ede8] transition-colors px-3 py-1.5 border border-white/[0.07] hover:border-white/20 rounded-sm">Chat</Link>
        </div>
      </nav>

      <div className="relative z-10 flex-1 px-5 sm:px-8 lg:px-14 py-10 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#e8844a] mb-3">Phase 3</p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#f0ede8] mb-2">Your Progress</h1>
          <p className="text-[#6b6560] text-sm">Track your quiz history, topic mastery, and adaptive difficulty.</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center min-h-[40vh] gap-2">
            <span className="w-2 h-2 bg-[#e8844a] rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 bg-[#e8844a] rounded-full animate-bounce [animation-delay:120ms]" />
            <span className="w-2 h-2 bg-[#e8844a] rounded-full animate-bounce [animation-delay:240ms]" />
          </div>
        )}

        {error && <div className="px-4 py-3 rounded-sm text-sm border border-red-500/20 bg-red-500/5 text-red-400">{error}</div>}

        {data && !loading && (
          <div className="flex flex-col gap-8">
            {data.total_quizzes === 0 ? (
              <div className="bg-[#141414] border border-white/[0.06] rounded-sm p-10 text-center">
                <p className="text-[#6b6560] text-sm mb-4">No quizzes taken yet.</p>
                <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8844a] text-[#0c0c0c] font-bold text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[#f09558] transition-colors">
                  Take Your First Quiz
                </Link>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
                  {[
                    { label: "Quizzes Taken", value: String(data.total_quizzes), isText: false },
                    { label: "Average Score", value: `${data.average_score}%`, isText: false },
                    { label: "Best Score", value: `${data.best_score}%`, isText: false },
                    { label: "Current Level", value: data.current_difficulty, isText: true },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#0c0c0c] p-6 flex flex-col gap-2">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#3a3530]">{s.label}</p>
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
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#3a3530] mb-4">Topic Mastery — weakest first</p>
                    <div className="flex flex-col gap-3">
                      {data.topics.map((t) => (
                        <div key={t.topic} className="bg-[#141414] border border-white/[0.06] rounded-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-[#f0ede8] text-sm font-medium capitalize">{t.topic}</span>
                              <span className="text-[10px] text-[#3a3530]">{t.attempts} attempt{t.attempts !== 1 ? "s" : ""}</span>
                            </div>
                            <span className="text-sm font-bold" style={{color: scoreColor(t.average)}}>{t.average}%</span>
                          </div>
                          <div className="h-1 bg-[#1c1c1c] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{width:`${t.average}%`, background: scoreColor(t.average)}} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent attempts */}
                {data.recent_attempts.length > 0 && (
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#3a3530] mb-4">Recent Attempts</p>
                    <div className="flex flex-col gap-2">
                      {data.recent_attempts.map((a) => (
                        <div key={a.id} className="bg-[#141414] border border-white/[0.06] rounded-sm px-4 py-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-[#f0ede8] text-sm font-medium capitalize truncate">{a.topic}</span>
                            <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border"
                              style={{ color: difficultyColor[a.difficulty] || "#e8844a", borderColor: `${difficultyColor[a.difficulty]}40` }}>
                              {a.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-xs text-[#3a3530]">{a.score}/{a.total}</span>
                            <span className="text-sm font-bold w-12 text-right" style={{color: scoreColor(a.percentage)}}>{a.percentage}%</span>
                            <span className="text-[10px] text-[#2a2520] hidden sm:block">{new Date(a.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/quiz"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-sm font-bold text-xs tracking-[0.15em] uppercase bg-[#e8844a] hover:bg-[#f09558] text-[#0c0c0c] transition-colors">
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
