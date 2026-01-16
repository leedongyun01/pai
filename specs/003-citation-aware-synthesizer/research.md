# Research: Citation-Aware Synthesizer

## Unknowns & Clarifications

| ID | Unknown | Context | Status |
|---|---|---|---|
| RES-001 | Citation Extraction Pattern | How to reliably extract and map citations from LLM output? | RESOLVED |
| RES-002 | Conflict Detection Logic | How to detect and report conflicting information from sources? | RESOLVED |
| RES-003 | Hallucination Prevention | What prompting techniques best ensure zero-hallucination? | RESOLVED |

## Findings

### RES-001: Citation Extraction Pattern
**Decision**: Use `zod` schema with `generateObject` or `streamObject` from Vercel AI SDK to force structured output where each paragraph or claim is an object with an array of source IDs.
**Rationale**: Traditional RegEx parsing of [1], [2] is fragile. Structured output ensures the LLM explicitly maps data to IDs during generation.
**Alternatives**: Markdown parsing with post-process mapping (rejected as too complex/unreliable).

### RES-002: Conflict Detection Logic
**Decision**: Two-pass synthesis. 
1. Pass 1: "Fact Extraction" where the LLM identifies key facts and their sources.
2. Pass 2: "Consistency Check" where a separate prompt (or a specific instruction in the structured output) looks for multiple sources for the same fact and flags discrepancies.
**Rationale**: LLMs are better at spotting conflicts when explicitly told to compare specific claims.
**Alternatives**: Single-pass with "think" step (evaluated, may be less reliable but faster; will use for Quick Scan).

### RES-003: Hallucination Prevention
**Decision**: 
1. "Grounding" prompt: "Use ONLY the provided context. If information is missing, say 'Information not found'."
2. Source ID validation: Post-process to ensure all referenced IDs exist in the input set.
**Rationale**: Standard RAG best practices.

## Best Practices
- **Vercel AI SDK**: Use `generateObject` for the final report to ensure the structure (Overview, Body, Conclusion) is strictly followed.
- **Prompting**: Use XML-like tags for context to help the LLM distinguish between sources.
