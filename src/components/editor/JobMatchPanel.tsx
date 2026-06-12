"use client";
import { useState } from "react";
import { Target, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { matchResume, type MatchResult } from "@/lib/jobMatch";
import type { ResumeData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  resume: ResumeData;
}

export function JobMatchPanel({ resume }: Props) {
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);

  const analyze = () => setResult(matchResume(resume, jd));

  const scoreColor =
    !result ? "" :
    result.score >= 75 ? "text-green-600" :
    result.score >= 50 ? "text-yellow-600" :
    "text-red-500";

  const scoreBg =
    !result ? "" :
    result.score >= 75 ? "bg-green-500" :
    result.score >= 50 ? "bg-yellow-500" :
    "bg-red-500";

  return (
    <div className="border border-purple-100 rounded-xl bg-purple-50/50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
          <Target size={16} />
          Job Match Scorer
          <span className="text-xs font-normal text-purple-400">(runs locally)</span>
        </div>
        {open ? <ChevronUp size={16} className="text-purple-400" /> : <ChevronDown size={16} className="text-purple-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-xs text-gray-500">
            Paste a job description below. Keyword matching runs entirely in your browser — nothing is sent anywhere.
          </p>
          <Textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            className="min-h-[120px] text-xs"
          />
          <Button onClick={analyze} disabled={jd.trim().length < 50} variant="secondary" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
            <Target size={14} /> Analyze Match
          </Button>

          {result && (
            <div className="space-y-4">
              {/* Score */}
              <div className="text-center">
                <p className={cn("text-4xl font-bold", scoreColor)}>{result.score}%</p>
                <p className="text-xs text-gray-500 mt-1">keyword match</p>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", scoreBg)}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>

              {/* Matched */}
              {result.matchedKeywords.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-1.5">Matched Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedKeywords.map((kw) => (
                      <span key={kw} className="bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing */}
              {result.missingKeywords.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-600 mb-1.5">Missing Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map((kw) => (
                      <span key={kw} className="bg-red-50 text-red-600 border border-red-200 text-xs px-2 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-lg p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-gray-700">Suggestions</p>
                  {result.suggestions.map((s, i) => (
                    <p key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-purple-400 shrink-0">→</span>
                      {s}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
