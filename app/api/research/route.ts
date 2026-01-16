import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/orchestrator';
import { listSessions, deleteSession } from '@/lib/storage/session-store';
import { createClient } from '@/lib/supabase/server';
import { ResearchSession } from '@/lib/types/session';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 1. Migrate local sessions to DB if they exist
      const localSessions = await listSessions();
      for (const session of localSessions) {
        const { error } = await supabase.from('research_sessions').upsert({
          id: session.id,
          user_id: user.id,
          topic: session.query,
          status: session.status,
          context: {
            plan: session.plan,
            results: session.results,
            report: session.report,
            visualizations: (session as any).visualizations,
            mode: session.mode,
            autoPilot: session.autoPilot,
            error: session.error,
            feedbackHistory: (session as any).feedbackHistory
          },
          updated_at: new Date().toISOString()
        });

        if (!error) {
          // 2. Delete local file after successful migration
          await deleteSession(session.id);
        } else {
          console.error(`Failed to migrate session ${session.id}:`, error);
        }
      }

      // 3. Fetch from DB only
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

    // If not logged in, return local sessions as usual
    const sessions = await listSessions();
    return NextResponse.json(sessions);
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

    // createSession already calls saveSession, which now handles DB sync
    const session = await createSession(query, { autoPilot, mode });
    
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
