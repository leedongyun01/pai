'use client';

import { useState, useEffect } from 'react';
import { ResearchSession } from '@/lib/types/session';

export default function Home() {
  const [query, setQuery] = useState('');
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [activeSession, setActiveSession] = useState<ResearchSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [globalAutoPilot, setGlobalAutoPilot] = useState(false);

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
        body: JSON.stringify({ query, autoPilot: globalAutoPilot }),
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
      const res = await fetch(`/api/research/${id}/approve`, {
        method: 'POST',
      });
      const data = await res.json();
      setActiveSession(data);
      fetchSessions();
    } catch (error) {
      alert('Failed to approve plan');
    }
  };

  const submitFeedback = async (id: string) => {
    if (!feedback.trim()) return;
    
    if (isDirty && !confirm('Regenerating will overwrite your manual edits. Continue?')) {
      return;
    }

    setIsRegenerating(true);
    try {
      const res = await fetch(`/api/research/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      });
      const data = await res.json();
      setActiveSession(data);
      setFeedback('');
      setIsDirty(false);
    } catch (error) {
      alert('Failed to regenerate plan');
    } finally {
      setIsRegenerating(false);
    }
  };

  const rateRegeneration = (helpful: boolean) => {
    alert(`Thank you for your feedback! Rating: ${helpful ? '👍' : '👎'}`);
    // In a real app, we would send this to the API
  };

  const toggleAutoPilot = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/research/${id}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoPilot: !current }),
      });
      const data = await res.json();
      setActiveSession(data);
    } catch (error) {
      alert('Failed to update settings');
    }
  };

  const removeStep = async (id: string, stepId: string) => {
    if (!activeSession?.plan) return;
    const newSteps = activeSession.plan.steps.filter(s => s.id !== stepId);
    
    try {
      const res = await fetch(`/api/research/${id}/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps: newSteps }),
      });
      const data = await res.json();
      setActiveSession(data);
      setIsDirty(true);
    } catch (error) {
      alert('Failed to remove step');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight">ProbeAI</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Your autonomous research agent.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <span className="text-xs font-medium px-2">Default Auto-Pilot</span>
              <button
                onClick={() => setGlobalAutoPilot(!globalAutoPilot)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  globalAutoPilot ? 'bg-green-600' : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  globalAutoPilot ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            {activeSession && (
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-medium px-2">Session Auto-Pilot</span>
                <button
                  onClick={() => toggleAutoPilot(activeSession.id, activeSession.autoPilot || false)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    activeSession.autoPilot ? 'bg-green-600' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    activeSession.autoPilot ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            )}
          </div>
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
                <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2 ${
                  activeSession.status === 'review_pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-zinc-100 dark:bg-zinc-800'
                }`}>
                  {activeSession.status.replace('_', ' ')}
                </span>
                <h2 className="text-xl font-semibold">{activeSession.query}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500">Mode: {activeSession.mode.replace('_', ' ')}</p>
              </div>
            </div>

            {activeSession.status === 'clarification_requested' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 space-y-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <span>ℹ️</span> Clarification Requested
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  The agent needs more information to refine the research plan. Please provide more details below.
                </p>
                <div className="flex gap-2">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide additional details..."
                    className="flex-1 bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                  />
                  <button
                    onClick={() => submitFeedback(activeSession.id)}
                    disabled={isRegenerating || !feedback.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium self-end hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isRegenerating ? 'Sending...' : 'Send Clarification'}
                  </button>
                </div>
              </div>
            )}

            {activeSession.plan && activeSession.status !== 'clarification_requested' && (
              <div className="space-y-6">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl flex justify-between items-start">
                  <p className="text-sm italic text-zinc-600 dark:text-zinc-400">"{activeSession.plan.rationale}"</p>
                  {activeSession.feedbackHistory && activeSession.feedbackHistory.length > 0 && activeSession.status === 'review_pending' && (
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Helpful?</span>
                      <button onClick={() => rateRegeneration(true)} className="hover:scale-110 transition-transform">👍</button>
                      <button onClick={() => rateRegeneration(false)} className="hover:scale-110 transition-transform">👎</button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-zinc-700 dark:text-zinc-300">Research Plan:</h3>
                    {isDirty && <span className="text-[10px] text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded">Modified manually</span>}
                  </div>
                  {activeSession.plan.steps.map((step) => (
                    <div key={step.id} className="group flex gap-3 items-start p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg shadow-sm hover:border-zinc-300 transition-colors">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs flex items-center justify-center font-bold">
                        {step.id}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium capitalize">{step.type}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
                      </div>
                      {activeSession.status === 'review_pending' && (
                        <button
                          onClick={() => removeStep(activeSession.id, step.id)}
                          className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all p-1"
                          title="Remove step"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {activeSession.status === 'review_pending' && (
                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Feedback for Agent:</label>
                      <div className="flex gap-2">
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="e.g. Focus more on competitors, include price comparisons..."
                          className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500 outline-none resize-none h-20"
                          disabled={isRegenerating}
                        />
                        <button
                          onClick={() => submitFeedback(activeSession.id)}
                          disabled={isRegenerating || !feedback.trim()}
                          className="bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-medium self-end hover:bg-zinc-700 disabled:opacity-50"
                        >
                          {isRegenerating ? 'Regenerating...' : 'Update Plan'}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => approvePlan(activeSession.id)}
                        disabled={activeSession.plan.steps.length === 0}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        Approve & Start Research
                      </button>
                    </div>
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