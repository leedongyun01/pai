# Quickstart: Adaptive Visualization (Visualizer)

## Overview
The Visualizer module automatically enhances research reports by injecting Mermaid.js charts or Markdown tables where numerical or structural patterns are detected.

## Usage

### 1. Installation
Ensure `mermaid` is installed in the frontend:
```bash
npm install mermaid
```

### 2. Integration with Synthesizer
The visualizer should be called after the synthesis step:

```typescript
import { Visualizer } from '@/lib/research/visualizer';

const report = await synthesizer.synthesize(data);
const visualizer = new Visualizer();
const visualizations = await visualizer.process(report.text);

// Final report assembly
const finalReport = {
  ...report,
  visualizations // These contain the code blocks to render
};
```

### 3. Frontend Rendering
Use a client-side component to render Mermaid:

```tsx
'use client';
import { useEffect } from 'react';
import mermaid from 'mermaid';

export function Chart({ code }: { code: string }) {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, []);

  return <div className="mermaid">{code}</div>;
}
```

## Testing
Run unit tests for the visualizer:
```bash
npx vitest tests/unit/research/visualizer.test.ts
```
