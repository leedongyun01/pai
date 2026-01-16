import { NextRequest, NextResponse } from 'next/server';
import { executeResearch } from '@/lib/orchestrator';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await executeResearch(id);
    return NextResponse.json(session);
  } catch (error) {
    console.error(`API Error in research execution:`, error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to execute research' }, 
      { status: 500 }
    );
  }
}
