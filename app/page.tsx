'use client';

import { useState, useEffect } from 'react';
import { ResearchSession } from '@/lib/types/session';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'quick_scan' | 'deep_probe'>('quick_scan');
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [activeSession, setActiveSession] = useState<ResearchSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/research');
      if (res.status === 401) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setSessions(data);
      }
    } catch (error) {
      console.error('세션 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const startResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (!user) {
      if (confirm('리서치를 시작하려면 로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
        router.push('/login');
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '리서치 시작에 실패했습니다.');
      }
      
      const data = await res.json();
      setActiveSession(data);
      setQuery('');
      fetchSessions();
    } catch (error) {
      alert((error as Error).message);
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
      alert('계획 승인에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">ProbeAI</h1>
          <p className="text-zinc-600 dark:text-zinc-400">자율형 AI 리서치 에이전트. 데이터를 시각화하고 검증합니다.</p>
        </header>

        {/* Input Section */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-4">
          <form onSubmit={startResearch} className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="오늘 어떤 주제를 조사해볼까요?"
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-zinc-500 outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? '분석 중...' : '시작하기'}
            </button>
          </form>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setMode('quick_scan')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${mode === 'quick_scan' 
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent' 
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              ⚡ 퀵 스캔 (자동)
            </button>
            <button 
              onClick={() => setMode('deep_probe')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${mode === 'deep_probe' 
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent' 
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              🔍 딥 프로브 (계획 검토)
            </button>
          </div>
        </section>

        {/* Active Session / Result */}
        {activeSession && (
          <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${activeSession.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {translateStatus(activeSession.status)}
                </span>
                <h2 className="text-xl font-semibold">{activeSession.query}</h2>
              </div>
            </div>

            {/* Plan Review (Only for Deep Probe when pending) */}
            {activeSession.status === 'review_pending' && activeSession.plan && (
              <div className="space-y-6">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                  <p className="text-sm italic text-zinc-600 dark:text-zinc-400">"{activeSession.plan.rationale}"</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">리서치 단계:</h3>
                  {activeSession.plan.steps.map((step) => (
                    <div key={step.id} className="flex gap-3 items-start p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-xs flex items-center justify-center font-bold">
                        {step.id}
                      </span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => approvePlan(activeSession.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  계획 승인 및 리서치 시작
                </button>
              </div>
            )}

            {/* Execution Progress */}
            {activeSession.status === 'executing' && (
              <div className="flex flex-col items-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
                <p className="text-sm text-zinc-500">웹 검색 및 콘텐츠 추출, 보고서 합성 중...</p>
              </div>
            )}

            {/* FINAL REPORT */}
            {activeSession.status === 'completed' && activeSession.report && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="prose dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-4">{activeSession.report.title}</h1>
                  
                  {activeSession.report.sections.map((section: any, idx: number) => (
                    <div key={idx} className="mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-8 last:border-0">
                      <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                      <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </div>

                      {/* Visualizations for this section */}
                      {(activeSession as any).visualizations?.filter((v: any) => v.sectionTitle === section.title).map((v: any, vIdx: number) => (
                        <div key={vIdx} className="my-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                          {v.type === 'table' ? (
                            <div className="overflow-x-auto text-sm" dangerouslySetInnerHTML={{ __html: formatTable(v.code) }} />
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="text-xs text-zinc-400 mb-2">차트 (Mermaid): {v.chartType}</div>
                              <pre className="text-[10px] text-zinc-500 overflow-x-auto w-full">{v.code}</pre>
                            </div>
                          )}
                          <div className="mt-2 text-center text-xs font-medium text-zinc-500 italic">{v.caption}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* References */}
                <div className="pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-lg font-bold mb-4">출처</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {activeSession.results?.map((res, idx) => (
                      <a 
                        key={idx} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 transition-colors flex justify-between items-center group"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate max-w-md">{res.title}</span>
                          <span className="text-[10px] text-zinc-500 truncate max-w-sm">{res.url}</span>
                        </div>
                        <span className="text-xs text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* History */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">최근 리서치 목록</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSession(s)}
                className={`text-left p-4 bg-white dark:bg-zinc-900 border rounded-xl transition-all shadow-sm ${activeSession?.id === s.id ? 'border-zinc-900 dark:border-zinc-100 ring-1 ring-zinc-900' : 'border-zinc-200 dark:border-zinc-800'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase">{translateStatus(s.status)}</span>
                  <span className="text-[10px] text-zinc-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="font-medium truncate">{s.query}</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function translateStatus(status: string) {
  const map: Record<string, string> = {
    'analyzing': '분석 중',
    'planning': '계획 수립 중',
    'review_pending': '검토 대기',
    'executing': '진행 중',
    'completed': '완료',
    'error': '오류',
    'clarification_requested': '추가 정보 요청'
  };
  return map[status] || status;
}

// Simple markdown table formatter
function formatTable(markdown: string) {
  const lines = markdown.trim().split('\n');
  if (lines.length < 2) return markdown;
  
  let html = '<table class="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">';
  
  lines.forEach((line, i) => {
    if (line.includes('---|')) return;
    const cells = line.split('|').filter(c => c.trim().length > 0 || line.startsWith('|') && line.endsWith('|')).map(c => c.trim());
    if (cells.length === 0) return;
    
    if (i === 0) {
      html += '<thead><tr>';
      cells.forEach(c => html += `<th class="px-3 py-2 text-left font-bold border-b border-zinc-200 dark:border-zinc-800">${c}</th>`);
      html += '</tr></thead><tbody>';
    } else {
      html += '<tr>';
      cells.forEach(c => html += `<td class="px-3 py-2 border-b border-zinc-100 dark:border-zinc-700">${c}</td>`);
      html += '</tr>';
    }
  });
  
  html += '</tbody></table>';
  return html;
}