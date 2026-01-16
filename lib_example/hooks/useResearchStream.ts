import { useState, useEffect } from 'react';
import { SourceCitation } from '@/lib/schema/research';

interface ResearchData {
  report?: string;
  status?: string;
  mode?: string;
  currentStep?: number;
  plan?: string[];
  citations?: SourceCitation[];
  [key: string]: unknown;
}

export function useResearchStream(sessionId: string | null) {
  const [data, setData] = useState<ResearchData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const params = new URLSearchParams(window.location.search);
    const eventSource = new EventSource(`/api/research/${sessionId}/stream?${params.toString()}`);

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData.error) {
          setError(parsedData.error);
          eventSource.close();
        } else {
          setData(parsedData);
          // If the research is done, close the connection to prevent loops
          if (parsedData.report || parsedData.status === "completed") {
            eventSource.close();
          }
        }
      } catch (err) {
        console.error("Failed to parse stream data:", err);
      }
    };

    eventSource.onerror = (err) => {
      // If we already have a report or it's completed, just close.
      if (data?.report || data?.status === "completed") {
        eventSource.close();
        return;
      }
      
      // If no data and an error occurs, it might be a real connection issue.
      // But don't close immediately to let EventSource's internal retry work.
      console.warn("EventSource connection issue, waiting for retry...", err);
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId, data?.report, data?.status]);

  return { data, error };
}
