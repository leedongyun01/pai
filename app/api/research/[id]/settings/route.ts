import { NextRequest, NextResponse } from 'next/server';
import { updateSessionSettings } from '@/lib/orchestrator';
import { SessionSettingsSchema } from '@/lib/agents/schemas';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const validated = SessionSettingsSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid settings' }, { status: 400 });
    }

    const session = await updateSessionSettings(id, validated.data);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
