import { NextRequest, NextResponse } from 'next/server';
import { Synthesizer } from '@/lib/research/synthesizer';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const synthesizer = new Synthesizer();
    const report = await synthesizer.synthesize(id);
    return NextResponse.json(report);
  } catch (error) {
    console.error(`API Error in report synthesis:`, error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to synthesize report' }, 
      { status: 500 }
    );
  }
}
