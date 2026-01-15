'use client';

import { useState, useEffect } from 'react';
import { ResearchSession } from '@/lib/types/session';

export default function Home() {
  const [query, setQuery] = useState('');
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [activeSession, setActiveSession] = useState<ResearchSession | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/research');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSessions(data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const startResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setActiveSession(data);
      setQuery('');
      fetchSessions();
    } catch (error) {
      alert('Failed to start research');
    } finally {
      setLoading(false);
    }
  };

  const approvePlan = async (id: string) => {
    try {
      const res = await fetch(`/api/research/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      const data = await res.json();
      setActiveSession(data);
      fetchSessions();
    } catch (error) {
      alert('Failed to approve plan');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">ProbeAI</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Your autonomous research agent.</p>
        </header>

        {/* Input Section */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <form onSubmit={startResearch} className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to research today?"
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-zinc-500 outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Research'}
            </button>
          </form>
        </section>

        {/* Active Session / Result */}
        {activeSession && (
          <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="inline-block px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 mb-2">
                  {activeSession.status}
                </span>
                <h2 className="text-xl font-semibold">{activeSession.query}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500">Mode: {activeSession.mode.replace('_', ' ')}</p>
              </div>
            </div>

            {activeSession.plan && (
              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                  <p className="text-sm italic text-zinc-600 dark:text-zinc-400">"{activeSession.plan.rationale}"</p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-zinc-700 dark:text-zinc-300">Research Plan:</h3>
                  {activeSession.plan.steps.map((step) => (
                    <div key={step.id} className="flex gap-3 items-start p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg shadow-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs flex items-center justify-center font-bold">
                        {step.id}
                      </span>
                      <div>
                        <p className="text-sm font-medium capitalize">{step.type}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {activeSession.status === 'review_pending' && (
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => approvePlan(activeSession.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-medium transition-colors"
                    >
                      Approve & Execute
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* History */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Recent Sessions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessions.length === 0 ? (
              <p className="text-zinc-500 text-sm">No recent sessions found.</p>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSession(s)}
                  className="text-left p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      s.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {s.status}
                    </span>
                    <span className="text-[10px] text-zinc-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-medium truncate group-hover:text-clip group-hover:whitespace-normal">{s.query}</p>
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}