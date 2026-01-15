import { describe, it, expect, vi } from 'vitest';
import { analyzeQuery } from '@/lib/agents/analyzer';

// Mock the AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn().mockResolvedValue({
    object: {
      mode: 'deep_probe',
      rationale: 'Complex technical topic detected.',
    },
  }),
}));

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn(),
}));

describe('Analyzer Agent', () => {
  it('should return a mode and rationale', async () => {
    const result = await analyzeQuery('What are the latest breakthroughs in quantum computing?');
    expect(result.mode).toBe('deep_probe');
    expect(result.rationale).toBeDefined();
  });
});
