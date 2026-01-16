# Data Model: Citation-Aware Synthesizer

## Entities

### 1. Source (External/Input)
Already defined in Research Engine.
- `id`: string (uuid or hash)
- `url`: string
- `title`: string
- `content`: string
- `snippet`: string (optional)

### 2. Report (Output)
The final synthesized document.
- `id`: string
- `sessionId`: string
- `title`: string
- `sections`: ReportSection[]
- `references`: Source[]
- `metadata`: {
    `generatedAt`: ISO8601,
    `model`: string,
    `tokenUsage`: number
  }

### 3. ReportSection
- `title`: string
- `content`: string (Markdown)
- `citations`: string[] (Array of Source IDs)
- `subsections`: ReportSection[] (Recursive)
- `conflicts`: Conflict[]

### 4. Conflict
- `topic`: string
- `description`: string
- `competingClaims`: {
    `claim`: string,
    `sourceIds`: string[]
  }[]

## Relationships
- **Report** contains many **ReportSections**.
- **ReportSection** references many **Sources** via citations.
- **Report** references all **Sources** used in its creation.

## Validation Rules
- Every `sourceId` in a `Citation` must exist in the `Report.references` list.
- A `Report` must contain exactly three top-level sections if strictly following the PRD (Overview, Body, Conclusion), though hierarchical structures are supported within Body.
