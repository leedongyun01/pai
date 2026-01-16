# Adaptive Visualization System

The Adaptive Visualization System (Visualizer) is a core module of ProbeAI that enhances research reports by injecting contextual visual aids.

## Key Features

- **Pattern Detection**: Uses LLM-powered multi-pass analysis to identify numerical trends, chronological sequences, and entity comparisons.
- **Smart Formatting**: 
  - Automatically selects the best chart type (Bar, Line, Pie, Flowchart, etc.).
  - Falls back to Markdown Tables for complex data (> 20 points) or if syntax validation fails.
- **Verifiable Data**: Every data point is linked to source citations via a `CitationMap`.
- **Branding**: Integrated with ProbeAI's design system using custom Mermaid.js themes.

## Technical Architecture

The module is implemented in `lib/research/visualizer.ts` and uses:
- **Vercel AI SDK**: For pattern extraction and code generation.
- **Mermaid.js**: For rendering charts in the frontend.
- **Zod**: For strict validation of visualization objects.

## Constraints & Limits

- **Max Visualizations**: Limited to 3 per section to maintain readability.
- **Confidence Threshold**: Only visualizations with a confidence score > 0.8 are generated.
- **Complexity Gate**: Charts with more than 20 data points are automatically converted to Tables.

## Integration

The Visualizer is designed to be called post-synthesis:

```typescript
const visualizer = new Visualizer();
const visualizations = await visualizer.process(sectionContent);
```
