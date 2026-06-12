"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Lock, Download, Sparkles, Target, Plus, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { listResumes, deleteResume, saveResume } from "@/lib/storage";
import { defaultResume } from "@/lib/types";
import type { ResumeData } from "@/lib/types";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Home() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listResumes().then((r) => { setResumes(r); setLoaded(true); });
  }, []);

  const createNew = async () => {
    const resume = defaultResume();
    await saveResume(resume);
    window.location.href = `/builder?id=${resume.id}`;
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Delete this resume?")) return;
    await deleteResume(id);
    setResumes((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="text-indigo-600" size={22} />
          <span className="font-bold text-gray-900 text-lg">ResumeAve</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Lock size={11} /> Your data never leaves your device
          </span>
          <Button onClick={createNew}>
            <Plus size={14} /> New Resume
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100 mb-6">
          <Shield size={12} /> Privacy-First Resume Builder
        </div>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
          Build your resume.<br />
          <span className="text-indigo-600">Keep your data.</span>
        </h1>
        <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          No account required. No data collection. No ads. Your resume lives in your browser — not on our servers.
          Export to PDF anytime, for free.
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Button onClick={createNew} className="px-6 py-3 text-base">
            <Plus size={18} /> Build My Resume
          </Button>
          <a href="#features" className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-600 hover:text-gray-900 transition">
            See how it works →
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Why ResumeAve?</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="text-indigo-600" size={24} />,
                title: "Zero data collection",
                desc: "Everything is stored in your browser using IndexedDB. We have no server, no database, no account system. We literally cannot access your data.",
              },
              {
                icon: <Download className="text-indigo-600" size={24} />,
                title: "Free PDF export",
                desc: "Export to a professional PDF instantly, no paywall. No watermarks. The PDF is generated client-side — nothing is uploaded anywhere.",
              },
              {
                icon: <Sparkles className="text-indigo-600" size={24} />,
                title: "Privacy-safe AI",
                desc: "Connect your own Claude or OpenAI API key. Requests go directly from your browser to the AI provider — we are never in the loop.",
              },
              {
                icon: <Target className="text-indigo-600" size={24} />,
                title: "Job match scoring",
                desc: "Paste a job description and get a keyword match score with gap analysis. All processing happens in your browser using local NLP.",
              },
              {
                icon: <FileText className="text-indigo-600" size={24} />,
                title: "Beautiful templates",
                desc: "Three ATS-friendly templates — Modern, Classic, and Minimal — designed to look great both on screen and in print.",
              },
              {
                icon: <Shield className="text-indigo-600" size={24} />,
                title: "No dark patterns",
                desc: "No trial-to-subscription traps. No hidden charges. No auto-renewals. No 'we may share your data with partners'. Just a resume builder.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy vs competitors */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">What others don&apos;t tell you</h2>
        <p className="text-center text-gray-500 mb-10 text-sm">Documented practices from the top resume builders</p>
        <div className="space-y-3">
          {[
            { them: "LinkedIn trains AI on your resume data by default", us: "No AI training — ever" },
            { them: "26M+ resumes exposed in a single cloud misconfiguration (TalentHook)", us: "Nothing to breach — your data never reaches our servers" },
            { them: "$1.95 trial → $23.95/month auto-renewal (Zety, MyPerfectResume)", us: "Free. No payment info, no subscriptions, no upsells" },
            { them: "Shares data with Facebook, Google, LinkedIn for prefill", us: "No third-party integrations or tracking" },
            { them: "Account required to access your own resume", us: "No account — open your browser, build your resume" },
          ].map(({ them, us }) => (
            <div key={them} className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                <p className="text-sm text-red-700">{them}</p>
              </div>
              <div className="flex items-start gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                <p className="text-sm text-green-700">{us}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Existing resumes */}
      {loaded && resumes.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Your Resumes</h2>
          <div className="grid grid-cols-3 gap-4">
            {resumes.map((r) => (
              <Link
                key={r.id}
                href={`/builder?id=${r.id}`}
                className="group bg-white border border-gray-200 rounded-2xl p-4 hover:border-indigo-300 hover:shadow-sm transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.personal.fullName || "No name yet"}</p>
                    <p className="text-xs text-gray-300 mt-1">Updated {timeAgo(r.updatedAt)}</p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(r.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-400 capitalize">{r.template} template</div>
              </Link>
            ))}
            <button
              onClick={createNew}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition"
            >
              <Plus size={20} />
              <span className="text-sm font-medium">New Resume</span>
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Shield size={14} className="text-indigo-400" />
          <span>ResumeAve — Privacy-first resume builder. No account. No tracking. No nonsense.</span>
        </div>
      </footer>
    </div>
  );
}
