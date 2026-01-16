import { NextRequest, NextResponse } from 'next/server';
import { submitFeedback } from '@/lib/orchestrator';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { feedback } = await req.json();

    if (!feedback || typeof feedback !== 'string') {
      return NextResponse.json({ error: 'Feedback is required' }, { status: 400 });
    }

    const session = await submitFeedback(id, feedback);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
