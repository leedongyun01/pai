# Visualization Module Interface

```typescript
export type VisualizationType = 'mermaid' | 'table';

export interface CitationMap {
  label: string;
  sourceId: string;
  index: number;
}

export interface VisualizationObject {
  id: string;
  type: VisualizationType;
  chartType?: string;
  rawData: any;
  code: string;
  citations: CitationMap[];
  caption: string;
  confidence: number;
}

/**
 * Core interface for the Adaptive Visualization System
 */
export interface IVisualizer {
  /**
   * Analyzes text for visualization candidates and generates them.
   * @param text The synthesized report text.
   * @returns A list of visualization objects to be embedded.
   */
  process(text: string): Promise<VisualizationObject[]>;

  /**
   * Validates Mermaid syntax.
   * @param code The mermaid DSL string.
   */
  validate(code: string): { valid: boolean; error?: string };
}
```
