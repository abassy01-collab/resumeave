import Dexie, { type Table } from "dexie";
import type { ResumeData } from "./types";

class ResumeDB extends Dexie {
  resumes!: Table<ResumeData>;

  constructor() {
    super("resumeave");
    this.version(1).stores({ resumes: "id, updatedAt" });
  }
}

const db = new ResumeDB();

export async function listResumes(): Promise<ResumeData[]> {
  return db.resumes.orderBy("updatedAt").reverse().toArray();
}

export async function getResume(id: string): Promise<ResumeData | undefined> {
  return db.resumes.get(id);
}

export async function saveResume(resume: ResumeData): Promise<void> {
  await db.resumes.put({ ...resume, updatedAt: Date.now() });
}

export async function deleteResume(id: string): Promise<void> {
  await db.resumes.delete(id);
}
