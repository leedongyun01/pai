import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { saveSession, getSession, listSessions, deleteSession } from '@/lib/storage/session-store';
import { ResearchSession } from '@/lib/types/session';
import fs from 'fs/promises';
import path from 'path';

describe('Session Store', () => {
  const testSession: ResearchSession = {
    id: 'test-uuid',
    query: 'test query',
    mode: 'quick_scan',
    status: 'idle',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    await deleteSession(testSession.id);
  });

  it('should save and retrieve a session', async () => {
    await saveSession(testSession);
    const retrieved = await getSession(testSession.id);
    expect(retrieved).toEqual(testSession);
  });

  it('should return null for non-existent session', async () => {
    const retrieved = await getSession('non-existent');
    expect(retrieved).toBeNull();
  });

  it('should list sessions', async () => {
    await saveSession(testSession);
    const sessions = await listSessions();
    expect(sessions.length).toBeGreaterThanOrEqual(1);
    expect(sessions.some(s => s.id === testSession.id)).toBe(true);
  });

  it('should delete a session', async () => {
    await saveSession(testSession);
    await deleteSession(testSession.id);
    const retrieved = await getSession(testSession.id);
    expect(retrieved).toBeNull();
  });
});
