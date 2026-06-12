import type { ResumeData } from "./types";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return tf;
}

function resumeText(resume: ResumeData): string {
  const parts: string[] = [
    resume.personal.summary,
    ...resume.experience.flatMap((e) => [e.title, e.company, ...e.bullets]),
    ...resume.education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
    ...resume.skills.flatMap((s) => [s.category, ...s.items]),
    ...resume.projects.flatMap((p) => [p.name, p.description, ...p.technologies]),
  ];
  return parts.join(" ");
}

export interface MatchResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "you", "our", "are", "this", "that", "will",
  "have", "has", "from", "your", "all", "can", "who", "but", "not", "we",
  "they", "their", "been", "also", "both", "each", "more", "work", "team",
  "able", "must", "may", "any", "its", "new", "use", "using", "used",
]);

export function matchResume(resume: ResumeData, jobDescription: string): MatchResult {
  const jobTokens = tokenize(jobDescription).filter((t) => !STOP_WORDS.has(t));
  const resumeTokens = tokenize(resumeText(resume));

  const jobFreq = termFrequency(jobTokens);
  const resumeFreq = termFrequency(resumeTokens);

  const jobKeywords = [...jobFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([k]) => k);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of jobKeywords) {
    if (resumeFreq.has(kw)) matched.push(kw);
    else missing.push(kw);
  }

  const score = Math.round((matched.length / Math.max(jobKeywords.length, 1)) * 100);

  const suggestions: string[] = [];
  if (missing.length > 0) {
    suggestions.push(`Add these keywords to your resume: ${missing.slice(0, 8).join(", ")}`);
  }
  if (score < 50) suggestions.push("Your resume matches fewer than half the job keywords. Consider tailoring your experience section.");
  if (resume.personal.summary.length < 50) suggestions.push("Add or expand your professional summary to include relevant keywords.");
  if (resume.skills.length === 0) suggestions.push("Add a Skills section with technologies and tools mentioned in the job description.");

  return { score, matchedKeywords: matched, missingKeywords: missing.slice(0, 15), suggestions };
}
