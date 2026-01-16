import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as orchestrator from '@/lib/orchestrator';
import * as sessionStore from '@/lib/storage/session-store';
import { GET, POST } from '@/app/api/research/route';
import { GET as GET_BY_ID } from '@/app/api/research/[id]/route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/orchestrator');
vi.mock('@/lib/storage/session-store');

describe('API Routes: /api/research', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('GET should list sessions', async () => {
    vi.mocked(sessionStore.listSessions).mockResolvedValue([
      { id: '1', query: 'test' } as any
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe('1');
  });

  it('POST should create a session', async () => {
    vi.mocked(orchestrator.createSession).mockResolvedValue({
      id: 'new-id',
      query: 'new query',
      status: 'analyzing'
    } as any);

    const req = new NextRequest('http://localhost/api/research', {
      method: 'POST',
      body: JSON.stringify({ query: 'new query' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe('new-id');
  });

  it('POST should return 400 if query is missing', async () => {
    const req = new NextRequest('http://localhost/api/research', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('GET should return 500 if listSessions fails', async () => {
    vi.mocked(sessionStore.listSessions).mockRejectedValue(new Error('DB Error'));
    const response = await GET();
    expect(response.status).toBe(500);
  });

  it('POST should return 500 if createSession fails', async () => {
    vi.mocked(orchestrator.createSession).mockRejectedValue(new Error('Creation failed'));
    const req = new NextRequest('http://localhost/api/research', {
      method: 'POST',
      body: JSON.stringify({ query: 'fail' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(500);
  });
});

describe('API Routes: /api/research/[id]', () => {
  it('GET should return session by id', async () => {
    vi.mocked(sessionStore.getSession).mockResolvedValue({
      id: 'session-123',
      query: 'test'
    } as any);

    const context = { params: Promise.resolve({ id: 'session-123' }) };
    const response = await GET_BY_ID({} as any, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('session-123');
  });

  it('GET should return 404 if session not found', async () => {
    vi.mocked(sessionStore.getSession).mockResolvedValue(null);

    const context = { params: Promise.resolve({ id: 'none' }) };
    const response = await GET_BY_ID({} as any, context);
    expect(response.status).toBe(404);
  });
});
