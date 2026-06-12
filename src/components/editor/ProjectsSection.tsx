"use client";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface Props {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const blank = (): Project => ({
  id: generateId(),
  name: "",
  description: "",
  url: "",
  technologies: [],
});

export function ProjectsSection({ data, onChange }: Props) {
  const [techDrafts, setTechDrafts] = useState<Record<string, string>>({});

  const update = (id: string, patch: Partial<Project>) =>
    onChange(data.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const addTech = (id: string) => {
    const val = (techDrafts[id] ?? "").trim();
    if (!val) return;
    const proj = data.find((p) => p.id === id)!;
    if (proj.technologies.includes(val)) return;
    update(id, { technologies: [...proj.technologies, val] });
    setTechDrafts((d) => ({ ...d, [id]: "" }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Projects</h3>
        <Button variant="secondary" size="sm" onClick={() => onChange([...data, blank()])}>
          <Plus size={14} /> Add Project
        </Button>
      </div>
      {data.map((proj) => (
        <div key={proj.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
          <div className="flex justify-end">
            <Button variant="danger" size="sm" onClick={() => onChange(data.filter((p) => p.id !== proj.id))}>
              <Trash2 size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Project Name" value={proj.name} onChange={(e) => update(proj.id, { name: e.target.value })} placeholder="Open Source App" />
            <Input label="URL (optional)" value={proj.url} onChange={(e) => update(proj.id, { url: e.target.value })} placeholder="https://github.com/..." />
          </div>
          <Textarea
            label="Description"
            value={proj.description}
            onChange={(e) => update(proj.id, { description: e.target.value })}
            placeholder="What did it do? What was your role? What was the impact?"
            className="min-h-[80px]"
          />
          <div>
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">Technologies</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {proj.technologies.map((tech) => (
                <span key={tech} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {tech}
                  <button onClick={() => update(proj.id, { technologies: proj.technologies.filter((t) => t !== tech) })}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add technology and press Enter"
                value={techDrafts[proj.id] ?? ""}
                onChange={(e) => setTechDrafts((d) => ({ ...d, [proj.id]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(proj.id); } }}
                className="flex-1"
              />
              <Button variant="secondary" size="sm" onClick={() => addTech(proj.id)}>
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">
          No projects added yet.
        </p>
      )}
    </div>
  );
}
