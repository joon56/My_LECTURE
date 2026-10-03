# 챕터 2 실습 · 파일 수정에서 포트폴리오까지

기준일: 2026-10-03. 강의용 명세. 기본 명령은 작은 격리 저장소에서 검증하고 결과를 작업 기록에 남긴다. GitHub 로그인·실제 push·PR·학생 환경에서의 실행은 별도다. 이 문서의 프로그램 성과 예시는 실제 구현 완료를 뜻하지 않는다.

## 0 실습 전 준비

- 실제 연구 폴더와 분리된 새 빈 폴더 `git-lab`을 만들고 터미널에서 그 폴더를 연다.
- 파일 작성·수정은 편집기에서 한다. 아래 Git 명령은 한 줄씩 실행하고 출력을 확인한다.
- 예제의 이름·이메일은 연습용이다. 실제 프로젝트에서는 공개 범위를 고려해 본인의 작성 정보를 사용한다. 작성 정보와 GitHub 인증은 별개다.
- 연습 파일만 사용하는 상태에서 복구·충돌을 실험한다. 학생의 기존 저장소에 예제를 그대로 실행하지 않는다.

```shell
git --version
git init -b main
git config --local user.name "Git Student"
git config --local user.email "student@example.invalid"
git config --local --get user.name
git config --local --get user.email
git status
```

기대: main에서 아직 커밋이 없다고 나온다. 이름·이메일이 연습 값으로 조회된다. `-b` 등을 지원하지 않으면 설치 버전을 확인하고 강사가 환경을 정리한 뒤 진행한다. 전역 설정을 임의로 바꾸지 않는다.

이후 Git 출력의 문구·색상·커밋 해시는 환경마다 다를 수 있다. 전체 문장을 암기하지 않고 브랜치·파일 상태·실제 내용을 확인한다. 긴 출력 화면이 pager로 열리면 `q`로 닫는다.

파일은 UTF-8로 저장한다. 강사의 기준 자료는 LF 줄바꿈을 사용한다. Windows의 CRLF/LF 처리 설정에 따라 줄바꿈 경고나 공백 검사가 달라질 수 있으므로, 예상하지 못한 전체 줄 변경이 보이면 편집기 줄바꿈 표시와 저장소 설정부터 확인한다. 이 문제 때문에 학생의 전역 설정을 일괄 변경하지 않는다.

## 실습 1 처음 기록하기

다음 네 파일을 만든다. 코드 블록 바깥의 설명은 파일에 넣지 않는다.

**README.md**

```text
# Measurement notes

Unit: V
Mean: 2
```

**samples.csv**

```csv
time_ms,voltage_mv
0,1000
1000,2000
2000,3000
```

**scratch.txt** — 복구 동작을 확인하기 위한 연습 파일.

```text
keep
```

**.gitignore**

```gitignore
.env
.env.*
!.env.example
.venv/
__pycache__/
outputs/
```

`.env.example`을 만들게 되면 실제 비밀값 없이 필요한 항목만 쓴다. `outputs/` 제외는 이 실습의 선택이다. 증거로 보관해야 하는 결과 파일은 검토 후 별도 경로·저장 정책을 정한다.

```shell
git status
git add README.md samples.csv scratch.txt .gitignore
git diff --staged
git commit -m "docs: record sample data and expected mean"
git status
git log --oneline
```

기대: 처음에는 untracked, add 후에는 새 파일이 staged, commit 뒤에는 추적 대상의 미커밋 변경이 없는 상태다. 커밋 1개가 보인다. 평균 2V는 `(1000+2000+3000)/3/1000`으로 손계산해 대조한다. 이 Git 실습에는 분석 프로그램이 없다.

질문: “첫 commit을 만들기 위해 GitHub 로그인이 필요했는가?”, “커밋은 계산 결과가 맞다는 것을 자동 보증하는가?”

## 실습 2 add 뒤에 수정하면 무엇이 기록되는가

README 마지막에 `Status: draft`를 한 줄 추가하고 저장한다.

```shell
git add README.md
```

이제 편집기에서 그 줄을 `Status: reviewed`로 바꾸고 저장한다. **아직 다시 add하지 않는다.**

```shell
git status --short
git diff -- README.md
git diff --staged -- README.md
git commit -m "docs: record draft review status"
git show HEAD:README.md
git status --short
```

예측 후 대조한다.

