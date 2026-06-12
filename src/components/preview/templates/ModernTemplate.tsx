import type { ResumeData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ModernTemplate({ data }: { data: ResumeData }) {
  const { personal, experience, education, skills, projects } = data;

  return (
    <div className="font-sans text-gray-900 bg-white" style={{ fontSize: "11px", lineHeight: "1.5" }}>
      {/* Header */}
      <div className="bg-indigo-700 text-white px-8 py-6">
        <h1 className="text-2xl font-bold tracking-tight">{personal.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-indigo-200 text-xs">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
        {personal.summary && (
          <p className="mt-3 text-indigo-100 text-xs leading-relaxed max-w-2xl">{personal.summary}</p>
        )}
      </div>

      <div className="px-8 py-6 space-y-5">
        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700 border-b border-indigo-100 pb-1 mb-3">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{exp.title}</p>
                      <p className="text-gray-600">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                    </div>
                    <p className="text-gray-400 shrink-0 ml-4">
                      {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul className="mt-1.5 space-y-1 list-none">
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-indigo-500 shrink-0 mt-0.5">▸</span>
                          <span className="text-gray-700">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700 border-b border-indigo-100 pb-1 mb-3">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <p className="font-semibold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.honors && <p className="text-gray-500">{edu.honors}</p>}
                  </div>
                  <div className="text-right text-gray-400 shrink-0 ml-4">
                    <p>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700 border-b border-indigo-100 pb-1 mb-3">Skills</h2>
            <div className="space-y-1.5">
              {skills.map((skill) => (
                <div key={skill.id} className="flex gap-2">
                  {skill.category && <span className="font-semibold shrink-0">{skill.category}:</span>}
                  <span className="text-gray-700">{skill.items.join(" · ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700 border-b border-indigo-100 pb-1 mb-3">Projects</h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between">
                    <p className="font-semibold text-sm">{proj.name}</p>
                    {proj.url && <span className="text-indigo-600 text-xs">{proj.url}</span>}
                  </div>
                  {proj.technologies.length > 0 && (
                    <p className="text-gray-500 text-xs">{proj.technologies.join(" · ")}</p>
                  )}
                  {proj.description && <p className="text-gray-700 mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
