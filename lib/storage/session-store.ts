import fs from 'fs/promises';
import path from 'path';
import { ResearchSession } from '../types/session';

const STORAGE_DIR = path.join(process.cwd(), '.data', 'sessions');

export async function saveSession(session: ResearchSession): Promise<void> {
  const filePath = path.join(STORAGE_DIR, `${session.id}.json`);
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(session, null, 2), 'utf-8');
}

export async function getSession(id: string): Promise<ResearchSession | null> {
  const filePath = path.join(STORAGE_DIR, `${id}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as ResearchSession;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export async function listSessions(): Promise<ResearchSession[]> {
  try {
    const files = await fs.readdir(STORAGE_DIR);
    const sessions: ResearchSession[] = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const data = await fs.readFile(path.join(STORAGE_DIR, file), 'utf-8');
        sessions.push(JSON.parse(data) as ResearchSession);
      }
    }
    return sessions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function deleteSession(id: string): Promise<void> {
  const filePath = path.join(STORAGE_DIR, `${id}.json`);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}
