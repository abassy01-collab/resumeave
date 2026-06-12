import type { ResumeData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personal, experience, education, skills, projects } = data;

  return (
    <div className="font-sans text-gray-800 bg-white px-10 py-8" style={{ fontSize: "11px", lineHeight: "1.6" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-light tracking-tight text-gray-900">{personal.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-gray-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
        {personal.summary && (
          <p className="mt-3 text-gray-600 text-xs leading-relaxed max-w-2xl">{personal.summary}</p>
        )}
      </div>

      <div className="space-y-5">
        {experience.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Experience</h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-[1fr,auto] gap-x-6">
                  <div>
                    <p className="font-medium">{exp.title} <span className="text-gray-400 font-normal">at</span> {exp.company}</p>
                    {exp.location && <p className="text-gray-400 text-xs">{exp.location}</p>}
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="flex gap-2 text-gray-600">
                            <span className="text-gray-300 shrink-0">—</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs text-right whitespace-nowrap">
                    {formatDate(exp.startDate)}<br />{exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Education</h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-[1fr,auto] gap-x-6">
                  <div>
                    <p className="font-medium">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="text-gray-500">{edu.institution}</p>
                    {(edu.gpa || edu.honors) && (
                      <p className="text-gray-400">{[edu.gpa && `GPA: ${edu.gpa}`, edu.honors].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs text-right whitespace-nowrap">
                    {formatDate(edu.startDate)}<br />{formatDate(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Skills</h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="space-y-1">
              {skills.map((skill) => (
                <div key={skill.id} className="flex gap-3">
                  {skill.category && <span className="text-gray-400 shrink-0 w-24 text-right">{skill.category}</span>}
                  <span className="text-gray-700">{skill.items.join(" · ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Projects</h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex gap-2 items-baseline">
                    <p className="font-medium">{proj.name}</p>
                    {proj.url && <span className="text-gray-400 text-xs">{proj.url}</span>}
                  </div>
                  {proj.technologies.length > 0 && <p className="text-gray-400 text-xs">{proj.technologies.join(" · ")}</p>}
                  {proj.description && <p className="text-gray-600">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
