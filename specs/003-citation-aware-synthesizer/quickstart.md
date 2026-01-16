# Quickstart: Citation-Aware Synthesizer

## Prerequisites
- Node.js 20+
- Gemini API Key in `.env.local`
- Existing research session with data in `.data/sessions/`

## Running Synthesis
To trigger synthesis manually for a session:
```bash
curl -X POST http://localhost:3000/api/research/{session_id}/synthesize \
  -H "Content-Type: application/json" \
  -d '{"mode": "quick"}'
```

To trigger Deep Probe (conflict detection):
```bash
curl -X POST http://localhost:3000/api/research/{session_id}/synthesize \
  -H "Content-Type: application/json" \
  -d '{"mode": "deep"}'
```

## Testing
Run vitest for the synthesizer logic:
```bash
npx vitest tests/unit/research/synthesizer.test.ts
```

## Verification
1. Open the generated report JSON.
2. Verify `citations` array in each section.
3. Check that each ID in `citations` exists in `references`.

