# Feature Specification: Adaptive Visualization System (Visualizer)

**Feature Branch**: `006-adaptive-visualization`  
**Created**: 2026-01-15  
**Status**: Draft  
**Input**: User description: "Adaptive Visualization System (Visualizer): 텍스트 데이터 내에서 수치나 구조적 패턴을 감지하여 Mermaid.js 차트나 표로 변환하는 모듈입니다."

## Clarifications

### Session 2026-01-15
- Q: What is the maximum threshold for data points before the system forces a fallback to a Markdown Table or suppresses the visualization? → A: 20 data points.
- Q: Where should the visualizations be placed within the synthesized report? → A: Contextual (Inline after relevant text).
- Q: How should citations for individual data points within a Mermaid chart be displayed? → A: Map to Caption Footnotes.
- Q: How should the system behave if the Pattern Matcher identifies data with low confidence? → A: Suppress Visualization (maintain reliability).
- Q: Should the system use a standardized style for all charts? → A: Standardized (Consistent branding).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Data Structuring (Priority: P1)

As a researcher reading a Deep Probe report, I want to see complex numerical comparisons or chronological events automatically converted into charts so that I can understand the data trends at a glance without reading dense paragraphs.

**Why this priority**: This is the core value proposition of Principle III (Adaptive Visualization). It directly improves readability and distinguishes ProbeAI from standard LLM outputs.

**Independent Test**: Can be tested by providing a set of research snippets containing clear numerical trends (e.g., "Company A's revenue grew from $1M in 2020 to $5M in 2024") and verifying if a valid Bar chart or Line chart is generated.

**Acceptance Scenarios**:

1. **Given** a research summary containing a list of years and corresponding values, **When** the Synthesizer processes the data, **Then** a valid Mermaid.js Bar or Line chart code block is included in the report.
2. **Given** a sequence of events with "A leads to B which triggers C", **When** the pattern is detected, **Then** a Mermaid.js Flowchart is generated to represent the process.

---

### User Story 2 - Comparison Table Generation (Priority: P2)

As a user comparing multiple products or entities, I want the system to consolidate fragmented information into a structured Markdown table so that I can easily compare attributes side-by-side.

**Why this priority**: Tables are the most versatile visualization format for structural data that doesn't fit a specific chart type.

**Independent Test**: Provide text describing multiple entities with shared attributes (e.g., "Product X costs $50 and has feature A, while Product Y costs $60 and has feature B") and check if a correctly formatted Markdown table is produced.

**Acceptance Scenarios**:

1. **Given** research data about three different software tools and their pricing/features, **When** the system identifies the structural similarity, **Then** it generates a Markdown table with tools as rows and attributes as columns.

---

### User Story 3 - Visualization Refinement & Fallback (Priority: P3)

As a user, if a generated chart is too complex or potentially inaccurate, I want the system to provide a structured table as a fallback or alongside the chart so that I can still access the data in an organized way.

**Why this priority**: Ensures reliability and prevents "broken" UI if Mermaid rendering fails or the chart is too cluttered.

**Independent Test**: Provide highly complex or ambiguous data and verify if the system chooses a table over a chart or provides both.

**Acceptance Scenarios**:

1. **Given** data that is too complex for a simple Bar chart (e.g., 20+ data points), **When** the Visualizer evaluates the complexity, **Then** it defaults to a Markdown Table instead of an unreadable chart.

### Edge Cases

- **Invalid Data**: What happens when the text contains contradictory numbers for the same data point?
  - *Assumption*: The system should prioritize the source with higher authority or list the range/discrepancy in a table note.
- **Mermaid Syntax Limits**: How does the system handle characters that break Mermaid syntax (e.g., brackets in node names)?
  - *Assumption*: The Visualizer MUST sanitize strings and escape special characters before generating Mermaid code.
- **Mobile Responsiveness**: What happens if a wide table or chart is viewed on a narrow screen?
  - *Assumption*: UI should allow horizontal scrolling for tables and scale-to-fit for charts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST analyze synthesized text to detect "visualization-ready" patterns (numerical series, chronological sequences, entity comparisons, hierarchical structures).
- **FR-002**: System MUST select the most appropriate visualization type:
  - Numerical trends -> Bar/Line Chart.
  - Proportions -> Pie Chart.
  - Processes/Logic -> Flowchart.
  - Timelines -> Gantt Chart or Journey Map.
  - Tabular comparisons -> Markdown Table.
- **FR-003**: System MUST generate valid Mermaid.js syntax for all chart types.
- **FR-004**: System MUST ensure every data point in the visualization has a corresponding citation back to the source text/URL (linked via [Principle II]), mapped to footnotes in the chart caption.
- **FR-005**: System MUST validate the generated Mermaid code before including it in the final report to prevent rendering errors.
- **FR-006**: System MUST support a maximum of 3 visualizations per major report section to avoid overwhelming the user.
- **FR-007**: System MUST provide a "View Source Data" toggle to show the raw numbers used to build the visualization.
- **FR-008**: System MUST default to a Markdown Table if the extracted data points exceed 20 to ensure readability.
- **FR-009**: System MUST place visualizations contextually, immediately following the synthesized text block that contains the source data.
- **FR-010**: System MUST suppress visualization generation if the Pattern Matcher confidence score is below a defined threshold (default: 0.8) to prevent hallucinations.
- **FR-011**: System MUST use a standardized Mermaid theme (neutral/base) with ProbeAI primary colors to ensure visual consistency.

### Key Entities *(include if feature involves data)*

- **Visualization Object**: Represents a single chart or table.
  - Attributes: Type (Mermaid/Table), Raw Data, Generated Code, Source Citations, Caption.
- **Pattern Matcher**: Logic that identifies structural data in text.
  - Attributes: Pattern Type, Confidence Score, Extraction Rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of generated Mermaid.js code blocks are syntactically valid and render without errors in the Report Viewer.
- **SC-002**: Visualizations are generated for at least 80% of reports that contain 3+ distinct numerical data points or 4+ sequential events.
- **SC-003**: The time taken to generate visualizations adds no more than 15% overhead to the total synthesis time.
- **SC-004**: User testing shows that 90% of users find the "Adaptive Visualization" significantly more helpful than text-only summaries for data-heavy topics.