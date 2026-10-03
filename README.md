<div align="center">

# AI로 일하고, Git으로 남기기

**공대생을 위한 AI 활용 · Git · 경험 기록 강의**

문제를 정의하고 → AI와 구현하고 → 직접 검증하고 → 나의 경험으로 남깁니다.

[전체 강의](lecture.html) · [단원 목차](lectures/manifest.json) · [PDF 배치 지도](research/report-to-lecture.md) · [진행 상황](VERIFICATION.md)

**2개 챕터 · 21개 단원 · 강사 대본 · 실습과 풀이**

</div>

---

## 먼저 열어보기

1. 저장소의 **Code → Download ZIP**으로 내려받아 압축을 풉니다.
2. **`lecture.html`을 브라우저에서 엽니다.** 설치나 서버 없이 전체 강의를 읽을 수 있습니다.
3. 목차에서 단원을 선택하거나 검색합니다. **PDF 연결** 상자는 원본 보고서의 활용 위치와 교정 사항입니다.

GitHub의 HTML 파일 화면은 웹사이트 미리보기가 아닙니다. 내려받은 파일을 열어주세요. 본문·검색·목차는 HTML 한 파일에 들어 있습니다. 공개본에는 원본 PDF·작업 로그·프로젝트 지침을 포함하지 않습니다. PDF 연결은 쪽수와 설명으로 남겼습니다. Markdown 링크를 열려면 폴더 구조를 유지하고, 외부 출처를 볼 때는 인터넷을 사용합니다.

## 무엇을 배우나요?

| 챕터 | 핵심 질문 | 남기는 결과 |
|---|---|---|
| **01 · AI 활용법** | 무엇을 맡기고, 어떤 자료를 주며, 결과를 어떻게 믿을 것인가? | 과제 명세, 요청문, 검증 근거, 지침과 인계 기록 |
| **02 · Git과 경험 기록** | 무엇이 바뀌었고, 왜 바꿨으며, 내 기여를 어떻게 설명할 것인가? | 커밋 이력, 복구·협업 경험, README, 회고와 포트폴리오 |

AI로 프로그램 과제를 해본 공대생을 대상으로 합니다. 연구실의 데이터 처리 과제를 **합성 측정 CSV**로 연습합니다. Codex와 Claude Code를 함께 다루되, 공통 작업 원리를 먼저 설명합니다.

### Chapter 01 — AI 활용법

| 순서 | 단원 | 순서 | 단원 |
|---|---|---|---|
| 01 | [모델·앱·도구의 구조](lectures/01-ai-use/units/01-model.md) | 07 | [프로젝트 지침](lectures/01-ai-use/units/07-instructions.md) |
| 02 | [오류·할루시네이션·검증](lectures/01-ai-use/units/02-verification.md) | 08 | [기록과 세션 인계](lectures/01-ai-use/units/08-handoff.md) |
| 03 | [문제 정의와 명세](lectures/01-ai-use/units/03-specification.md) | 09 | [Skill과 반복 절차](lectures/01-ai-use/units/09-skills.md) |
| 04 | [프롬프트 작성](lectures/01-ai-use/units/04-prompting.md) | 10 | [MCP 연결](lectures/01-ai-use/units/10-mcp.md) |
| 05 | [맥락과 토큰 관리](lectures/01-ai-use/units/05-context.md) | 11 | [Plugin 선택](lectures/01-ai-use/units/11-plugins.md) |
| 06 | [구현과 검증](lectures/01-ai-use/units/06-implementation.md) | 12 | [통합 실습과 평가](lectures/01-ai-use/units/12-evaluation.md) |
| 기초 | [Markdown 읽고 고치기](lectures/01-ai-use/units/06a-markdown.md) | | |

### Chapter 02 — Git과 경험 기록

| 순서 | 단원 | 순서 | 단원 |
|---|---|---|---|
| 01 | [Git은 무엇인가](lectures/02-git-and-records/units/01-what-is-git.md) | 05 | [브랜치와 병합](lectures/02-git-and-records/units/05-branches.md) |
| 02 | [작업 상태 이해](lectures/02-git-and-records/units/02-working-state.md) | 06 | [GitHub와 원격 저장소](lectures/02-git-and-records/units/06-remotes.md) |
| 03 | [설명할 수 있는 커밋](lectures/02-git-and-records/units/03-commits.md) | 07 | [작업 기록과 README](lectures/02-git-and-records/units/07-records.md) |
| 04 | [변경 비교와 복구](lectures/02-git-and-records/units/04-recovery.md) | 08 | [블로그와 포트폴리오](lectures/02-git-and-records/units/08-portfolio.md) |

## 한 단원에 들어 있는 것

**목표·준비 → 개념 설명 → 강사 대본과 시연 → 입력과 예상 결과 → 학생 실습·풀이 → 오개념·평가 → 다음 단원**

원본 최종보고서의 내용을 사용하는 곳에는 물리적 페이지와 활용 방법을 표시했습니다. 보완이 필요한 주장은 [교정 근거](research/report-review.md)를 붙였습니다. 새로 추가한 도구 사용법·Git 실습과 원본 내용을 구분합니다.

## 자료 구조

```text
lecture.html                  전체 강의 · 오프라인 열람
lectures/
  manifest.json               단원 순서와 통합 HTML 구성
  01-ai-use/units/             AI 활용법 · 단원별 상세 원고
  02-git-and-records/units/    Git과 경험 기록 · 단원별 상세 원고
research/                     PDF 배치 지도 · 교정 · 조사 출처
scripts/                      HTML 생성 · 문서 검사
```

강의 기획의 전체 구조는 각 챕터의 `plan.md`, 공통 실습 입력·명령은 `practice.md`에 있습니다. **현재 상세 강의는 `lecture.html`을 읽습니다.**

## 수정하고 다시 만들기

열람에는 개발 환경이 필요 없습니다. 강의를 수정할 때는 Node.js 20 이상에서 다음을 실행합니다.

```sh
npm install
npm run build
npm run check
```

단원 Markdown을 고친 후 HTML을 다시 생성합니다. 단원 추가·순서 변경은 `lectures/manifest.json`에서 합니다. 생성된 HTML의 본문을 직접 고치지 않습니다.

## 근거와 현재 범위

- 수업 설계·합성 데이터·예시 답안과 실제 실행 결과를 구분합니다.
- Git 로컬 실습과 문서·HTML 검증 범위는 [현재 상태](VERIFICATION.md)에 기록합니다.
- 제품 설정은 공식 문서 확인 날짜를 표시합니다. 학생 환경에서의 로딩·실행은 별도 확인합니다.
- 학생의 실제 연구 성과나 측정 장비 성능을 입증하는 자료는 아닙니다.

[프로젝트 안내](README.md) · [AI 출처](research/sources.md) · [Git 출처](lectures/02-git-and-records/sources.md)