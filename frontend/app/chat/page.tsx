"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Mode = "tutor" | "socratic";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi I'm EdgeTutor. Upload a PDF first, then ask me anything about it." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("tutor");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const notice = mode === "socratic"
      ? "Switched to Socratic mode I'll guide you with questions instead of direct answers."
      : "Switched to Tutor mode I'll answer your questions directly.";
    setMessages((prev) => {
      const modeNotices = [
        "Switched to Socratic mode I'll guide you with questions instead of direct answers.",
        "Switched to Tutor mode I'll answer your questions directly.",
      ];
      const filtered = prev.filter((m) => !modeNotices.includes(m.content));
      return [...filtered, { role: "assistant", content: notice }];
    });
  }, [mode]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "48px";
    try {
      const res = await fetch(`http://127.0.0.1:8000/chat?q=${encodeURIComponent(q)}&mode=${mode}`);
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.detail || "Something went wrong."}` }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Cannot connect to backend. Make sure it is running on port 8000." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "48px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <main className="h-screen bg-[#0c0c0c] text-[#f0ede8] flex flex-col overflow-hidden">
      {/* Ambient */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] pointer-events-none z-0"
        style={{background: "radial-gradient(ellipse at 0% 100%, rgba(232,132,74,0.07) 0%, transparent 60%)"}} />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none z-0"
        style={{background: "radial-gradient(ellipse at 100% 0%, rgba(232,132,74,0.03) 0%, transparent 60%)"}} />

      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.06] shrink-0 backdrop-blur-sm bg-[#0c0c0c]/80">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 blur-sm opacity-50 group-hover:opacity-80 transition-opacity" style={{background:"rgba(232,132,74,0.5)"}} />
            <svg className="relative" width="16" height="20" viewBox="0 0 20 24" fill="none">
              <path d="M10 0C10 0 15 6 15 11C15 13.76 13.21 16.08 10.7 16.79C11.13 15.95 11.38 15 11.38 14C11.38 11.5 9.5 9.5 7.5 8C7.5 8 8 11 6.5 13C5.5 14.5 4 15.5 4 17.5C4 20.54 6.69 23 10 23C13.31 23 16 20.54 16 17.5C16 14.83 14.09 12.62 11.5 12C12.2 10.67 12.5 9.17 12.5 7.5C12.5 4.81 11.09 2.5 10 0Z" fill="url(#fg3)"/>
              <defs>
                <linearGradient id="fg3" x1="10" y1="0" x2="10" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f5a55a"/><stop offset="1" stopColor="#c4622a"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-[14px] font-bold tracking-[0.12em] uppercase text-[#f0ede8] group-hover:text-white transition-colors"
            style={{fontFamily: "var(--font-geist-mono)"}}>EdgeTutor</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode toggle */}
          <div className="flex items-center border border-white/[0.08] rounded-sm overflow-hidden">
            <button onClick={() => setMode("tutor")}
              className={`text-[11px] font-semibold tracking-[0.12em] uppercase px-3 py-1.5 transition-all duration-200 ${
                mode === "tutor" ? "bg-[#e8844a] text-[#0c0c0c] shadow-inner" : "text-[#6b6560] hover:text-[#f0ede8] hover:bg-white/[0.03]"
              }`}>
              Tutor
            </button>
            <button onClick={() => setMode("socratic")}
              className={`text-[11px] font-semibold tracking-[0.12em] uppercase px-3 py-1.5 transition-all duration-200 border-l border-white/[0.08] ${
                mode === "socratic" ? "bg-[#e8844a] text-[#0c0c0c] shadow-inner" : "text-[#6b6560] hover:text-[#f0ede8] hover:bg-white/[0.03]"
              }`}>
              Socratic
            </button>
          </div>
          <Link href="/quiz"
            className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#6b6560] hover:text-[#f0ede8] transition-all duration-200 px-3 py-1.5 border border-white/[0.07] hover:border-white/20 rounded-sm hover:bg-white/[0.03]">
            Quiz
          </Link>
          <Link href="/upload"
            className="hidden sm:block text-[11px] font-medium tracking-[0.15em] uppercase text-[#6b6560] hover:text-[#f0ede8] transition-all duration-200 px-3 py-1.5 border border-white/[0.07] hover:border-white/20 rounded-sm hover:bg-white/[0.03]">
            + Upload
          </Link>
          <div className="flex items-center gap-1.5 pl-1">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-[#e8844a] rounded-full animate-pulse" />
              <div className="absolute inset-0 w-1.5 h-1.5 bg-[#e8844a] rounded-full opacity-40 animate-ping" />
            </div>
            <span className="text-[11px] text-[#7a7570] hidden sm:block">AI Ready</span>
          </div>
        </div>
      </nav>

      {/* Socratic banner */}
      {mode === "socratic" && (
        <div className="relative z-10 shrink-0 bg-gradient-to-r from-[#e8844a]/8 to-transparent border-b border-[#e8844a]/15 px-5 sm:px-8 py-2.5 flex items-center gap-2.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e8844a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span className="text-[11px] text-[#e8844a]/80 tracking-wider">
            Socratic mode: AI guides you with questions rather than direct answers
          </span>
        </div>
      )}

      {/* MESSAGES */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`shrink-0 w-7 h-7 rounded-sm flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-[#161616] border border-[#e8844a]/25 shadow-sm shadow-orange-900/20"
                  : "bg-[#1a1a1a] border border-white/[0.07]"
              }`}>
                {msg.role === "assistant" ? (
                  <svg width="12" height="14" viewBox="0 0 20 24" fill="none">
                    <path d="M10 0C10 0 15 6 15 11C15 13.76 13.21 16.08 10.7 16.79C11.13 15.95 11.38 15 11.38 14C11.38 11.5 9.5 9.5 7.5 8C7.5 8 8 11 6.5 13C5.5 14.5 4 15.5 4 17.5C4 20.54 6.69 23 10 23C13.31 23 16 20.54 16 17.5C16 14.83 14.09 12.62 11.5 12C12.2 10.67 12.5 9.17 12.5 7.5C12.5 4.81 11.09 2.5 10 0Z" fill="#e8844a"/>
                  </svg>
                ) : (
                  <span className="text-[#6b6560] text-[10px] font-bold" style={{fontFamily:"var(--font-geist-mono)"}}>U</span>
                )}
              </div>
              <div className={`max-w-[82%] sm:max-w-[75%] px-4 py-3 rounded-sm text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-[#111111] border border-white/[0.05] text-[#c8c3bc] shadow-sm"
                  : "bg-[#1c1c1c] border border-white/[0.07] text-[#f0ede8]"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="shrink-0 w-7 h-7 rounded-sm bg-[#161616] border border-[#e8844a]/25 flex items-center justify-center shadow-sm shadow-orange-900/20">
                <svg width="12" height="14" viewBox="0 0 20 24" fill="none">
                  <path d="M10 0C10 0 15 6 15 11C15 13.76 13.21 16.08 10.7 16.79C11.13 15.95 11.38 15 11.38 14C11.38 11.5 9.5 9.5 7.5 8C7.5 8 8 11 6.5 13C5.5 14.5 4 15.5 4 17.5C4 20.54 6.69 23 10 23C13.31 23 16 20.54 16 17.5C16 14.83 14.09 12.62 11.5 12C12.2 10.67 12.5 9.17 12.5 7.5C12.5 4.81 11.09 2.5 10 0Z" fill="#e8844a"/>
                </svg>
              </div>
              <div className="bg-[#111111] border border-white/[0.05] rounded-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#e8844a] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-[#e8844a]/70 rounded-full animate-bounce [animation-delay:120ms]" />
                <span className="w-1.5 h-1.5 bg-[#e8844a]/40 rounded-full animate-bounce [animation-delay:240ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="relative z-10 shrink-0 border-t border-white/[0.06] bg-[#0c0c0c]/90 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKey}
                placeholder={mode === "socratic" ? "Ask something I'll guide you to the answer..." : "Ask a question about your document..."}
                className="w-full bg-[#111111] border border-white/[0.08] focus:border-[#e8844a]/35 rounded-sm px-4 py-3 text-sm text-[#f0ede8] placeholder-[#7a7570] resize-none focus:outline-none transition-all duration-200 shadow-inner"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <button onClick={send} disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-200 shrink-0 disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background: input.trim() && !loading ? "#e8844a" : "#181818",
                boxShadow: input.trim() && !loading ? "0 4px 20px rgba(232,132,74,0.3)" : "none"
              }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() && !loading ? "#0c0c0c" : "#7a7570"}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p className="text-center text-[#6b6560] text-[10px] mt-2 tracking-wider">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </main>
  );
}