| 확인 대상 | 기대 |
|---|---|
| 첫 status | `MM README.md`: 스테이징된 수정과 그 후 수정이 함께 존재 |
| 일반 diff | draft → reviewed |
| staged diff | Status: draft 추가 |
| commit 후 `git show HEAD:README.md` | Status: draft |
| 작업 폴더 README | Status: reviewed |
| 마지막 status | ` M README.md`: 아직 커밋하지 않은 수정이 남음 |

남은 수정을 검토하고 별도 기록한다.

```shell
git add README.md
git diff --staged
git commit -m "docs: mark sample review complete"
git status
```

단축 상태의 첫 칸은 index, 둘째 칸은 작업 폴더 쪽 변경을 나타낸다. 이 실습의 `reviewed`는 손계산 검토 상태를 나타내는 예제 문구이며 프로그램 테스트 통과를 의미하지 않는다.

## 실습 3 무엇을 제외할 것인가

편집기로 `outputs` 폴더와 그 안의 `demo.txt`를 만든다. 내용은 `temporary output`으로 한다.

```shell
git status --short
git check-ignore -v outputs/demo.txt
git ls-files
```

기대: 새 산출물은 기본 status에 나오지 않고, check-ignore는 적용된 규칙을 보여준다. ls-files에는 처음 추적한 네 파일이 나온다. 무시된 파일은 삭제되지 않고 디스크에 남는다.

질문: “이미 commit한 비밀 파일을 .gitignore에 추가하면 과거 이력에서도 없어지는가?” 답은 아니다. 실수로 비밀값이 공유됐다면 노출된 자격 증명을 폐기·교체하고 담당자에게 상황을 전달한다. 비밀값을 사용한 유출 실험은 하지 않는다.

## 실습 4 선택 취소와 내용 폐기 구분

### A 스테이징만 취소

scratch.txt를 `temporary edit`으로 바꾸고 저장한다.

```shell
git add scratch.txt
git diff --staged -- scratch.txt
git restore --staged -- scratch.txt
git status --short
git diff -- scratch.txt
```

기대: 파일 내용 `temporary edit`은 남고 스테이징만 취소된다. 첫 commit이 이미 존재하는 실습 흐름을 전제로 한다.

### B 연습 내용 폐기

**아래 명령은 scratch.txt의 미커밋 수정을 버린다.** 이 파일이 수업용 복구 파일인지, 버려도 되는 내용인지 확인한 뒤 실행한다.

```shell
git restore -- scratch.txt
git status --short
```

기대: scratch.txt는 `keep`으로 돌아가고 변경 표시가 사라진다. 기본 restore는 스테이징 내용을 가져오며, 이 시점에는 스테이징과 HEAD가 같아서 첫 기록의 내용으로 돌아온다.

## 실습 5 잘못된 커밋을 새 커밋으로 상쇄

먼저 status가 깨끗한지 확인한다. README의 `Mean: 2`를 일부러 `Mean: 2.5`로 바꾼다. 원본 samples.csv는 수정하지 않는다.

```shell
git add README.md
git commit -m "docs: introduce incorrect mean for recovery exercise"
git log --oneline -3
git show HEAD -- README.md
```

손계산 결과와 비교해 잘못된 커밋을 확인한다. 아래 HEAD가 방금 만든 오류 커밋인지 먼저 확인한다.

```shell
git revert --no-edit HEAD
git log --oneline -3
git show HEAD:README.md
git status
```

기대: Mean은 2로 돌아온다. 잘못된 커밋은 이력에 남고, 이를 상쇄한 새 커밋이 추가된다. 이 예제는 단일 일반 커밋을 즉시 되돌리는 경우다. 오래된 변경·병합 커밋에는 추가 판단과 충돌 처리가 필요할 수 있다.

## 실습 6 브랜치와 병합

### A 단순 병합

작업 폴더가 깨끗한 상태에서 시작한다.

```shell
git switch -c docs/source
```

README 마지막에 `Source: synthetic sample`을 추가해 저장한다.

```shell
git add README.md
git commit -m "docs: identify synthetic sample source"
git switch main
git show HEAD:README.md
git merge --ff-only docs/source
git log --oneline --graph --all --decorate
```

기대: main으로 돌아왔을 때 추가 문장이 안 보이고, 병합 후에는 보인다. main이 별도로 진행되지 않아 fast-forward할 수 있다. 브랜치 이름이 가리키는 위치를 이력에서 찾는다.

