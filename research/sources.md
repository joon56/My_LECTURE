# AI 활용 교육의 확인 출처

확인일: 2026-10-03, Asia/Seoul. 공식 문서와 연구 원문을 우선했다. 검색 결과로 찾은 뒤 아래 원문을 열어 관련 내용을 확인했다. 제품 문서는 바뀔 수 있으므로 실제 수업의 설치·시연 전에 다시 확인한다. 계정별 제공 여부와 로컬 명령 실행은 별도 확인 대상이다.

## 제공 자료

- 좋은 프롬프트란 보고서: 유민준, 49페이지. 텍스트 전체와 주요 그림·부록 확인.
- SHA256: `1ED394AB591531F0488283A33F22F412D37FA86D47567B525C4976E87C76E088`.
- [검토 의견](report-review.md)의 페이지는 물리적 PDF 페이지다.

## 원리와 검증

| 출처 | 사용 범위 | 제한 |
|---|---|---|
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | Transformer 역사, WMT 영→불 BLEU 41.8 대조 | 현대 비공개 모델 구조를 설명하는 자료는 아님 |
| [Pecher 외 2026](https://arxiv.org/html/2602.04297v1) | 불충분한 지시와 텍스트 분류의 민감성 | 모든 생성 작업·환각의 인과관계로 일반화하지 않음 |
| [Errica 외 2025 PDF](https://aclanthology.org/2025.naacl-long.73.pdf) | 민감성, 같은 클래스 표본의 일관성 정의 | 두 지표의 필요한 라벨 정보가 다름 |
| [OpenAI 환각 연구 소개](https://openai.com/index/why-language-models-hallucinate/) | 추측을 보상하는 훈련·평가와 불확실성 | 모든 오류의 단일 원인으로 설명하지 않음 |
| [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) | 명확한 지시, 관련 맥락, 예시와 평가 | 모든 모델에 동일한 요청문을 최적으로 보장하지 않음 |
| [Reasoning best practices](https://developers.openai.com/api/docs/guides/reasoning-best-practices) | 추론 모델의 직접적 요청, CoT 권장 수정 | 문서의 역사적 모델 목록을 최신 추천으로 사용하지 않음 |
| [Reasoning models](https://developers.openai.com/api/docs/guides/reasoning) | 목표·제약·출력·완료 기준의 중요성 | API 옵션과 소비자 앱 동작은 구분 |
| [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | 목표별 평가, 사례·기준·반복 검사 | 강의 평가표는 본 프로젝트의 교육 제안 |
| [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state) | 대화 상태와 문맥 한계 | API의 상태 관리와 앱 메모리를 동일시하지 않음 |

## 에이전트와 맥락

| 출처 | 확인한 내용 |
|---|---|
| [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | 정해진 워크플로우와 동적으로 도구를 쓰는 에이전트, 단순한 구성에서 시작 |
| [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | 관련 정보 선택, 필요할 때 읽기, 요약과 구조화된 기록 |
| [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | 세션 간 진행 상태와 검증 가능한 산출물 유지 |
| [Safety in building agents](https://developers.openai.com/api/docs/guides/agent-builder-safety) | 신뢰할 수 없는 문서·도구 결과의 지시 삽입, 구조화와 권한의 역할 |

위 실무 사례를 모든 에이전트의 필수 구현으로 강제하지 않는다. 이 프로젝트의 파일 구조와 수업 순서는 사용자의 요구에 맞춘 설계 제안이다.

## Codex와 OpenAI 도구

| 출처 | 확인한 내용 |
|---|---|
| [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | 전역·프로젝트 지침 탐색, 표준 파일명 |
| [Build skills](https://learn.chatgpt.com/docs/build-skills) | SKILL.md, 메타데이터와 본문 로드, 프로젝트 `.agents/skills` |
| [Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) | Codex 호스트의 MCP 연결과 설정 범위 |
| [Docs MCP](https://developers.openai.com/learn/docs-mcp) | 공식 문서 읽기 전용 서버와 두 CLI 연결 예시 |
| [Skills](https://developers.openai.com/plugins/concepts/skills) | 재사용 절차와 MCP 도구의 역할 구분 |
| [Plugin architecture](https://developers.openai.com/plugins/concepts/plugins) | 스킬·MCP·선택적 UI·hook의 배포 단위 |

Codex의 이전 개발자 문서 주소 일부가 ChatGPT Learn으로 리다이렉트되어 최종 주소를 기록했다. 지침 파일의 전역 범위와 이 프로젝트에 생성한 파일의 범위는 다르다.

## Claude Code와 공통 규격

| 출처 | 확인한 내용 |
|---|---|
| [Claude Code memory](https://code.claude.com/docs/en/memory) | CLAUDE.md와 메모리, 현재 AGENTS.md 지원 조건 |
| [Claude Code skills](https://code.claude.com/docs/en/skills) | `.claude/skills`, Skill 사용 범위 |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) | HTTP 연결 명령, 프로젝트 `.mcp.json`, 연결 확인 |
| [Claude Code plugins](https://code.claude.com/docs/en/plugins) | 스킬·에이전트·hook·MCP 등을 담는 패키지 |
| [MCP architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture) | 호스트·클라이언트·서버, 도구·리소스·프롬프트 |
| [Agent Skills specification](https://agentskills.io/specification) | SKILL.md의 이름·설명·본문과 보조 파일 |

Claude Code의 AGENTS.md 직접 읽기는 공식 문서상 v2.1.277 이상부터이며 버전·설정·세션에 따른 조건이 있다. 수업에서 두 지침 파일을 무조건 함께 읽는다고 설명하지 않는다. 실제 로딩은 `/context` 등으로 확인한다. 플랫폼별 확장 필드와 Plugin manifest는 호환을 가정하지 않는다.

## Markdown과 사용자 의견에 대한 동조

추가 확인일: 2026-10-03. 자세한 해석과 교육 적용은 [추가 조사](markdown-and-sycophancy.md)에 있다.

| 출처 | 확인한 내용 | 적용 한계 |
|---|---|---|
| [CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/) | 일반 텍스트 표기와 기본 Markdown 문법 | 모든 제품의 확장 문법·지침 로딩 규칙을 정하지 않음 |
| [GitHub 기본 문법](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) | 제목·목록·링크·코드·체크박스 | 제품별 렌더링 차이 확인 필요 |
| [GitHub 표](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables) | 표 문법과 셀 표현 | CommonMark 기본 문법과 구분 |
| [Sharma 외 논문](https://arxiv.org/abs/2310.13548), [연구팀 설명](https://www.anthropic.com/research/towards-understanding-sycophancy-in-language-models) | 2023년의 동조 행동·선호 데이터 연구 | 현행 제품 전체의 발생률이나 원인을 확정하지 않음 |
| [OpenAI 사건 회고](https://openai.com/index/expanding-on-sycophancy/) | 2025-05-02 발표, GPT-4o 업데이트와 평가 실패 | 사건 설명과 통제 실험 구분 |
| [Ibrahim 외, Nature](https://www.nature.com/articles/s41586-026-10410-0) | 2026-04-29 발표, 친근한 응답을 학습한 모델과 잘못된 사용자 믿음 조건 비교 | 연구용 학습 조건. 정중한 질문 자체나 현재 두 코딩 도구의 비교 결과가 아님 |

위 Agent Skills·Claude Code Plugin 공식 문서도 다시 확인했다. Markdown 지침, 보조 코드, manifest, 권한 설정을 구분해 강의에 반영했다.

## 확인하지 않은 것

- 후배들의 계정별 기능, 가격, 사용 한도, 설치 환경.
- PDF 비교 실험의 원출력·실행 로그·모델 설정.
- 보고서의 모든 참고문헌과 문장에 대한 전수 인용 감사. 이번에는 강의에 직접 영향을 주는 핵심 주장과 의심 지점을 대조했다.
- 제시한 CLI 명령의 이 컴퓨터에서의 실행, MCP 연결, 두 도구의 동일 과제 비교 성능.

자료 확인일과 사건·논문 발표일은 구분한다. 강의 자료의 “현재”는 실제 수업 전에 재확인한다.
