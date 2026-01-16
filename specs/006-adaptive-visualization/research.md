# Research: 006-adaptive-visualization

## Research Tasks

### 1. Reliable Pattern Extraction
- **Goal**: How to extract numerical trends and chronological events from text using LLM without hallucinations.
- **Decision**: Use a multi-pass approach. Pass 1: Extract raw data points and citations into a JSON structure. Pass 2: Select visualization type based on data structure. Pass 3: Generate Mermaid code.
- **Rationale**: Decoupling extraction from generation reduces the chance of syntax errors and allows for better validation of the "raw data" before committing to a chart.

### 2. Mermaid.js Sanitization & Validation
- **Goal**: Prevent broken charts due to special characters or invalid syntax.
- **Decision**: Implement a `MermaidSanitizer` utility that escapes brackets `[]`, parentheses `()`, and quotes `"` in node labels. Use a lightweight parser (or a trial-render logic) to validate syntax.
- **Rationale**: Mermaid is sensitive to punctuation in labels. Citations like `[1]` can break node definitions if not handled.

### 3. Integration with Synthesizer
- **Goal**: Where to hook the Visualizer in the pipeline.
- **Decision**: Post-Synthesis Hook. After the report is generated but before it's finalized, scan the text for visualization candidates.
- **Rationale**: Allows the Visualizer to work on the cohesive final text, ensuring visual consistency with the narrative.

### 4. Client-side vs Server-side Rendering
- **Goal**: Where to render the Mermaid charts.
- **Decision**: Client-side rendering using `@mermaid-js/mermaid`.
- **Rationale**: Next.js App Router components can dynamically import Mermaid to avoid bloat in the main bundle. Server-side rendering for Mermaid is complex and often requires a headless browser.

## Findings & Best Practices

- **Thresholds**: Stick to FR-008 (max 20 data points). Beyond that, SVG charts become unreadable on mobile.
- **Theme**: Use `theme: 'base'` with manual CSS overrides to match ProbeAI's design system.
- **Citations**: Map citations to a "Source Notes" or "Caption" section immediately below the chart, as Mermaid doesn't natively support robust interactive tooltips in static exports easily.

## Alternatives Considered

- **Chart.js / Recharts**: Rejected because they require more complex configuration and don't support Flowcharts/Gantt charts as naturally as Mermaid's DSL.
- **Pure Markdown Tables for everything**: Rejected per Principle III (Adaptive Visualization) which demands more engaging visual formats.
