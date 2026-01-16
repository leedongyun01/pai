# Quickstart: Core Agent Orchestration

## Prerequisites
1.  **Environment Variables**:
    Create a `.env.local` file in the root:
    ```bash
    GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
    ```
2.  **Install Dependencies**:
    ```bash
    npm install ai @ai-sdk/google zod
    npm install -D vitest
    ```

## Running the API

1.  **Start the Server**:
    ```bash
    npm run dev
    ```

2.  **Create a Session (Manual Test)**:
    ```bash
    curl -X POST http://localhost:3000/api/research \
      -H "Content-Type: application/json" \
      -d '{"query": "Latest breakthroughs in fusion energy"}'
    ```

3.  **Check Status**:
    ```bash
    curl http://localhost:3000/api/research/<uuid-from-response>
    ```

4.  **Approve Plan (if in review_pending)**:
    ```bash
    curl -X PATCH http://localhost:3000/api/research/<uuid> \
      -H "Content-Type: application/json" \
      -d '{"action": "approve"}'
    ```

## Running Tests
```bash
npx vitest
```

