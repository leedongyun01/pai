# Data Model: Adaptive Visualization System

## Entities

### `VisualizationObject`
Represents a single generated visualization (chart or table).

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (UUID). |
| `type` | `'mermaid' \| 'table'` | The rendering engine to use. |
| `chartType` | `string` | Specific Mermaid type (e.g., 'bar', 'flowchart', 'gantt'). |
| `rawData` | `any` | The extracted data points used for generation. |
| `code` | `string` | The valid Mermaid.js or Markdown Table string. |
| `citations` | `CitationMap[]` | Mapping of data points to source URLs/indices. |
| `caption` | `string` | Human-readable title or description. |
| `confidence` | `number` | Pattern matcher confidence score (0.0 - 1.0). |

### `CitationMap`
Maps a specific visual element or data point to its source.

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | The data point label or node name. |
| `sourceId` | `string` | Reference to the original research snippet/URL. |
| `index` | `number` | Footnote index for the caption. |

### `PatternMatcherResult`
Output of the detection logic.

| Field | Type | Description |
|-------|------|-------------|
| `candidates` | `TextFragment[]` | Segments of text identified as "visualization-ready". |
| `recommendedType` | `string` | The suggested chart/table type. |
| `extractedData` | `any` | Parsed structured data. |

## Relationships
- `SynthesizedReport` contains 0..N `VisualizationObject`s.
- `VisualizationObject` references 1..M `Source` entities (via `CitationMap`).

## Validation Rules
- **Confidence Gate**: If `confidence` < 0.8, the `VisualizationObject` is discarded (FR-010).
- **Complexity Gate**: If `rawData` length > 20, `type` MUST be `'table'` (FR-008).
- **Syntax Gate**: `code` MUST be validated against Mermaid schema (FR-005).
