PRD: ProbeAI (AI-Powered Deep Research Portal)
1. Project Overview
ProbeAI는 사용자의 복잡한 질의를 분석하여 스스로 조사 계획을 수립하고, 다각도의 웹 검색 및 데이터 합성을 통해 고도화된 리서치 보고서를 생성하는 자율형 AI 에이전트 서비스입니다.

2. Goals & Success Metrics
자율성: 최소한의 입력으로 에이전트가 브라우징, 분석, 작성을 스스로 수행.

신뢰성: 모든 정보에 대해 검증 가능한 출처(Citations) 제공.

가독성: 텍스트뿐만 아니라 에이전트가 판단한 시각화 요소(차트, 표) 제공.

3. Key Features
3.1 Dual-Mode Research Strategy
Quick Scan: 신속한 정보 요약. 3~5개의 핵심 소스를 바탕으로 즉각적인 브리핑 제공.

Deep Probe: 다단계 추론 엔진 가동. 상반된 정보의 교차 검증 및 심층적 분석 리포트 생성.

3.2 Hybrid Human-in-the-Loop
Plan Confirmation Mode: * ON: 에이전트가 수립한 리서치 하위 태스크(Sub-tasks)를 사용자에게 보여주고 승인 후 진행.

OFF (Auto-Pilot): 계획 수립부터 최종 리포트 출력까지 전 과정 자동화.

3.3 Smart Content Synthesis
Adaptive Visualization: 수집된 데이터 중 수치적 흐름이나 구조가 발견되면 AI가 판단하여 Mermaid.js 차트 또는 Markdown Table로 변환.

Source Mapping: 본문 내 인라인 인용구와 하단 레퍼런스 리스트 자동 매핑.

4. Technical Requirements

4.1 Core Logic: Agent Workflow
Analyzer: 질의를 분석하고 검색 모드(Quick/Deep)에 따른 전략 수립.

Planner: 리서치 목표를 쪼개어 구체적인 검색 쿼리 리스트 생성.

Researcher: 실시간 웹 검색 및 웹페이지 본문 스크래핑.

Synthesizer: 정보의 중복 제거, 사실 확인 및 보고서 구조화.

Visualizer: 리포트 성격에 맞는 시각화 코드(Mermaid 등) 삽입.

5. User Interface (UI) Requirements
Search Console: 주제 입력 및 모드/승인 여부 토글 설정.

Status Dashboard: 에이전트의 현재 작업 단계(Thinking, Searching, Writing)를 실시간 스트리밍으로 표시.

Report Viewer: 마크다운 렌더링, 목차(ToC) 네비게이션, 시각화 차트 표시 영역.