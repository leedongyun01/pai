# Data Model: Research Engine

## Entities

### ResearchSession (Extension of Core Session)
The Research Engine adds specific data to the existing session structure.

| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID of the session |
| mode | 'quick_scan' \| 'deep_probe' | The operational mode for this session |
| queries | SearchQuery[] | List of queries to be executed |
| results | ResearchResult[] | Aggregated results from all queries |
| status | 'pending' \| 'running' \| 'completed' \| 'failed' | Current state of research |

### SearchQuery
Represents a single query being processed.

| Field | Type | Description |
|-------|------|-------------|
| text | string | The actual search string |
| status | 'queued' \| 'searching' \| 'scraped' \| 'failed' | Status of this specific query |
| sourceCount | number | Number of unique sources found |

### ResearchResult
Represents a single extracted document.

| Field | Type | Description |
|-------|------|-------------|
| url | string | Source URL |
| title | string | Page title |
| content | string | Extracted and cleaned text (max 20k chars) |
| queryMatch | string | The query that led to this result |
| timestamp | string | ISO date of extraction |
| score | number | Relevance score from search engine |

## Relationships
- A **ResearchSession** has many **SearchQueries**.
- A **ResearchSession** has many **ResearchResults**.
- A **ResearchResult** is associated with one **SearchQuery** (the primary match).

## Validation Rules (Zod)
- `url`: Must be a valid absolute URL.
- `content`: Max length 20,000 characters.
- `text`: Min 3 characters, max 500 characters.
