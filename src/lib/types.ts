export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  honors: string;
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}

export type TemplateId = "modern" | "classic" | "minimal";

export interface ResumeData {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  template: TemplateId;
  personal: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export const defaultResume = (): ResumeData => ({
  id: crypto.randomUUID(),
  name: "My Resume",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  template: "modern",
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
});
