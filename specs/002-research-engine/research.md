# Research: Research Engine Implementation

## Decision: Tavily Search & Extract API

### Rationale
Tavily provides specialized endpoints for AI researchers. The `/search` endpoint returns optimized results, and the recently introduced `/extract` endpoint specifically handles boilerplate removal, JavaScript rendering, and content cleaning. This directly fulfills FR-002 and FR-003.

### Alternatives Considered
- **Puppeteer/Playwright**: Rejected because of high resource consumption and the complexity of maintaining scrapers for diverse site structures.
- **Firecrawl**: A strong alternative, but Tavily is already specified in the requirements and provides a more integrated search+extract experience for this use case.

## Decision: Concurrency Management via `p-limit`

### Rationale
To fulfill FR-001 (Parallel execution with concurrency limit), `p-limit` is the industry-standard lightweight utility for Node.js to control the number of simultaneous outgoing requests. This prevents rate-limiting issues and manages memory effectively.

### Alternatives Considered
- **Promise.all() without limits**: Rejected as it could overwhelm the network or trigger API rate limits.
- **Worker Threads**: Rejected as overkill for I/O-bound tasks.

## Decision: Content Length Enforcement (Post-Extraction)

### Rationale
While Tavily cleans the content, some pages may still exceed context window limits. A simple truncation at 20,000 characters (FR-006) will be applied post-extraction to ensure downstream stability.

## Resolved Technical Context
- **Tavily SDK**: Use `@tavily/core` if available, otherwise use standard `fetch` to their REST API.
- **Concurrency**: Set default limit to 3-5 concurrent searches.
- **Extraction Depth**: Use `basic` depth by default for speed, upgrade to `advanced` only if content is missing.
