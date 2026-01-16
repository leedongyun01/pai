# Feature Specification: Citation-Aware Synthesizer

**Feature Branch**: `003-citation-aware-synthesizer`  
**Created**: 2026-01-15  
**Status**: Draft  
**Input**: User description: "Citation-Aware Synthesizer (Synthesizer) - 수집된 파편 정보를 종합하여 보고서를 작성하되, 제2원칙(Verifiable Reliability)에 따라 정확한 출처(Citation)를 매핑하는 엔진입니다. 할루시네이션 방지 대책이 포함되어야 합니다."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Fact-Based Structured Report (Priority: P1)

As a user, I want the system to synthesize research results into a structured report so that I can quickly understand the findings without reading through all individual sources.

**Why this priority**: This is the core value proposition of the synthesizer—turning raw data into a useful, structured document.

**Independent Test**: Can be tested by providing a set of research snippets and verifying if the system outputs a structured report with an overview, body, and conclusion.

**Acceptance Scenarios**:

1. **Given** a collection of research snippets, **When** the synthesis engine is triggered, **Then** a report with three sections (Overview, Body, Conclusion) is generated.
2. **Given** fragmented data from different websites, **When** synthesizing, **Then** the engine groups related facts into logical subsections.

---

### User Story 2 - Verifiable Citations (Priority: P1)

As a user, I want every claim in the report to be linked to its source so that I can verify the information and trust the system's reliability.

**Why this priority**: Aligns with the "Verifiable Reliability" principle. Citations are essential to prevent hallucinations and provide transparency.

**Independent Test**: Can be tested by checking if every factual statement in the generated report has an inline citation marker that corresponds to a source in the reference list.

**Acceptance Scenarios**:

1. **Given** a generated report, **When** reviewing a claim, **Then** an inline citation (e.g., [1]) is present next to the claim.
2. **Given** an inline citation marker, **When** checking the bibliography, **Then** the marker maps correctly to the original source URL or title.

---

### User Story 3 - Conflict Resolution & Fact-Checking (Priority: P2)

As a user, I want the system to identify and handle conflicting information from different sources so that I am not misled by inconsistent data.

**Why this priority**: Crucial for hallucination prevention and ensuring high-quality, reliable output.

**Independent Test**: Can be tested by providing two conflicting sources (e.g., source A says "X is true", source B says "X is false") and verifying if the system either resolves the conflict or flags it as an inconsistency.

**Acceptance Scenarios**:

1. **Given** conflicting information from multiple sources, **When** synthesizing, **Then** the system notes the discrepancy instead of making a potentially false definitive claim.
2. **Given** highly reliable vs. less reliable sources, **When** cross-verifying, **Then** the system prioritizes information from the more credible source.

---

### Edge Cases

- **No Data**: What happens when no relevant information was found during research? (The system should state that no sufficient information was found instead of generating a generic or hallucinated report).
- **Broken Links**: How does the system handle sources that are no longer accessible? (Citations should still show the title/metadata even if the live link is down).
- **Ambiguous Data**: How does the system handle data that is too vague to form a definitive claim? (It should use cautious language like "Sources suggest..." or "It is unclear whether...").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST synthesize raw research data into a coherent, structured report (Overview, Body, Conclusion).
- **FR-002**: System MUST generate inline citations for all factual claims made in the report.
- **FR-003**: System MUST include a comprehensive bibliography/reference list at the end of the report.
- **FR-004**: System MUST perform cross-verification across multiple sources to validate claims before inclusion.
- **FR-005**: System MUST detect and explicitly report conflicting information from sources.
- **FR-006**: System MUST use a hallucination-prevention logic that prevents making claims not supported by the input data.
- **FR-007**: System MUST support hierarchical structuring within the report body (e.g., nested subsections).
- **FR-008**: In 'Quick Scan' (Fast Search) mode, the system MUST use Tavily's generated answer directly, bypassing the full synthesis pipeline.
- **FR-009**: In 'Deep Probe' (Deep Research) mode, the system MUST use Gemini for citation-aware synthesis and conflict resolution.

### Key Entities *(include if feature involves data)*

- **Report**: The final structured document delivered to the user.
- **Source**: An original document or snippet retrieved during the research phase (contains URL, title, and content).
- **Claim**: A specific statement of fact extracted or synthesized from one or more sources.
- **Citation**: A mapping between a Claim and its originating Source(s).
- **Conflict**: A state where two or more Sources provide contradictory information regarding a specific topic.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of factual claims in the generated report MUST have at least one associated inline citation.
- **SC-002**: 100% of inline citations MUST correctly map to a source in the reference list.
- **SC-003**: Synthesis completion time SHOULD be under 30 seconds for reports based on up to 20 sources.
- **SC-004**: Generated reports MUST follow the specified structure (Overview, Body, Conclusion) in 100% of successful runs.
- **SC-005**: Zero instances of "hallucinated" claims (claims with no supporting data in the input sources) during verification tests.
