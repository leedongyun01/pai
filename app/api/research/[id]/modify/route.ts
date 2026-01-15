import { NextRequest, NextResponse } from 'next/server';
import { modifyPlan } from '@/lib/orchestrator';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { steps } = await req.json();

    if (!steps || !Array.isArray(steps)) {
      return NextResponse.json({ error: 'Steps array is required' }, { status: 400 });
    }

    const session = await modifyPlan(id, steps);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to modify plan' },
      { status: 500 }
    );
  }
}
