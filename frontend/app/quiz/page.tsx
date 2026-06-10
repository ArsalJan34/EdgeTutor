"use client";
import { useState } from "react";
import Link from "next/link";

interface Option { A: string; B: string; C: string; D: string; }
interface Question { question: string; options: Option; answer: string; explanation: string; }
interface ScoreResult { question: string; options: Option; correct: boolean; selected: string; correct_answer: string; explanation: string; }
interface ScoreResponse { score: number; total: number; percentage: number; difficulty: string; next_difficulty: string; results: ScoreResult[]; }

type Stage = "setup" | "loading" | "quiz" | "submitting" | "results";
type Difficulty = "easy" | "medium" | "hard";

const difficultyColor: Record<string, string> = { easy: "#4ade80", medium: "#e8844a", hard: "#ef4444" };
const optionLabels: (keyof Option)[] = ["A", "B", "C", "D"];

export default function QuizPage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scoreData, setScoreData] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState("");

  const generateQuiz = async () => {
    if (!topic.trim()) return;
    setStage("loading"); setError("");
    try {
      const res = await fetch(`http://127.0.0.1:8000/quiz/generate?topic=${encodeURIComponent(topic)}&num_questions=${numQuestions}&difficulty=${difficulty}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to generate quiz");
      setQuestions(data.questions); setAnswers({}); setStage("quiz");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStage("setup");
    }
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) { setError("Please answer all questions before submitting."); return; }
    setError(""); setStage("submitting");
    try {
      const res = await fetch("http://127.0.0.1:8000/quiz/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers: questions.map((_, i) => answers[i]), topic, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Scoring failed");
      setScoreData(data); setStage("results");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStage("quiz");
    }
  };

  const reset = () => { setStage("setup"); setTopic(""); setQuestions([]); setAnswers({}); setScoreData(null); setError(""); };
  const answeredCount = Object.keys(answers).length;

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#f0ede8] flex flex-col relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{background: "radial-gradient(ellipse at 0% 100%, rgba(232,132,74,0.07) 0%, transparent 60%)"}} />

      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3">
          <svg width="16" height="20" viewBox="0 0 20 24" fill="none">
            <path d="M10 0C10 0 15 6 15 11C15 13.76 13.21 16.08 10.7 16.79C11.13 15.95 11.38 15 11.38 14C11.38 11.5 9.5 9.5 7.5 8C7.5 8 8 11 6.5 13C5.5 14.5 4 15.5 4 17.5C4 20.54 6.69 23 10 23C13.31 23 16 20.54 16 17.5C16 14.83 14.09 12.62 11.5 12C12.2 10.67 12.5 9.17 12.5 7.5C12.5 4.81 11.09 2.5 10 0Z" fill="url(#fg4)"/>
            <defs><linearGradient id="fg4" x1="10" y1="0" x2="10" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#f5a55a"/><stop offset="1" stopColor="#c4622a"/></linearGradient></defs>
          </svg>
          <span className="text-[14px] font-bold tracking-[0.12em] uppercase text-[#f0ede8]" style={{fontFamily:"var(--font-geist-mono)"}}>EdgeTutor</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/progress" className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#6b6560] hover:text-[#f0ede8] transition-colors px-3 py-1.5 border border-white/[0.07] hover:border-white/20 rounded-sm">Progress</Link>
          <Link href="/chat" className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#6b6560] hover:text-[#f0ede8] transition-colors px-3 py-1.5 border border-white/[0.07] hover:border-white/20 rounded-sm">Chat</Link>
        </div>
      </nav>

      <div className="relative z-10 flex-1 px-5 sm:px-8 lg:px-14 py-10 max-w-3xl mx-auto w-full">

        {/* SETUP */}
        {stage === "setup" && (
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#e8844a] mb-3">Phase 2 · Quiz Engine</p>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#f0ede8] mb-2">Quiz Generator</h1>
              <p className="text-[#6b6560] text-sm leading-relaxed">Enter a topic from your uploaded document. EdgeTutor auto-generates an MCQ quiz at your chosen difficulty.</p>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#3a3530] mb-2">Topic</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generateQuiz()}
                  placeholder="e.g. grammar, tenses, verbs..."
                  className="w-full bg-[#141414] border border-white/[0.08] focus:border-[#e8844a]/40 rounded-sm px-4 py-3 text-sm text-[#f0ede8] placeholder-[#3a3530] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#3a3530] mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {(["easy","medium","hard"] as Difficulty[]).map((d) => (
                    <button key={d} onClick={() => setDifficulty(d)}
                      className="flex-1 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-200 border"
                      style={{
                        borderColor: difficulty === d ? difficultyColor[d] : "rgba(255,255,255,0.08)",
                        background: difficulty === d ? `${difficultyColor[d]}18` : "transparent",
                        color: difficulty === d ? difficultyColor[d] : "#6b6560",
                      }}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#3a3530] mb-2">Number of Questions</label>
                <div className="flex gap-2">
                  {[3,5,10].map((n) => (
                    <button key={n} onClick={() => setNumQuestions(n)}
                      className={`px-5 py-2 rounded-sm text-sm font-bold transition-colors duration-200 border ${
                        numQuestions === n ? "bg-[#e8844a] border-[#e8844a] text-[#0c0c0c]" : "border-white/[0.08] text-[#6b6560] hover:text-[#f0ede8] hover:border-white/20"
                      }`}>{n}</button>
                  ))}
                </div>
              </div>
              {error && <div className="px-4 py-3 rounded-sm text-sm border border-red-500/20 bg-red-500/5 text-red-400">{error}</div>}
              <button onClick={generateQuiz} disabled={!topic.trim()}
                className="w-full py-4 rounded-sm font-bold text-xs tracking-[0.15em] uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: topic.trim() ? "#e8844a" : "#1a1a1a", color: topic.trim() ? "#0c0c0c" : "#3a3530" }}>
                Generate Quiz
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {stage === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#e8844a] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-[#e8844a] rounded-full animate-bounce [animation-delay:120ms]" />
              <span className="w-2 h-2 bg-[#e8844a] rounded-full animate-bounce [animation-delay:240ms]" />
            </div>
            <p className="text-[#6b6560] text-sm tracking-wider">Generating {difficulty} quiz on "{topic}"...</p>
          </div>
        )}

        {/* QUIZ */}
        {(stage === "quiz" || stage === "submitting") && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{color: difficultyColor[difficulty]}}>{difficulty} · Quiz</p>
                <h2 className="text-xl font-black uppercase tracking-tight">{topic}</h2>
              </div>
              <div className="text-right">
                <p className="text-[#6b6560] text-xs">{answeredCount} / {questions.length} answered</p>
                <div className="mt-1.5 w-32 h-1 bg-[#1c1c1c] rounded-full overflow-hidden">
                  <div className="h-full bg-[#e8844a] transition-all duration-300 rounded-full" style={{width:`${(answeredCount/questions.length)*100}%`}} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {questions.map((q, qi) => (
                <div key={qi} className="bg-[#141414] border border-white/[0.06] rounded-sm p-5 sm:p-6">
                  <p className="text-[#f0ede8] text-sm font-medium mb-4 leading-relaxed">
                    <span className="text-[#e8844a] font-bold mr-2" style={{fontFamily:"var(--font-geist-mono)"}}>Q{qi+1}.</span>
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {optionLabels.map((label) => (
                      <button key={label} onClick={() => setAnswers((prev) => ({...prev,[qi]:label}))}
                        className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-left transition-all duration-150 border ${
                          answers[qi] === label ? "border-[#e8844a] bg-[#e8844a]/10 text-[#f0ede8]" : "border-white/[0.06] text-[#a39d97] hover:border-white/20 hover:text-[#f0ede8]"
                        }`}>
                        <span className={`shrink-0 w-6 h-6 rounded-sm border text-[10px] font-bold flex items-center justify-center transition-colors ${
                          answers[qi] === label ? "border-[#e8844a] bg-[#e8844a] text-[#0c0c0c]" : "border-white/[0.12] text-[#6b6560]"
                        }`}>{label}</span>
                        {q.options[label]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {error && <div className="px-4 py-3 rounded-sm text-sm border border-red-500/20 bg-red-500/5 text-red-400">{error}</div>}
            <button onClick={submitQuiz} disabled={stage === "submitting"}
              className="w-full py-4 rounded-sm font-bold text-xs tracking-[0.15em] uppercase bg-[#e8844a] hover:bg-[#f09558] text-[#0c0c0c] disabled:opacity-50 transition-colors">
              {stage === "submitting" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Scoring...
                </span>
              ) : `Submit Quiz (${answeredCount}/${questions.length})`}
            </button>
          </div>
        )}

        {/* RESULTS */}
        {stage === "results" && scoreData && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#141414] border border-white/[0.06] rounded-sm p-7 sm:p-8 text-center">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#3a3530] mb-3">Your Score</p>
              <div className="text-[5rem] font-black leading-none tracking-tight"
                style={{color: scoreData.percentage >= 70 ? "#e8844a" : scoreData.percentage >= 40 ? "#f5c842" : "#ef4444"}}>
                {scoreData.percentage}%
              </div>
              <p className="text-[#6b6560] text-sm mt-2">{scoreData.score} correct out of {scoreData.total}</p>
              <p className="text-[#3a3530] text-xs mt-1">
                {scoreData.percentage >= 70 ? "Great work!" : scoreData.percentage >= 40 ? "Keep studying." : "Review the material and try again."}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-white/[0.06] rounded-sm">
                <span className="text-[10px] text-[#3a3530] tracking-widest uppercase">Next difficulty</span>
                <span className="text-xs font-bold uppercase" style={{color: difficultyColor[scoreData.next_difficulty] || "#e8844a"}}>{scoreData.next_difficulty}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#3a3530]">Question Breakdown</p>
              {scoreData.results.map((r, i) => (
                <div key={i} className={`bg-[#141414] border rounded-sm p-5 ${r.correct ? "border-[#e8844a]/20" : "border-red-500/15"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`shrink-0 mt-0.5 text-xs font-bold ${r.correct ? "text-[#e8844a]" : "text-red-400"}`}>{r.correct ? "✓" : "✕"}</span>
                    <p className="text-[#f0ede8] text-sm leading-relaxed">{r.question}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                    {optionLabels.map((label) => (
                      <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-sm text-xs border ${
                        label === r.correct_answer ? "border-[#e8844a]/30 bg-[#e8844a]/5 text-[#e8844a]"
                        : label === r.selected && !r.correct ? "border-red-500/20 bg-red-500/5 text-red-400"
                        : "border-white/[0.04] text-[#3a3530]"
                      }`}>
                        <span className="font-bold">{label}.</span>{r.options[label]}
                      </div>
                    ))}
                  </div>
                  <p className="text-[#6b6560] text-xs leading-relaxed border-t border-white/[0.05] pt-3">
                    <span className="text-[#3a3530] uppercase text-[10px] mr-1">Explanation:</span>{r.explanation}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={reset} className="flex-1 py-4 rounded-sm font-bold text-xs tracking-[0.15em] uppercase bg-[#e8844a] hover:bg-[#f09558] text-[#0c0c0c] transition-colors">Try Another Quiz</button>
              <Link href="/progress" className="flex-1 py-4 rounded-sm font-bold text-xs tracking-[0.15em] uppercase border border-white/[0.08] text-[#6b6560] hover:text-[#f0ede8] hover:border-white/20 transition-colors text-center">View Progress</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
