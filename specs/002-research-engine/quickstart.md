# Quickstart: Research Engine

## Prerequisites
- Node.js 18+
- Tavily API Key (set in `.env.local` as `TAVILY_API_KEY`)

## Integration

### 1. Execute Research
Trigger the research process via the API:

```bash
curl -X POST http://localhost:3000/api/research/{session_id}/execute
```

### 2. Poll Results
Get extracted content and metadata:

```bash
curl http://localhost:3000/api/research/{session_id}
```

## Internal Usage
Using the engine directly in code:

```typescript
import { ResearchEngine } from '@/lib/research/engine';

const engine = new ResearchEngine({ apiKey: process.env.TAVILY_API_KEY });
const results = await engine.performResearch(['next.js 16 features', 'ai sdk best practices']);
```

## Testing
Run unit tests for the researcher:

```bash
npx vitest tests/unit/researcher.test.ts
```
