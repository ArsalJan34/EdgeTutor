"use client";
import { useState, useRef } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") { setStatus("error"); setMessage("Only PDF files are supported."); return; }
    setFile(f); setStatus("idle"); setMessage("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading"); setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://127.0.0.1:8000/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) { setStatus("success"); setMessage(data.message || "PDF uploaded and indexed successfully!"); }
      else { setStatus("error"); setMessage(data.detail || "Upload failed. Please try again."); }
    } catch {
      setStatus("error"); setMessage("Cannot connect to backend. Make sure it is running on port 8000.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#f0ede8] flex flex-col relative overflow-hidden">

      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{background: "radial-gradient(ellipse at 0% 100%, rgba(232,132,74,0.07) 0%, transparent 60%)"}} />

      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path d="M10 0C10 0 15 6 15 11C15 13.76 13.21 16.08 10.7 16.79C11.13 15.95 11.38 15 11.38 14C11.38 11.5 9.5 9.5 7.5 8C7.5 8 8 11 6.5 13C5.5 14.5 4 15.5 4 17.5C4 20.54 6.69 23 10 23C13.31 23 16 20.54 16 17.5C16 14.83 14.09 12.62 11.5 12C12.2 10.67 12.5 9.17 12.5 7.5C12.5 4.81 11.09 2.5 10 0Z" fill="url(#fg2)"/>
              <defs>
                <linearGradient id="fg2" x1="10" y1="0" x2="10" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f5a55a"/><stop offset="1" stopColor="#c4622a"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-[15px] font-bold tracking-[0.12em] uppercase text-[#f0ede8] group-hover:text-white transition-colors"
            style={{fontFamily: "var(--font-geist-mono)"}}>EdgeTutor</span>
        </Link>
        <Link href="/chat"
          className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#a39d97] hover:text-[#f0ede8] transition-colors duration-200 px-4 py-2 border border-white/[0.08] hover:border-white/20 rounded-sm">
          Chat
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </nav>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1">

        {/* Left sidebar */}
        <aside className="lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-white/[0.06] px-6 sm:px-10 lg:px-8 py-10 lg:py-16 flex flex-col gap-8">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#e8844a] mb-3">Step 01</p>
            <h1 className="text-2xl font-black tracking-tight uppercase leading-tight text-[#f0ede8] mb-3">
              Upload<br />Material
            </h1>
            <p className="text-[#6b6560] text-sm leading-relaxed">
              Upload any PDF lecture notes, textbooks, past papers. EdgeTutor indexes the content and makes it queryable via AI.
            </p>
          </div>
          <div className="hidden lg:flex flex-col gap-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#3a3530]">Supported Formats</p>
            <div className="flex flex-col gap-2">
              {["PDF Documents", "Up to 50 MB", "Any language"].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-[#e8844a]" />
                  <span className="text-[#6b6560] text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block mt-auto pt-8 border-t border-white/[0.06]">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#3a3530] mb-2">Next Step</p>
            <p className="text-[#6b6560] text-xs leading-relaxed">After uploading, go to Chat to ask questions about your document.</p>
          </div>
        </aside>

        {/* Upload zone */}
        <div className="flex-1 px-6 sm:px-10 lg:px-14 py-10 lg:py-16 flex flex-col justify-start max-w-2xl">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
            className="relative border border-dashed rounded-sm p-12 sm:p-16 text-center cursor-pointer transition-all duration-300 mb-5"
            style={{
              borderColor: dragOver ? "#e8844a" : file ? "rgba(232,132,74,0.4)" : "rgba(255,255,255,0.1)",
              background: dragOver ? "rgba(232,132,74,0.05)" : file ? "rgba(232,132,74,0.03)" : "rgba(255,255,255,0.02)",
            }}
          >
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

            {file ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 border border-[#e8844a]/30 rounded-sm flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8844a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[#f0ede8] font-semibold text-sm">{file.name}</p>
                  <p className="text-[#6b6560] text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
                </div>
                <p className="text-[10px] tracking-widest uppercase text-[#3a3530]">Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 border border-white/[0.08] rounded-sm flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b6560" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[#f0ede8] font-semibold text-sm">Drop your PDF here</p>
                  <p className="text-[#6b6560] text-xs mt-1">or click to browse files</p>
                </div>
                <p className="text-[10px] tracking-widest uppercase text-[#2a2520]">PDF · Max 50 MB</p>
              </div>
            )}
          </div>

          {message && (
            <div className={`mb-4 px-4 py-3 rounded-sm text-sm flex items-start gap-2.5 ${
              status === "success"
                ? "border border-[#e8844a]/20 bg-[#e8844a]/5 text-[#e8844a]"
                : "border border-red-500/20 bg-red-500/5 text-red-400"
            }`}>
              <span className="shrink-0 mt-0.5">{status === "success" ? "✓" : "✕"}</span>
              <span>{message}</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || status === "uploading"}
            className="w-full py-4 rounded-sm font-bold text-xs tracking-[0.15em] uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed mb-3"
            style={{
              background: (!file || status === "uploading") ? "#1a1a1a" : "#e8844a",
              color: (!file || status === "uploading") ? "#3a3530" : "#0c0c0c",
            }}
          >
            {status === "uploading" ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Uploading & Indexing...
              </span>
            ) : status === "success" ? "✓  Uploaded Successfully" : "Upload & Index PDF"}
          </button>

          {status === "success" && (
            <Link href="/chat"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-sm font-bold text-xs tracking-[0.15em] uppercase border border-[#e8844a]/30 text-[#e8844a] hover:bg-[#e8844a]/5 transition-all duration-200">
              Start Asking Questions
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
