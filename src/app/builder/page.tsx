"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Download, Save, ArrowLeft, Layout, Palette } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PersonalInfoSection } from "@/components/editor/PersonalInfoSection";
import { ExperienceSection } from "@/components/editor/ExperienceSection";
import { EducationSection } from "@/components/editor/EducationSection";
import { SkillsSection } from "@/components/editor/SkillsSection";
import { ProjectsSection } from "@/components/editor/ProjectsSection";
import { AIPanel } from "@/components/editor/AIPanel";
import { JobMatchPanel } from "@/components/editor/JobMatchPanel";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { defaultResume, type ResumeData, type TemplateId } from "@/lib/types";
import { saveResume, getResume } from "@/lib/storage";
import { exportToPDF } from "@/lib/pdf";
import { cn } from "@/lib/utils";

const TABS = ["Personal", "Experience", "Education", "Skills", "Projects"] as const;
type Tab = (typeof TABS)[number];

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: "modern", label: "Modern" },
  { id: "classic", label: "Classic" },
  { id: "minimal", label: "Minimal" },
];

export default function BuilderPage() {
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [activeTab, setActiveTab] = useState<Tab>("Personal");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      getResume(id).then((r) => { if (r) setResume(r); });
    }
  }, []);

  const autosave = useCallback((data: ResumeData) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await saveResume(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }, []);

  const update = (patch: Partial<ResumeData>) => {
    const next = { ...resume, ...patch };
    setResume(next);
    autosave(next);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveResume(resume);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToPDF("resume-preview", resume.personal.fullName || "resume");
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  const previewScale = 0.55;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Panel — Editor */}
      <div className="w-[480px] shrink-0 flex flex-col border-r border-gray-200 bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm">
            <ArrowLeft size={16} /> Back
          </Link>
          <input
            className="text-sm font-semibold text-gray-800 bg-transparent border-none outline-none text-center w-40"
            value={resume.name}
            onChange={(e) => update({ name: e.target.value })}
          />
          <div className="flex items-center gap-2">
            {saved && <span className="text-xs text-green-500">Saved</span>}
            <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving}>
              <Save size={14} /> {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-2.5 text-xs font-medium transition border-b-2 -mb-px",
                activeTab === tab
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Section content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeTab === "Personal" && (
            <>
              <PersonalInfoSection data={resume.personal} onChange={(personal) => update({ personal })} />
              <AIPanel resume={resume} onUpdate={(r) => { setResume(r); autosave(r); }} />
              <JobMatchPanel resume={resume} />
            </>
          )}
          {activeTab === "Experience" && (
            <ExperienceSection data={resume.experience} onChange={(experience) => update({ experience })} />
          )}
          {activeTab === "Education" && (
            <EducationSection data={resume.education} onChange={(education) => update({ education })} />
          )}
          {activeTab === "Skills" && (
            <SkillsSection data={resume.skills} onChange={(skills) => update({ skills })} />
          )}
          {activeTab === "Projects" && (
            <ProjectsSection data={resume.projects} onChange={(projects) => update({ projects })} />
          )}
        </div>
      </div>

      {/* Right Panel — Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Layout size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button variant="secondary" size="sm" onClick={() => setShowTemplates((s) => !s)}>
                <Palette size={14} /> Template: {TEMPLATES.find((t) => t.id === resume.template)?.label}
              </Button>
              {showTemplates && (
                <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-[140px]">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { update({ template: t.id }); setShowTemplates(false); }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm transition hover:bg-gray-50",
                        resume.template === t.id ? "text-indigo-600 font-medium" : "text-gray-700"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={handleExport} disabled={exporting}>
              <Download size={14} />
              {exporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        {/* Preview canvas */}
        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-100">
          <div style={{ width: `${816 * previewScale}px`, height: `${1056 * previewScale}px` }} className="relative">
            <ResumePreview data={resume} scale={previewScale} />
          </div>
        </div>
      </div>
    </div>
  );
}
