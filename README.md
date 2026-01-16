# ProbeAI: 자율형 심층 리서치 엔진 (Autonomous Deep Research Engine)

**ProbeAI**는 복잡한 질의를 분석하여 종합적이고 신뢰할 수 있는 리서치 보고서를 생성하는 정교한 자율형 AI 에이전트입니다. 고급 오케스트레이션과 다단계 추론을 통해 초기 분석부터 전략 수립, 실시간 웹 탐색, 다차원 데이터 합성까지 리서치의 전 과정을 자동화합니다.

---

## 🚀 주요 기능 (Key Features)

### 1. 이중 모드 리서치 전략 (Dual-Mode Strategy)
- **Quick Scan**: 3~5개의 핵심 소스를 바탕으로 신속하게 정보를 요약하여 즉각적인 브리핑을 제공합니다.
- **Deep Probe**: 다단계 추론 엔진을 가동하여 상반된 정보를 교차 검증하고 심층적인 분석 리포트를 생성합니다.

### 2. 하이브리드 인간 참여형 루프 (Hybrid Human-in-the-Loop)
- **Auto-Pilot 모드**: 계획 수립부터 최종 보고서 출력까지 전 과정을 에이전트가 자동으로 수행합니다.
- **Plan Confirmation 모드**: 에이전트가 수립한 하위 작업(Sub-tasks)을 사용자가 검토하고 수정할 수 있어, 리서치 방향성을 정교하게 제어할 수 있습니다.

### 3. 스마트 콘텐츠 합성 (Smart Content Synthesis)
- **적응형 시각화 (Adaptive Visualization)**: 데이터의 수치적 흐름이나 구조를 자동으로 감지하여 **Mermaid.js 차트**(바, 라인, 파이, 간트 차트 등) 및 **Markdown 테이블**로 변환합니다.
- **인용 기반 보고 (Citation-Aware)**: 모든 정보에 대해 인라인 인용구와 구조화된 참고문헌 리스트를 생성하여 환각(Hallucination)을 방지하고 신뢰성을 확보합니다.

### 4. 실시간 상태 추적
- 에이전트의 내부 상태(**Thinking, Planning, Searching, Synthesizing**)를 실시간으로 대시보드에 표시하여 작업 진행 상황을 투명하게 공유합니다.

---

## 🛠 기술 스택 (Tech Stack)

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **AI Orchestration**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **Large Language Models**: Google Gemini 1.5 Pro / Flash
- **Search Engine**: [Tavily API](https://tavily.com/) (AI 최적화 검색 엔진)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Visualization**: Mermaid.js, Tailwind CSS
- **Testing**: Vitest

---

## 🏗 시스템 아키텍처 (Architectural Overview)

ProbeAI는 모듈형 에이전트 아키텍처를 따릅니다:

1.  **Analyzer**: 복잡한 질의를 해체하고 최적의 리서치 전략을 결정합니다.
2.  **Planner**: 리서치 목표를 세분화하여 실행 가능한 하위 작업과 검색 쿼리 리스트를 생성합니다.
3.  **Researcher**: 병렬 웹 검색을 수행하고 관련성이 높은 콘텐츠를 스크래핑합니다.
4.  **Synthesizer**: 정보의 중복을 제거하고 팩트 체크를 수행하며 최종 보고서의 구조를 잡습니다.
5.  **Visualizer**: 데이터 패턴을 식별하고 적절한 시각화 요소를 보고서에 삽입합니다.

---

## 🚦 시작하기 (Getting Started)

### 사전 요구 사항
- Node.js 18+
- Supabase 프로젝트
- Tavily API Key
- Google Gemini API Key

### 설치 방법

1. 저장소 클론:
   ```bash
   git clone https://github.com/leedongyun01/pai.git
   cd pai
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. 환경 변수 설정:
   `.env.local` 파일을 생성하고 다음 내용을 입력합니다:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
   TAVILY_API_KEY=your_tavily_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. 개발 서버 실행:
   ```bash
   npm run dev
   ```

---

## 📄 라이선스 (License)
이 프로젝트는 MIT 라이선스를 따릅니다.
