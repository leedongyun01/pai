# ProbeAI Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-15

## Active Technologies

- **Language**: TypeScript 5.x (Next.js 16 environment)
- **Framework**: Next.js App Router (16.1.2), Tavily API (Search & Extract)
- **AI**: Vercel AI SDK (`ai`), `@ai-sdk/google` (Gemini)
- **Validation**: `zod`
- **Testing**: `vitest` (Proposed)
- **Storage**: Local Filesystem JSON

## Project Structure

```text
app/
├── api/
│   └── research/        # API Routes
└── ...

lib/
├── agents/              # AI Logic (analyzer, planner)
├── storage/             # Persistence
└── types/               # Shared types
```

## Commands

- `npm run dev` : Start development server
- `npx vitest` : Run tests (once configured)

## Code Style

- **TypeScript**: Strict mode enabled.
- **Naming**: camelCase for functions/vars, PascalCase for components/classes.
- **Async**: Use `async/await`.

## Recent Changes

- **001-core-agent-orchestration**: Implemented core orchestration, analysis/planning modules, and session state API.
- **002-research-engine**: Implemented autonomous Research Engine with Tavily integration, parallel execution, robust error handling, and content filtering.
- **003-citation-aware-synthesizer**: Designed citation-aware synthesis engine with hallucination prevention and multi-pass verification.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