### B 의도적으로 충돌 만들기

main의 `Unit: V`를 공통 출발점으로 쓴다.

```shell
git switch -c docs/units
```

README에서 그 줄을 `Unit: output V`로 수정·저장한다.

```shell
git add README.md
git commit -m "docs: clarify output voltage unit"
git switch main
```

main에서는 같은 줄을 `Unit: input mV`로 수정·저장한다.

```shell
git add README.md
git commit -m "docs: clarify input voltage unit"
git merge docs/units
git status
git diff
```

기대: README 충돌로 자동 병합이 멈춘다. 충돌 출력은 이번 단계의 예상 결과다. 표시 형식은 Git 설정에 따라 다를 수 있다.

1. 강사가 양쪽에서 무엇을 설명하려 했는지 묻는다.
2. CSV 헤더와 출력 단위를 확인한다.
3. 충돌 구간을 `Unit: input mV, output V` 한 줄로 정리한다. 충돌 표시도 제거한다.
4. 나머지 Mean·Status·Source 문장이 남아 있는지 확인한다.

```shell
git diff --check
git add README.md
git diff --staged
git commit -m "docs: reconcile input and output unit descriptions"
git status
git log --oneline --graph --all --decorate
```

기대: 깨끗한 상태와 두 이력을 연결한 병합 커밋. `diff --check` 통과가 단위 설명의 정확성을 보장하지는 않으므로 내용도 읽는다.

중단 연습은 별도 회차에서 같은 깨끗한 출발점으로 충돌을 만든 직후 `git merge --abort`로 진행한다. 미커밋 변경을 가진 채 시작한 일반 상황까지 항상 원복된다고 가정하지 않는다.

## 실습 7 원격 저장소와 GitHub

### A GitHub 경로 — 계정·권한 준비 후 수행

**공식 문서 확인, GitHub에서의 로컬 실행 미검증.**

1. 학생 계정으로 빈 연습 저장소를 만든다. 기존 로컬 이력을 올릴 것이므로 이 경로에서는 GitHub에서 README·라이선스·gitignore를 추가해 초기화하지 않는다.
2. 공개 범위를 확인하고 공유 가능한 합성 파일만 들어 있는지 검토한다. 처음에는 private로 시작할 수 있다.
3. 사용하는 도구의 공식 인증 절차를 완료한다. 작성자 이메일 설정만으로 인증되지는 않는다.
4. GitHub에서 복사한 실제 주소로 아래 `REPOSITORY_URL`을 바꾼다. 예시 문자열 그대로 실행하지 않는다.

```shell
git remote add origin REPOSITORY_URL
git remote -v
git status
git push -u origin main
```

기대: 웹에서 같은 파일·커밋을 확인한다. `-u`는 이후 비교·동기화에 쓸 upstream 연결을 설정한다. 원격 이름이 이미 있으면 덮어쓰지 말고 remote -v로 기존 대상을 확인한다.

5. 별도의 부모 폴더에서 `git clone REPOSITORY_URL git-lab-copy`를 실행하고 복사본을 연다. 이미 존재하는 작업 폴더에 덮어쓰지 않는다.
6. 원본 작업 폴더에서 `docs/readme-review` 브랜치를 만들고 설명 한 줄을 개선·커밋한다.
7. `git push -u origin docs/readme-review` 후 main을 대상으로 PR을 만든다.
8. 문제·변경·검증·미확인을 적고 짝이 diff를 검토한다. 실제 공유 권한과 검토 결과에 따라 반영한다.

PR 설명 예:

```text
문제: README에서 입력 mV와 출력 V의 구분이 어렵다.
변경: 단위와 샘플 평균의 계산식을 명시했다.
검증: 합성 CSV의 1, 2, 3V를 손계산해 평균 2V 확인.
한계: 분석 프로그램 구현·실행은 이번 변경 범위에 없다.
```

### B 계정 없는 로컬 대체 경로

원격 개념은 다른 로컬 폴더의 저장소로도 확인할 수 있다. 이 과정은 GitHub 인증·웹 검토·PR을 검증하지 않는다. A와 B는 **각각 별도 연습 복사본**에서 시작하고, origin을 중복 등록하지 않는다.

강사가 git-lab의 부모 폴더에 동일 이름이 없는지 확인한다. git-lab에서 다음을 실행한다.

