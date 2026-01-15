import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/orchestrator';
import { listSessions } from '@/lib/storage/session-store';

export async function GET() {
  try {
    const sessions = await listSessions();
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list sessions' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const session = await createSession(query);
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
