# ProbeAI: Autonomous Deep Research Engine

**ProbeAI** is a sophisticated, autonomous AI agent designed to transform complex queries into comprehensive, citation-backed research reports. By leveraging advanced orchestration and multi-step reasoning, it automates the entire research process—from initial analysis and strategic planning to real-time web exploration and multi-dimensional data synthesis.

---

## 🚀 Key Features

### 1. Dual-Mode Research Strategy
- **Quick Scan**: Rapidly summarizes information from 3-5 high-quality sources for immediate insights.
- **Deep Probe**: Activates a multi-stage reasoning engine to cross-verify conflicting information and generate in-depth analytical reports.

### 2. Hybrid Human-in-the-Loop
- **Auto-Pilot Mode**: Fully automated execution from planning to final report generation.
- **Plan Confirmation Mode**: Allows users to review and refine the research sub-tasks before the agent begins its deep dive, ensuring perfect alignment with user intent.

### 3. Smart Content Synthesis
- **Adaptive Visualization**: Automatically detects numerical trends and structural patterns to generate **Mermaid.js charts** (Bar, Line, Pie, Gantt) and **Markdown tables**.
- **Citation-Aware Reporting**: Every claim is grounded in source material with inline citations and a structured bibliography to prevent hallucinations.

### 4. Real-time Status Tracking
- A dynamic dashboard provides real-time visibility into the agent's internal state: **Thinking, Planning, Searching, and Synthesizing**.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **AI Orchestration**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **Large Language Models**: Google Gemini 1.5 Pro / Flash
- **Search Engine**: [Tavily API](https://tavily.com/) (AI-optimized search)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Visualization**: Mermaid.js, Tailwind CSS
- **Testing**: Vitest

---

## 🏗 Architectural Overview

ProbeAI follows a modular agentic architecture:

1.  **Analyzer**: Deconstructs complex user queries and determines the optimal research strategy.
2.  **Planner**: Breaks down the research goal into granular, executable sub-tasks and search queries.
3.  **Researcher**: Executes parallelized web searches and scrapes high-relevance content.
4.  **Synthesizer**: De-duplicates information, performs fact-checking, and structures the final narrative.
5.  **Visualizer**: Identifies data patterns and injects appropriate visual components into the report.

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Project
- Tavily API Key
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/leedongyun01/pai.git
   cd pai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
   TAVILY_API_KEY=your_tavily_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📄 License
This project is licensed under the MIT License.