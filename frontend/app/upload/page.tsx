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
    if (f.type !== "application/pdf") {
      setStatus("error");
      setMessage("Only PDF files are supported.");
      return;
    }
    setFile(f);
    setStatus("idle");
    setMessage("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "PDF uploaded and indexed successfully!");
      } else {
        setStatus("error");
        setMessage(data.detail || "Upload failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Cannot connect to backend. Make sure it is running on port 8000.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-emerald-300 font-mono font-bold text-lg">
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          EdgeTutor
        </Link>
        <Link href="/chat" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
          Go to Chat <span>→</span>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-12">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-black mb-1 tracking-tight">Upload Study Material</h1>
          <p className="text-gray-400 mb-8 text-sm">Upload a PDF and EdgeTutor will index it for AI-powered Q&A.</p>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              dragOver
                ? "border-emerald-400 bg-emerald-500/10"
                : file
                ? "border-teal-500/50 bg-teal-500/5"
                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">{file.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
                </div>
                <p className="text-xs text-gray-500">Click to change file</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Drop your PDF here</p>
                  <p className="text-gray-400 text-sm mt-0.5">or click to browse files</p>
                </div>
                <p className="text-xs text-gray-600">PDF files only · Max 50MB</p>
              </div>
            )}
          </div>

          {/* Status message */}
          {message && (
            <div className={`mt-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
              status === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {status === "success" ? "✓" : "✕"} {message}
            </div>
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!file || status === "uploading"}
            className="mt-4 w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            {status === "uploading" ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Uploading & Indexing...
              </span>
            ) : status === "success" ? "✓ Uploaded Successfully" : "Upload & Index PDF"}
          </button>

          {status === "success" && (
            <Link href="/chat" className="mt-3 flex items-center justify-center w-full py-3.5 rounded-xl font-bold text-sm border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition-all">
              Start Asking Questions →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
