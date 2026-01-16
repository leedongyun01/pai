import { describe, it, expect, vi } from 'vitest';
import { generatePlan } from '@/lib/agents/planner';

// Mock the AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn().mockResolvedValue({
    object: {
      rationale: 'Deep probe required for complex query.',
      steps: [
        { id: '1', type: 'search', description: 'Search for X', searchQueries: ['X query'] },
        { id: '2', type: 'analyze', description: 'Analyze results' },
      ],
    },
  }),
}));

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn(),
}));

describe('Planner Agent', () => {
  it('should return a plan with rationale and steps', async () => {
    const result = await generatePlan('Test query', 'deep_probe');
    expect(result.rationale).toBeDefined();
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.steps[0].type).toBe('search');
  });
});
