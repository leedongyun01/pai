import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/orchestrator';
import { createClient } from '@/lib/supabase/server';
import { ResearchSession } from '@/lib/types/session';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Fetch from DB only
      const { data: dbSessions, error } = await supabase
        .from('research_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedDbSessions: ResearchSession[] = (dbSessions || []).map(db => {
        const context = db.context || {};
        return {
          id: db.id,
          query: db.topic,
          status: db.status as any,
          createdAt: db.created_at,
          updatedAt: db.updated_at,
          mode: context.mode || 'quick_scan',
          autoPilot: context.autoPilot ?? true,
          plan: context.plan,
          results: context.results,
          report: context.report,
          visualizations: context.visualizations,
          error: context.error,
          feedbackHistory: context.feedbackHistory
        };
      });

      return NextResponse.json(mappedDbSessions);
    }

    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  } catch (error) {
    console.error('Failed to list sessions:', error);
    return NextResponse.json(
      { error: 'Failed to list sessions' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query, autoPilot, mode } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Passing userId ensures it's saved to DB via saveSession sync logic
    const session = await createSession(query, { 
      autoPilot, 
      mode, 
      userId: user?.id 
    });
    
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
