import type { ResumeData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personal, experience, education, skills, projects } = data;

  return (
    <div className="font-serif text-gray-900 bg-white px-10 py-8" style={{ fontSize: "11px", lineHeight: "1.6" }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-900 pb-4 mb-5">
        <h1 className="text-2xl font-bold tracking-wide uppercase">{personal.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>| {personal.phone}</span>}
          {personal.location && <span>| {personal.location}</span>}
          {personal.website && <span>| {personal.website}</span>}
          {personal.linkedin && <span>| {personal.linkedin}</span>}
        </div>
        {personal.summary && (
          <p className="mt-2 text-xs text-gray-700 italic max-w-xl mx-auto">{personal.summary}</p>
        )}
      </div>

      <div className="space-y-5">
        {experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-3">Professional Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-sm">{exp.title}</p>
                    <p className="text-gray-500 text-xs">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</p>
                  </div>
                  <p className="text-gray-700 italic">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul className="mt-1 list-disc list-outside ml-4 space-y-0.5">
                      {exp.bullets.filter(Boolean).map((b, i) => <li key={i} className="text-gray-700">{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-3">Education</h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <p className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="italic text-gray-700">{edu.institution}</p>
                    {(edu.gpa || edu.honors) && (
                      <p className="text-gray-600">{[edu.gpa && `GPA: ${edu.gpa}`, edu.honors].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs shrink-0 ml-4">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-3">Skills</h2>
            <div className="space-y-1">
              {skills.map((skill) => (
                <div key={skill.id} className="flex gap-2">
                  {skill.category && <span className="font-bold shrink-0">{skill.category}:</span>}
                  <span className="text-gray-700">{skill.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-3">Projects</h2>
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between">
                    <p className="font-bold">{proj.name}</p>
                    {proj.url && <span className="text-gray-500 text-xs">{proj.url}</span>}
                  </div>
                  {proj.technologies.length > 0 && <p className="italic text-gray-600">{proj.technologies.join(", ")}</p>}
                  {proj.description && <p className="text-gray-700">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
