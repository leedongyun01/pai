import { ResearchSession } from '../types/session';
import { createClient } from '../supabase/server';

/**
 * Maps a database row to a ResearchSession object
 */
function mapDbToSession(db: any): ResearchSession {
  const context = db.context || {};
  return {
    id: db.id,
    userId: db.user_id,
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
    tavilyAnswer: context.tavilyAnswer,
    error: context.error,
    feedbackHistory: context.feedbackHistory
  };
}

export async function saveSession(session: ResearchSession): Promise<void> {
  // We can only save to DB if userId is present due to RLS and schema
  if (!session.userId) {
    console.warn('Attempted to save session without userId in Vercel environment. This session will be ephemeral.');
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from('research_sessions').upsert({
    id: session.id,
    user_id: session.userId,
    topic: session.query,
    status: session.status,
    context: {
      plan: session.plan,
      results: session.results,
      report: session.report,
      feedbackHistory: session.feedbackHistory,
      visualizations: session.visualizations,
      tavilyAnswer: session.tavilyAnswer,
      mode: session.mode,
      autoPilot: session.autoPilot,
      error: session.error
    },
    updated_at: new Date().toISOString()
  });

  if (error) {
    console.error('Failed to sync session to DB:', error);
    throw new Error(`Database sync failed: ${error.message}`);
  }
}

export async function getSession(id: string): Promise<ResearchSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('research_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbToSession(data);
}

export async function listSessions(): Promise<ResearchSession[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('research_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapDbToSession);
}

export async function deleteSession(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('research_sessions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete session from DB:', error);
    throw new Error(`Database delete failed: ${error.message}`);
  }
}