"use client";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Education } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const blank = (): Education => ({
  id: generateId(),
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  gpa: "",
  honors: "",
});

export function EducationSection({ data, onChange }: Props) {
  const update = (id: string, patch: Partial<Education>) =>
    onChange(data.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Education</h3>
        <Button variant="secondary" size="sm" onClick={() => onChange([...data, blank()])}>
          <Plus size={14} /> Add Education
        </Button>
      </div>
      {data.map((edu) => (
        <div key={edu.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
          <div className="flex justify-end">
            <Button variant="danger" size="sm" onClick={() => onChange(data.filter((e) => e.id !== edu.id))}>
              <Trash2 size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Institution" value={edu.institution} onChange={(e) => update(edu.id, { institution: e.target.value })} placeholder="MIT" />
            <Input label="Degree" value={edu.degree} onChange={(e) => update(edu.id, { degree: e.target.value })} placeholder="Bachelor of Science" />
            <Input label="Field of Study" value={edu.field} onChange={(e) => update(edu.id, { field: e.target.value })} placeholder="Computer Science" />
            <Input label="GPA (optional)" value={edu.gpa} onChange={(e) => update(edu.id, { gpa: e.target.value })} placeholder="3.8" />
            <Input label="Start Date" type="month" value={edu.startDate} onChange={(e) => update(edu.id, { startDate: e.target.value })} />
            <Input label="End Date" type="month" value={edu.endDate} onChange={(e) => update(edu.id, { endDate: e.target.value })} />
          </div>
          <Input label="Honors / Awards (optional)" value={edu.honors} onChange={(e) => update(edu.id, { honors: e.target.value })} placeholder="Summa Cum Laude, Dean's List" />
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">
          No education added yet.
        </p>
      )}
    </div>
  );
}
