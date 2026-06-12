"use client";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { WorkExperience } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface Props {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}

const blank = (): WorkExperience => ({
  id: generateId(),
  company: "",
  title: "",
  startDate: "",
  endDate: "",
  current: false,
  location: "",
  bullets: [""],
});

export function ExperienceSection({ data, onChange }: Props) {
  const update = (id: string, patch: Partial<WorkExperience>) =>
    onChange(data.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const updateBullet = (id: string, idx: number, value: string) =>
    update(id, {
      bullets: data.find((e) => e.id === id)!.bullets.map((b, i) => (i === idx ? value : b)),
    });

  const addBullet = (id: string) =>
    update(id, { bullets: [...data.find((e) => e.id === id)!.bullets, ""] });

  const removeBullet = (id: string, idx: number) =>
    update(id, { bullets: data.find((e) => e.id === id)!.bullets.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Work Experience</h3>
        <Button variant="secondary" size="sm" onClick={() => onChange([...data, blank()])}>
          <Plus size={14} /> Add Position
        </Button>
      </div>

      {data.map((exp, index) => (
        <div key={exp.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <GripVertical size={16} />
              <span className="text-xs font-medium text-gray-500">Position {index + 1}</span>
            </div>
            <Button variant="danger" size="sm" onClick={() => onChange(data.filter((e) => e.id !== exp.id))}>
              <Trash2 size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Job Title" value={exp.title} onChange={(e) => update(exp.id, { title: e.target.value })} placeholder="Senior Engineer" />
            <Input label="Company" value={exp.company} onChange={(e) => update(exp.id, { company: e.target.value })} placeholder="Acme Corp" />
            <Input label="Location" value={exp.location} onChange={(e) => update(exp.id, { location: e.target.value })} placeholder="Remote" />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Currently Working Here</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => update(exp.id, { current: e.target.checked, endDate: "" })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Present</span>
              </label>
            </div>
            <Input label="Start Date" type="month" value={exp.startDate} onChange={(e) => update(exp.id, { startDate: e.target.value })} />
            {!exp.current && (
              <Input label="End Date" type="month" value={exp.endDate} onChange={(e) => update(exp.id, { endDate: e.target.value })} />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Bullet Points</label>
            {exp.bullets.map((bullet, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Textarea
                  value={bullet}
                  onChange={(e) => updateBullet(exp.id, i, e.target.value)}
                  placeholder="Describe an achievement or responsibility..."
                  className="min-h-[60px] text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBullet(exp.id, i)}
                  disabled={exp.bullets.length === 1}
                  className="mt-1 shrink-0"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => addBullet(exp.id)}>
              <Plus size={14} /> Add Bullet
            </Button>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">
          No experience added yet. Click &quot;Add Position&quot; to get started.
        </p>
      )}
    </div>
  );
}
