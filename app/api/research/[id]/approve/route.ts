import { NextRequest, NextResponse } from 'next/server';
import { approvePlan } from '@/lib/orchestrator';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await approvePlan(id);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to approve plan' },
      { status: 500 }
    );
  }
}
