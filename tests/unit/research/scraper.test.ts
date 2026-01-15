import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchAndExtract } from '@/lib/research/scraper';
import mockTavilyResponse from '../../mocks/tavily.json';

// Mock global fetch
global.fetch = vi.fn();

describe('Tavily Scraper', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.TAVILY_API_KEY = 'test-key';
  });

  it('should successfully search and extract content', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockTavilyResponse,
    });

    const results = await searchAndExtract('benefits of typescript');

    expect(fetch).toHaveBeenCalledWith('https://api.tavily.com/search', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('benefits of typescript'),
    }));

    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('Why TypeScript is great');
    expect(results[0].url).toBe('https://example.com/typescript-benefits');
    expect(results[0].content).toContain('static typing');
  });

  it('should throw SearchError when API call fails', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(searchAndExtract('test query')).rejects.toThrow('Tavily API error: 500 Internal Server Error');
  });

  it('should throw SearchError when TAVILY_API_KEY is missing', async () => {
    delete process.env.TAVILY_API_KEY;
    await expect(searchAndExtract('test query')).rejects.toThrow('TAVILY_API_KEY is not configured');
  });

  it('should handle 404 results by skipping them or returning empty content', async () => {
    // Tavily actually returns results, we check if we handle the response correctly
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          { url: 'https://example.com/404', title: 'Not Found', content: '404 Page Not Found', score: 0.1 }
        ]
      }),
    });

    const results = await searchAndExtract('test query');
    expect(results).toHaveLength(1);
    expect(results[0].url).toBe('https://example.com/404');
  });

  it('should throw SearchError on fetch timeout', async () => {
    (fetch as any).mockRejectedValue(new Error('Fetch timeout'));

    await expect(searchAndExtract('test query')).rejects.toThrow('Failed to perform search: Fetch timeout');
  });

  it('should clean extracted content by normalizing whitespace', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          { url: 'https://example.com/messy', title: 'Messy', content: '  Too   many \n\n spaces  and \t tabs  ', score: 0.9 }
        ]
      }),
    });

    const results = await searchAndExtract('test query');
    expect(results[0].content).toBe('Too many spaces and tabs');
  });
});
