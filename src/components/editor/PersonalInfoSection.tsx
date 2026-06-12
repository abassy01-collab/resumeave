"use client";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { PersonalInfo } from "@/lib/types";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export function PersonalInfoSection({ data, onChange }: Props) {
  const set = (field: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...data, [field]: e.target.value });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">Personal Information</h3>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Full Name" value={data.fullName} onChange={set("fullName")} placeholder="Jane Doe" />
        <Input label="Email" type="email" value={data.email} onChange={set("email")} placeholder="jane@example.com" />
        <Input label="Phone" value={data.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" />
        <Input label="Location" value={data.location} onChange={set("location")} placeholder="New York, NY" />
        <Input label="Website" value={data.website} onChange={set("website")} placeholder="https://yoursite.com" />
        <Input label="LinkedIn" value={data.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/janedoe" />
      </div>
      <Textarea
        label="Professional Summary"
        value={data.summary}
        onChange={set("summary")}
        placeholder="A brief 2-3 sentence overview of your experience and goals..."
        className="min-h-[100px]"
      />
    </div>
  );
}
