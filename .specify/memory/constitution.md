<!--
Sync Impact Report:
- Version change: New (1.0.0)
- List of modified principles: Defined Principles I-V (Autonomous Execution, Verifiable Reliability, Adaptive Visualization, Dual-Mode Operation, Human-in-the-Loop).
- Added sections: Technology Standards, Development Workflow.
- Removed sections: N/A.
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ Generic enough to support new principles)
  - .specify/templates/spec-template.md (✅ Generic enough)
  - .specify/templates/tasks-template.md (✅ Generic enough)
- Follow-up TODOs: None.
-->

# ProbeAI Constitution
<!-- ProbeAI: AI-Powered Deep Research Portal -->

## Core Principles

### I. Autonomous Execution
The system must be capable of performing end-to-end research tasks—planning, browsing, analyzing, and writing—with minimal user intervention. Automation is the default; manual overrides are exceptions.

### II. Verifiable Reliability
All generated information must be backed by verifiable sources. Every fact or claim in the final report must include a citation linking to the origin. Hallucination is a critical failure.

### III. Adaptive Visualization
Information should not just be text. The system must actively identify numerical trends or structural data and automatically render them as Mermaid.js charts or Markdown tables to maximize readability.

### IV. Dual-Mode Operation
The architecture must support two distinct operational modes: 'Quick Scan' for rapid, breadth-first summaries and 'Deep Probe' for depth-first, multi-step reasoning and cross-verification.

### V. Human-in-the-Loop
While autonomy is key, the system must support an optional 'Plan Confirmation' mode. Users must have the ability to review and approve the agent's research plan before execution proceeds.

## Technology Standards

### Core Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS.
- **Visualization**: Mermaid.js, Markdown.
- **Agent Logic**: (To be defined - likely Python/Node.js based on implementation needs).

### Data Integrity
- All external data fetching must be logged with source URLs and access timestamps.
- Reports must be immutable after generation unless explicitly regenerated.

## Development Workflow

### Quality Gates
- **Citation Check**: Automated tests must verify that report outputs contain valid citation formats.
- **Visualization Check**: Tests must ensure Mermaid syntax generated is valid and renderable.

### Review Process
- Code changes affecting the "Researcher" or "Synthesizer" modules require comprehensive regression testing to ensure citation accuracy is not degraded.

## Governance

### Amendments
- This constitution allows for amendments. Changes to Core Principles (I-V) require a Major version bump.
- Clarifications or non-functional changes require a Patch version bump.

### Compliance
- All new feature specifications must explicitly state how they adhere to Principle II (Verifiable Reliability).
- Architecture decisions must always evaluate the trade-off between Autonomy (I) and Control (V).

**Version**: 1.0.0 | **Ratified**: 2026-01-15 | **Last Amended**: 2026-01-15