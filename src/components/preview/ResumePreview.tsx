"use client";
import type { ResumeData } from "@/lib/types";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";

interface Props {
  data: ResumeData;
  scale?: number;
}

export function ResumePreview({ data, scale = 1 }: Props) {
  const Template =
    data.template === "classic" ? ClassicTemplate :
    data.template === "minimal" ? MinimalTemplate :
    ModernTemplate;

  return (
    <div
      id="resume-preview"
      style={{
        width: "816px",
        minHeight: "1056px",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
      className="bg-white shadow-lg"
    >
      <Template data={data} />
    </div>
  );
}
