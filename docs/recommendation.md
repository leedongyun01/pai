# Spec-Kit 명세(Specification) 작성 추천 가이드

ProbeAI 프로젝트의 PRD와 Constitution을 분석한 결과, 구현의 의존성과 중요도를 고려하여 다음 5가지 항목을 우선적으로 명세화(Specify)하는 것을 추천합니다.

## 1. Core Agent Orchestration (Analyzer & Planner)
- **설명**: 사용자의 입력을 분석하여 'Quick Scan'과 'Deep Probe' 모드를 결정하고, 구체적인 리서치 계획(Sub-tasks)을 수립하는 핵심 로직입니다.
- **우선순위 이유**: 모든 리서치 작업의 시작점이며, Constitution의 **제1원칙(Autonomous Execution)**과 **제4원칙(Dual-Mode Operation)**을 정의하는 기반이 됩니다.
- **핵심 명세 항목**: 
  - 질의 의도 분류 알고리즘
  - 리서치 플랜 생성 프롬프트 전략
  - 에이전트 상태 머신(State Machine) 정의

## 2. Research Engine (Researcher)
- **설명**: 수립된 계획에 따라 실제 웹 검색을 수행하고, 페이지 본문을 스크래핑하여 정보를 수집하는 모듈입니다.
- **우선순위 이유**: 실제 데이터를 가져오는 파이프라인이 없으면 분석이 불가능합니다.
- **핵심 명세 항목**:
  - 검색 API 연동 규격 (Google/Bing 등)
  - 웹페이지 본문 텍스트 추출 및 정제 로직
  - 토큰 제한을 고려한 컨텍스트 윈도우 관리

## 3. Citation-Aware Synthesizer (Synthesizer)
- **설명**: 수집된 파편 정보를 종합하여 보고서를 작성하되, **제2원칙(Verifiable Reliability)**에 따라 정확한 출처(Citation)를 매핑하는 엔진입니다.
- **우선순위 이유**: ProbeAI의 신뢰성을 담보하는 가장 중요한 기능입니다. 할루시네이션 방지 대책이 포함되어야 합니다.
- **핵심 명세 항목**:
  - 팩트 체크 및 교차 검증 로직
  - 인라인 인용구(Inline Citation) 생성 규칙
  - 리포트 구조화 (개요, 본문, 결론) 템플릿

## 5. Human-in-the-Loop Interaction (Plan Confirmation)
- **설명**: 에이전트가 수립한 계획을 사용자가 검토하고 승인/수정하는 프로세스입니다.
- **우선순위 이유**: **제5원칙(Human-in-the-Loop)**을 구현하며, 완전 자동화의 리스크를 보완하는 안전장치입니다.
- **핵심 명세 항목**:
  - 계획 승인 대기(Pending) 상태 처리
  - 사용자 피드백 반영 및 계획 수정 로직
  - Auto-Pilot 모드 토글 처리

## 6. Adaptive Visualization System (Visualizer)
- **설명**: 텍스트 데이터 내에서 수치나 구조적 패턴을 감지하여 Mermaid.js 차트나 표로 변환하는 모듈입니다.
- **우선순위 이유**: **제3원칙(Adaptive Visualization)**을 통해 결과물의 가독성을 극대화하는 차별화 포인트입니다.
- **핵심 명세 항목**:
  - 시각화 적합 데이터 패턴 감지 로직
  - Mermaid 코드 생성 및 유효성 검증
  - 지원 차트 타입(Flowchart, Pie, Bar 등) 정의