```shell
git init --bare -b main ../remote-demo.git
git remote add origin ../remote-demo.git
git push -u origin main
git clone ../remote-demo.git ../git-lab-copy
```

bare 저장소는 일반 작업 파일을 편집하는 폴더가 아니라 이력을 주고받는 역할로 쓴다. 이 구성은 실습 대체용이며 기관 백업 시스템을 만든 것은 아니다.

복사본에서 저장소별 작성 정보를 설정하고 README에 `Reviewed by a second workspace.`를 추가해 add·commit·`git push origin main`한다. 원본 git-lab은 깨끗한 main 상태에서 진행한다.

```shell
git fetch origin
git status -sb
git log --oneline main..origin/main
git show HEAD:README.md
git pull --ff-only origin main
git show HEAD:README.md
```

기대: fetch 직후 origin/main이 앞서 있지만 원본의 HEAD·작업 파일은 그대로다. pull 후 추가 문장이 들어온다. 이력이 양쪽에서 갈라져 `--ff-only`가 실패하면 status·log로 분기를 확인하고 별도 통합 계획을 세운다.

## 실습 8 기록·README·글·소개로 연결

### 작업 기록 최소 양식

```text
문제와 목표:
관찰한 현상과 자료:
시도·선택 이유:
변경한 파일·커밋:
실제로 확인한 방법과 결과:
본인 판단 / AI가 도운 부분:
미검증·남은 한계:
다음 행동:
```

실습 5 또는 6에서 실제로 수행한 일을 이 양식으로 적는다. 의도적으로 만든 오류는 수업용 재현이라고 표시한다.

### README 작성 양식

````markdown
# 프로젝트 이름

## 목적과 현재 상태
누가 어떤 문제에 쓰는가? 현재 구현된 범위는 어디까지인가?

## 입력과 단위
파일 형식·열 이름·단위·샘플 위치.

## 사용 방법
필요한 환경과 실제로 확인한 명령.
프로그램이 없으면 아직 실행할 프로그램이 없다고 표시.

## 검증
예상값·실제 결과·사용한 입력·확인 방법.

## 오류 처리와 한계
알려진 문제, 미검증 조건, 제외한 범위.

## 역할과 참고 자료
본인 판단·구현·검증, AI 도움, 외부 자료 출처.
````

이것은 작성 질문을 담은 양식이다. 제출본은 질문을 실제 내용으로 바꾸며, 확인하지 않은 실행 명령을 만들어 채우지 않는다. Git 실습만 한 경우 README에는 데이터·손계산·Git 학습 범위를 적는다.

### 같은 사건으로 두 문서 만들기

| 문서 | 구성 | 검토 질문 |
|---|---|---|
| 짧은 회고·블로그 초안 | 문제→예상과 실제→원인 확인→수정→배운 점 | 독자가 확인 과정을 따라갈 수 있는가? |
| 프로젝트 소개 한 장 | 목적→내 역할→핵심 판단→결과 근거→한계 | 주장마다 파일·커밋·검증을 연결했는가? |

실제 수치·역할·결과만 사용한다. 공개할 자료가 없으면 로컬 초안으로 제출한다. 별도 블로그 서비스 가입이나 사이트 배포는 필수가 아니다.

### AI에 맡길 요청 예시

```text
첨부한 작업 기록과 실제 diff를 바탕으로 README 개선안을 작성해줘.
기록에서 확인되는 사실만 사용하고 미검증은 표시해줘.
내가 직접 판단·수행한 일과 AI가 도운 부분을 구분해줘.
실행 명령과 성과 수치는 자료에 없으면 만들어내지 마.
이번에는 문서 초안만 작성하고 Git 이력·원격 저장소는 변경하지 마.
```

## 강사 확인표

- 학생이 매 단계 작업 폴더·스테이징·커밋 중 무엇이 달라질지 먼저 말했는가?
- restore의 내용 폐기와 revert의 새 이력을 설명했는가?
- 충돌을 해결한 문장이 실제 단위와 일치하는가?
- commit·push·PR을 구분하며 원격 주소·공유 범위를 확인했는가?
- 코드가 없는 연습을 프로그램 완성·성능 개선으로 부풀리지 않았는가?
- 다른 사람이 README와 기록에서 본인 기여·검증·한계를 찾을 수 있는가?

검증 출처와 이번 환경에서 확인한 범위는 [sources.md](sources.md)에 정리한다.
