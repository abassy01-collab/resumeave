"use client";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Skill } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface Props {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export function SkillsSection({ data, onChange }: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const update = (id: string, patch: Partial<Skill>) =>
    onChange(data.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addItem = (id: string) => {
    const val = (drafts[id] ?? "").trim();
    if (!val) return;
    const skill = data.find((s) => s.id === id)!;
    if (skill.items.includes(val)) return;
    update(id, { items: [...skill.items, val] });
    setDrafts((d) => ({ ...d, [id]: "" }));
  };

  const removeItem = (id: string, item: string) =>
    update(id, { items: data.find((s) => s.id === id)!.items.filter((i) => i !== item) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Skills</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange([...data, { id: generateId(), category: "", items: [] }])}
        >
          <Plus size={14} /> Add Category
        </Button>
      </div>
      {data.map((skill) => (
        <div key={skill.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Category (e.g. Languages, Frameworks)"
              value={skill.category}
              onChange={(e) => update(skill.id, { category: e.target.value })}
              className="flex-1"
            />
            <Button variant="danger" size="sm" onClick={() => onChange(data.filter((s) => s.id !== skill.id))}>
              <Trash2 size={14} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skill.items.map((item) => (
              <span key={item} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">
                {item}
                <button onClick={() => removeItem(skill.id, item)} className="hover:text-indigo-900">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add skill and press Enter"
              value={drafts[skill.id] ?? ""}
              onChange={(e) => setDrafts((d) => ({ ...d, [skill.id]: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(skill.id); } }}
              className="flex-1"
            />
            <Button variant="secondary" size="sm" onClick={() => addItem(skill.id)}>
              <Plus size={14} />
            </Button>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">
          No skill categories added yet.
        </p>
      )}
    </div>
  );
}
