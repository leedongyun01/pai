import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/storage/session-store';
import { approvePlan } from '@/lib/orchestrator';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await getSession(id);
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve session' }, 
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { action } = await req.json();

    if (action !== 'approve') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const session = await approvePlan(id);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update session' }, 
      { status: 500 }
    );
  }
}
