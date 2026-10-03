# 챕터 2 실습 · 파일 수정에서 포트폴리오까지

기준일: 2026-10-03. **챕터 2의 8개 강의를 모두 들은 뒤 이 문서 하나로 진행한다.** 순서는 챕터 1 전체 강의 → 챕터 1 실습 → 챕터 2 전체 강의 → 이 실습이다. 복습·별도 수강자는 챕터 1의 프로그램이나 CSV가 없어도 아래 준비부터 독립적으로 시작할 수 있다.

기본 Git 흐름은 합성 자료의 격리 저장소에서 검증했다. GitHub 로그인·실제 push·PR·학생 환경은 별도 확인 대상이다. 이 실습은 CSV·문서의 이력을 다루며 분석 프로그램을 만들었다고 가정하지 않는다.

## 진행 지도와 단원 활동의 위치

| 강의에서 배운 내용 | 여기서 직접 하는 활동 | 남길 증거 |
|---|---|---|
| 1 Git과 GitHub·네 저장 동작 | 준비, 실습 1의 네 영역 그림·첫 커밋 | 역할 설명·손계산 |
| 2 working tree·index·HEAD | 실습 2의 draft → reviewed 예측·비교 | 세 영역 표·두 diff |
| 3 커밋 검토·ignore | 실습 3의 이력 검토·임시 출력 제외 | 검토 메모·규칙과 추적 파일 |
| 4 restore·revert | 실습 4~5의 선택 취소·폐기·상쇄 | 전후 내용·오류와 상쇄 커밋 |
| 5 branch·merge·충돌 | 실습 6의 fast-forward·중단·충돌 해결 | 두 이력 그림·단위 판단 |
| 6 remote·GitHub | 실습 7 A 또는 B의 서로 다른 경로 | A: 웹/PR 관찰, B: fetch/pull 비교 |
| 7 작업 기록·README | 실습 8의 기록·README 작성·짝 점검 | 실제 근거·문서·확인 상태 |
| 8 블로그·포트폴리오 | 실습 8의 두 글과 주장별 증거 | 글 초안·역할·한계 |

매 단계는 **시작 상태 확인 → 결과 예측 → 한 줄씩 실행 → 파일과 출력 확인 → 관찰 기록** 순서다. 초기 네 파일 수를 유지하려고 실습 1~7의 메모는 종이나 `git-lab` 바깥 문서에 적는다. 실습 8에서 저장소 안 기록으로 정리한다. 교재의 기대값은 자신의 실행 로그를 대신하지 않는다.

## 0 실습 전 준비

### 0-1 무엇을 만들고 왜 이 데이터를 쓰는가

목표는 파일 수정과 Git 상태의 관계를 관찰하는 것이다. 실제 장비·연구 자료 없이 정답을 손으로 확인할 수 있도록 **강의용 합성 CSV**를 만든다. CSV(Comma-Separated Values)는 한 줄을 한 행으로, 쉼표를 열 구분자로 쓰는 텍스트 형식이다. 첫 줄은 열 이름이며 데이터 개수에 넣지 않는다.

| 열 | 뜻·단위 | 이번 값 |
|---|---|---|
| time_ms | 측정 시점, 밀리초(ms) | 0, 1000, 2000 → 0, 1, 2초 |
| voltage_mv | 전압, 밀리볼트(mV) | 1000, 2000, 3000 → 1, 2, 3V |

1000ms = 1초, 1000mV = 1V다. 전압 평균은 `(1000 + 2000 + 3000) / 3 = 2000mV`, 다시 1000으로 나누면 **2V**다. 시간 열은 전압 평균에 더하지 않는다. `Mean: 2`는 이 예상값을 적은 문장이지 자동 분석 프로그램의 실행 결과가 아니다.

### 0-2 빈 폴더부터 작업 위치 확인

준비물은 Git, 텍스트 편집기, 터미널이다. 아래 위치 이동 예시는 Windows PowerShell 기준이다. 다른 운영체제에서는 같은 폴더 생성·이동을 편집기나 파일 관리자로 수행하고 Git 명령을 사용한다.

1. 파일 탐색기에서 강의 저장소·개인 연구 저장소 **밖에** 새 부모 폴더 `git-course-practice`를 만든다. 그 폴더에서 터미널을 연다. 기존 동명 폴더에 이어서 쓰지 말고 새 이름을 선택한다.
2. 아래 명령으로 위치를 읽고 새 빈 `git-lab`을 만든다. `New-Item`이 이미 존재한다고 알리면 진행을 멈추고 새 부모 폴더부터 시작한다. 기존 파일을 지우지 않는다.

```powershell
Get-Location
New-Item -ItemType Directory -Name git-lab
Set-Location -LiteralPath './git-lab'
Get-Location
Get-ChildItem -Force
git --version
git rev-parse --show-toplevel
```

3. 마지막 경로는 새 `git-course-practice/git-lab`이어야 한다. 파일 목록은 비어 있어야 한다. 마지막 Git 명령은 **아직 저장소가 아니므로** `fatal: not a git repository`를 포함한 오류가 예상된다. 다른 저장소 경로가 출력되면 그 저장소 안에 만든 상태다. 그 자리에서 init하지 말고 저장소 밖의 새 부모 폴더로 돌아간다.
4. `git --version` 자체가 실행되지 않으면 설치·PATH를 강사와 확인하고 터미널을 다시 연다. 이 실습은 Git을 설치했다는 가정으로 오류를 무시하고 진행하지 않는다.

### 0-3 저장소 초기화와 작성자 설정

- 시작 상태: 위치를 확인한 빈 git-lab, 아직 Git 저장소 아님.
- 파일 작성·수정은 편집기에서 한다. 아래 Git 명령은 한 줄씩 실행하고 출력을 확인한다.
- 예제의 이름·이메일은 연습용이다. 실제 프로젝트에서는 공개 범위를 고려해 본인의 작성 정보를 사용한다. 작성 정보와 GitHub 인증은 별개다.
- 연습 파일만 사용하는 상태에서 복구·충돌을 실험한다. 학생의 기존 저장소에 예제를 그대로 실행하지 않는다.

```shell
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

**시작 상태:** 실습 0을 마친 빈 main 저장소. 아직 커밋 없음.

### 파일 준비

1. 편집기에서 방금 만든 `git-lab` 폴더를 연다. 각 파일을 새 문서로 만들고 아래 이름 그대로 UTF-8로 저장한다. 메모장에서는 파일 형식을 모든 파일로 선택해 `README.md.txt`처럼 확장자가 덧붙지 않게 확인한다.
2. 아래 코드 블록의 **내용만** 붙여 넣는다. 블록을 감싼 백틱과 설명은 파일에 넣지 않는다.
3. 직접 입력 대신 강의의 초기 파일을 복사해도 된다: [samples.csv](materials/samples.csv), [starter-README.md](materials/starter-README.md), [scratch.txt](materials/scratch.txt), [starter.gitignore](materials/starter.gitignore). CSV·scratch는 이름을 유지하고 `starter-README.md`는 `README.md`, `starter.gitignore`는 `.gitignore`로 저장한다. 링크가 화면에서 열리면 본문만 복사해도 된다. **실습 8의 완성 README는 아직 복사하지 않는다.**
4. 편집기의 폴더 목록에서 아래 네 파일을 확인한다. 이 시점에는 프로그램 파일·outputs 폴더가 없다.

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

```text
git-lab/
├── .git/          ← Git이 만든 관리 폴더. 직접 편집하지 않음
├── .gitignore
├── README.md
├── samples.csv
└── scratch.txt
```

**예측:** 저장만 했으므로 아직 로컬 이력이 없다. add 뒤 네 파일이 첫 커밋 후보가 된다. 아래 명령 전 CSV를 열어 헤더 1줄·데이터 3행, README의 Unit·Mean, scratch의 keep을 확인한다.

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

**기록·풀이:** `작업 파일 / 다음 커밋 후보 / 로컬 이력 / 원격` 네 칸을 그리고 저장·add·commit·push를 연결한다. 현재 완료한 것은 로컬 commit까지이며 원격 전송은 하지 않았다. 계산의 근거는 네 칸과 별도로 CSV·손계산에 연결한다. GitHub 로그인 없이 첫 커밋을 만들 수 있고 커밋 성공은 값의 정확성을 보장하지 않는다.

**막히면:** 파일을 찾지 못하면 현재 경로와 확장자부터 확인한다. 작성자 정보 오류면 `git config --local --get user.name`·`user.email`을 다시 조회한다. 첫 commit 성공을 확인하기 전 실습 2로 넘어가지 않는다.

## 실습 2 add 뒤에 수정하면 무엇이 기록되는가

**시작 상태:** 첫 커밋 1개, main, 미커밋 변경 없음. README에는 아직 Status 줄이 없다.

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

**기록·풀이:** draft 추가 전·add 후·reviewed 저장 후의 working tree/index/HEAD를 표로 적는다. commit 직전 “draft가 기록되고 reviewed는 남는다”는 예측과 실제 show·diff를 대조한다. 틀렸다면 혼동한 영역을 기록한다. 마지막에는 커밋 3개와 깨끗한 상태다.

**막히면:** `MM` 대신 다른 상태면 두 번째 add를 실수로 했는지 두 diff로 확인한다. 예제 상태를 억지로 만들려고 이력을 지우지 말고 현재 상태를 강사와 대조한다. commit 후 modified가 남는 것은 중간 단계의 예상 결과다.

## 실습 3 무엇을 제외할 것인가

**시작 상태:** 실습 2의 reviewed까지 커밋한 깨끗한 main. 추적 파일 네 개.

최근 세 커밋을 `git log --oneline -3`으로 읽고 `git show HEAD -- README.md`로 마지막 메시지와 실제 draft → reviewed 변경을 대조한다. CSV의 값과 README의 2V도 손계산으로 확인한다.

편집기로 `outputs` 폴더와 그 안의 `demo.txt`를 만든다. 내용은 `temporary output`으로 한다.

```shell
git status --short
git check-ignore -v outputs/demo.txt
git ls-files
```

기대: 새 산출물은 기본 status에 나오지 않고, check-ignore는 적용된 규칙을 보여준다. ls-files에는 처음 추적한 네 파일이 나온다. 무시된 파일은 삭제되지 않고 디스크에 남는다.

질문: “이미 commit한 비밀 파일을 .gitignore에 추가하면 과거 이력에서도 없어지는가?” 답은 아니다. 실수로 비밀값이 공유됐다면 노출된 자격 증명을 폐기·교체하고 담당자에게 상황을 전달한다. 비밀값을 사용한 유출 실험은 하지 않는다.

**기록·풀이:** 목적·실제 변경·검증·미확인을 네 줄로 쓴다. 예: “README 검토 상태 변경. diff는 draft → reviewed. CSV 평균 2V 손계산. 프로그램 없음·GitHub 미수행.” check-ignore 출력의 규칙 파일·패턴·대상 경로를 찾고 `git diff`와 `git diff --staged`가 모두 비었는지 확인한다. 변경이 없으므로 이 단계에서 억지로 커밋을 만들지 않는다.

**막히면:** outputs가 보이면 `.gitignore` 확장자와 `outputs/` 패턴을 확인한다. 이미 추적한 파일이라면 ignore가 추적을 해제하지 않는다는 개념부터 대조한다. 학생이 만든 추가 파일이 있다면 네 파일 기준과 다른 이유를 기록한다.

## 실습 4 선택 취소와 내용 폐기 구분

**시작 상태:** 실습 3 이후 깨끗한 main, scratch.txt의 커밋된 내용은 keep. 무시된 outputs 파일은 있어도 된다.

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

**기록·풀이:** A 직후는 index에서만 빠지고 temporary edit이 작업 파일에 남는다. B 직전 “scratch.txt의 temporary edit만 버린다”고 적고, B 뒤 실제 파일의 keep·두 diff·status를 확인한다. README·CSV는 폐기 대상이 아니다.

**막히면:** 기본 restore 결과가 예상과 다르면 index가 어떤 내용이었는지 staged diff와 파일을 대조한다. 추가 복구 명령을 연달아 시도하지 않는다. 삭제한 미커밋 내용을 Git이 항상 되찾는다고 가정하지 않는다.

## 실습 5 잘못된 커밋을 새 커밋으로 상쇄

**시작 상태:** 실습 4 완료, 깨끗한 main, scratch는 keep, README는 Mean: 2.

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

**기록·풀이:** 오류 커밋과 상쇄 커밋의 실제 해시, 각각의 변경 줄, 손계산 2V를 남긴다. “복구 완료”를 현재 Mean 2·오류 이력 유지·새 커밋 생성·clean 확인으로 풀어 쓴다. 의도적으로 만든 수업용 오류라고 표시한다.

**막히면:** HEAD가 오류 커밋이 아니거나 작업 변경이 남아 있으면 실행을 멈추고 log·show·status로 대상을 확인한다. 교재 기대값을 실제 관찰로 복사하지 않는다.

## 실습 6 브랜치와 병합

**시작 상태:** 실습 5의 revert 완료, 깨끗한 main. Unit: V, Mean: 2, Status: reviewed. 아직 Source 줄 없음.

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

충돌 표시 읽기 예:

```text
<<<<<<< HEAD
Unit: input mV
=======
Unit: output V
>>>>>>> docs/units
```

이번 충돌은 깨끗한 상태에서 시작했다. 해결하기 **전** 아래 명령으로 중단도 관찰한다.

```shell
git merge --abort
git status
git show HEAD:README.md
git merge docs/units
```

중단 직후에는 깨끗한 main과 Unit: input mV가 보인다. 다시 merge하면 동일한 충돌이 예상된다. 이미 해결 커밋을 만든 뒤 abort하는 절차가 아니다. 이제 아래처럼 해결한다.

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

**기록·풀이:** A에서 main으로 돌아갔을 때 Source가 안 보이는 이유와 병합 뒤 두 이름의 위치를 이력 그림으로 남긴다. B에서는 각 브랜치의 Unit 문장과 최종 선택 근거를 적고 두 부모 이력을 가진 병합 커밋을 표시한다. A는 main이 따로 진행하지 않아 fast-forward, B는 양쪽의 같은 줄 변경 때문에 충돌했다.

**막히면:** 충돌이 없으면 브랜치별 커밋과 변경한 줄이 같은지 log·show로 확인한다. diff --check는 내용의 과학적 정확성을 보장하지 않는다. abort도 미커밋 변경을 가진 채 시작한 일반 상황까지 항상 원복한다고 가정하지 않는다.

## 실습 7 원격 저장소와 GitHub

**공통 시작 상태:** 실습 6까지 끝난 깨끗한 main. Unit은 input mV, output V이고 Mean은 2다. `git remote -v`는 비어 있어야 한다. **A 또는 B 중 하나를 선택한다.** 두 경로 모두 하려면 별도의 새 부모 폴더에서 준비 0~실습 6을 반복한 저장소를 쓴다. A를 마친 origin을 B에서 덮어쓰지 않는다.

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

5. **원본 git-lab 안에서** `git clone REPOSITORY_URL ../git-lab-github-copy`로 부모 폴더 아래 새 복사본을 만든다. `REPOSITORY_URL`은 같은 실제 주소로 바꾼다. `git-lab-github-copy`가 이미 있으면 다른 새 이름을 사용한다. 복사본에서 main·원격 주소·파일을 읽고 원본 git-lab 터미널로 돌아온다. clone은 터미널의 현재 위치를 자동으로 바꾸지 않는다.
6. **원본 git-lab 안에서** 아래 명령으로 브랜치를 만든다.

```shell
git status
git switch -c docs/readme-review
```

README 마지막에 `Mean formula: (1000 + 2000 + 3000) / 3 / 1000 = 2 V`를 추가하고 저장한다.

```shell
git diff -- README.md
git add README.md
git diff --staged
git commit -m "docs: explain sample mean formula"
git push -u origin docs/readme-review
```

7. GitHub에서 source가 docs/readme-review, target이 main인 PR을 만들고 diff·검증·미확인을 적는다. 짝이 실제 검토했을 때만 그 결과를 기록한다. **PR 생성만으로 main에 반영되지 않는다.** 이 기본 절차의 끝은 제안 생성이다. 실제 병합은 공유 권한과 검토 결과에 따라 따로 수행·기록한다.

PR 설명 예:

```text
문제: README에 평균 2V의 계산 근거가 없다.
변경: 입력 mV를 V로 환산하는 평균 계산식을 추가했다.
검증: 합성 CSV의 1, 2, 3V를 손계산해 평균 2V 확인.
한계: 분석 프로그램 구현·실행은 이번 변경 범위에 없다.
```

**A 확인·막힘:** 웹의 브랜치·커밋과 로컬 log를 대조한다. 인증 실패는 user.email 설정으로 해결되는 문제가 아니다. 주소·권한·인증을 확인한다. push 거절 시 force push로 덮어쓰지 않는다. 기본 절차를 마쳤다면 원본은 docs/readme-review, 복사본 main은 기존 상태이며 PR은 제안 상태다. 실습 8은 원본 docs/readme-review에서 이어간다. GitHub를 수행하지 못하면 미수행으로 남기고 준비된 B 경로를 선택한다.

### B 계정 없는 로컬 대체 경로

원격 개념은 다른 로컬 폴더의 저장소로도 확인할 수 있다. 이 과정은 GitHub 인증·웹 검토·PR을 검증하지 않는다. **시작 상태는 공통 시작 상태와 같고 A를 실행하지 않은 원본 git-lab이다.** A를 일부 수행해 origin이 등록됐다면 이 B를 이어 붙이지 말고 별도 새 부모 폴더에서 준비한다.

파일 탐색기로 git-lab의 부모 폴더에 remote-demo.git·git-lab-copy가 없는지 확인한다. 원본 git-lab에서 다음을 실행한다.

```shell
git init --bare -b main ../remote-demo.git
git remote add origin ../remote-demo.git
git push -u origin main
git clone ../remote-demo.git ../git-lab-copy
```

bare 저장소는 일반 작업 파일을 편집하는 폴더가 아니라 이력을 주고받는 역할로 쓴다. 이 구성은 실습 대체용이며 기관 백업 시스템을 만든 것은 아니다.

clone은 현재 위치를 바꾸지 않는다. PowerShell에서는 아래처럼 복사본으로 이동하고 작성 정보를 설정한다.

```powershell
Set-Location -LiteralPath '../git-lab-copy'
Get-Location
git status -sb
git config --local user.name "Second Workspace"
git config --local user.email "second@example.invalid"
```

편집기도 **git-lab-copy**를 연다. 복사본 README 마지막에 `Reviewed by a second workspace.`를 추가하고 저장한다. 같은 사람이 두 폴더를 조작하는 실습이므로 이 문장은 두 번째 작업 공간의 변경을 표시할 뿐 동료 검토 증거가 아니다.

```shell
git diff -- README.md
git add README.md
git commit -m "docs: record second workspace review"
git push origin main
```

이제 원본으로 돌아온다.

```powershell
Set-Location -LiteralPath '../git-lab'
Get-Location
git status -sb
```

원본은 깨끗한 main이다. fetch 전 원본 README에는 아직 새 문장이 없음을 확인하고 다음을 실행한다.

```shell
git fetch origin
git status -sb
git log --oneline main..origin/main
git show HEAD:README.md
git pull --ff-only origin main
git show HEAD:README.md
```

기대: fetch 직후 origin/main이 앞서 있지만 원본의 HEAD·작업 파일은 그대로다. pull 후 추가 문장이 들어온다. 이력이 양쪽에서 갈라져 `--ff-only`가 실패하면 status·log로 분기를 확인하고 별도 통합 계획을 세운다.

**B 기록·풀이:** fetch 전·후·pull 후의 원본 HEAD 내용과 origin/main 위치를 표로 비교한다. clone은 복제, push는 커밋 전송, fetch는 이력 수신, pull은 수신 후 현재 브랜치 통합이다. 완료 뒤 원본 main은 원격 main과 같고 새 문장이 보인다. “로컬 bare 원격 교환 확인, GitHub 인증·PR 미수행”으로 적는다.

**B 막힘:** 원격 이름이 이미 있으면 A와 B를 섞었는지 확인한다. 원본에서 새 문장이 너무 일찍 보이면 편집한 폴더가 git-lab-copy였는지 확인한다. pull --ff-only 실패는 분기 확인이 필요한 상태다. 강제 초기화로 출력을 맞추지 않는다.

## 실습 8 기록·README·글·소개로 연결

**시작 상태:** 실습 1~6과 선택한 7 경로의 실제 관찰 메모. A는 원본 docs/readme-review, B는 원본 main에서 시작한다. 원격을 못 했다면 실습 6의 main에서 미수행 이유를 적고 진행할 수 있다. 강의 중 학생 활동과 완성 예시는 모두 이 단계에 모았다.

### 작성·점검 순서

1. 실제 수행한 복구 또는 충돌 사건 하나를 고른다. `git log --oneline --graph --all --decorate`와 `git show`에서 해당 커밋을 찾고 실제 해시·변경 줄·계산 근거를 기록한다. 수업용 오류를 실제 연구 사고로 바꾸지 않는다.
2. 아래 양식과 완성 예시를 보고 `work-record.md`를 쓴다. README도 목적·파일·입력·확인법·한계·역할이 드러나게 확장한다. 기존 Unit·Mean·Status·Source와 선택 경로에서 추가한 문장은 보존한다.
3. 같은 사건으로 `reflection.md`(블로그 초안), `project-intro.md`(프로젝트 소개)를 만든다. 첫 예상을 적지 않았다면 당시 생각을 사후에 만들어 넣지 않는다.
4. 주장 세 개 이상을 파일·실제 커밋·계산·관찰 기록과 연결한다. AI가 도운 부분, 본인이 판단·실행·검증한 부분을 실제 수행에 맞게 나눈다.
5. 짝이 있으면 설명 없이 README와 공유 가능한 파일을 건네 입력 단위·평균 검증법·현재 기능·미검증을 찾게 한다. 답과 막힌 부분을 실제로 기록하고 고친다. 짝이 없으면 본인이 문서만으로 점검하고 “동료 점검 미수행”으로 표시한다. 읽었다는 확인이 없으면 “열람 미확인”이다.
6. `git status`와 `git diff -- README.md`를 읽는다. 새 세 문서는 편집기로 본문을 확인한다. 한 목적의 문서 정리임을 확인한 뒤 아래처럼 기록한다.

```shell
git add README.md work-record.md reflection.md project-intro.md
git diff --staged
git commit -m "docs: explain verified Git practice and learning evidence"
git status
git log --oneline -3
```

**예측·확인:** 네 문서의 실제 내용만 로컬 커밋에 들어간다. 앞서 push했더라도 이 새 커밋은 아직 원격에 없다. 이번 제출은 로컬 파일·커밋·관찰 기록으로 충분하다. 공개 발행은 필수가 아니다.

**막히면:** 없는 실행 명령·성과 수치는 지우고 현재 범위를 적는다. 샘플 문장의 검증 결과를 자신의 결과로 그대로 옮기지 않는다. 링크는 실제 파일을 열어 확인하고 커밋 해시는 본인 log에서 가져온다.

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

## 강사 풀이와 완성 예시

학생 절차는 위 실습 0~8이다. 아래 네 예시는 문서 구조와 판단 근거를 확인하는 참고 자료다. 실제 수행 기록을 대신하지 않는다. 초기 파일은 준비·실습 1에서 사용하고, 완성 README는 실습 8에서 확장할 때 사용한다.

### 완성 예시 A · README

다음은 **Git 기초 실습 저장소에 넣을 수 있는 교육용 완성 예시**다. 학생 수행 결과를 대신 증명하지 않는다. 실습 6까지의 파일 상태를 기준으로 하며, 자신의 수행 범위가 다르면 해당 문장을 수정한다. 기존 README 확장은 실습 7의 선택 경로까지 마친 이 단계에서 한다. 실습 7 B를 했다면 추가한 Reviewed by 문장도 보존한다.

````markdown
# Measurement notes

## 목적과 현재 상태

합성 측정 CSV를 사용해 Git의 변경 기록·복구·병합을 연습하는 저장소다.
현재 자료는 CSV와 문서다. 자동 분석 프로그램과 그래프 생성 기능은 없다.

Unit: input mV, output V
Mean: 2
Status: reviewed
Source: synthetic sample

reviewed는 이 수업에서 정한 샘플 손계산 검토 상태다.
프로그램 테스트나 동료 승인 완료를 뜻하지 않는다.

## 파일

- samples.csv: 시간과 전압을 담은 합성 입력 3행.
- README.md: 자료 목적·단위·확인 방법.
- scratch.txt: 복구 연습용 파일. 분석 입력으로 사용하지 않는다.
- .gitignore: 비밀 설정·환경 폴더·임시 출력의 제외 규칙.
- outputs/demo.txt: 만들어 둔 경우에만 존재하는 임시 출력 예제.
  Git 추적에서 제외되므로 clone한 복사본에 없어도 정상이다.

## 입력과 예상값

```csv
time_ms,voltage_mv
0,1000
1000,2000
2000,3000
```

시간은 ms, 전압은 mV다. 각각 1000으로 나누면 초와 V가 된다.
변환 시간은 0, 1, 2초, 변환 전압은 1, 2, 3V다.
표본 수 3, 평균 2V, 최솟값 1V, 최댓값 3V가 손계산 예상값이다.

## 확인 방법

Git과 텍스트 편집기를 준비하고 저장소 폴더에서 실행한다.

```shell
git --version
git status
git ls-files
git log --oneline -5
```

samples.csv를 열어 세 행과 열 이름을 확인한다.
평균은 (1000 + 2000 + 3000) / 3 / 1000 = 2V로 대조한다.
README의 Mean과 Unit을 확인한다. 명령 성공만으로 계산이 맞다고 판단하지 않는다.

## 범위와 한계

CSV 자동 읽기, 누락값 검사, 역순 시간 검사, 그래프 생성은 구현하지 않았다.
다른 데이터도 자동 처리된다고 보장하지 않는다. 실제 장비 데이터도 사용하지 않았다.
GitHub 인증과 PR 수행 여부는 각자의 작업 기록에서 확인한다.
.gitignore는 이미 추적된 파일이나 과거 커밋을 삭제하지 않는다.

## 역할과 참고

이 문서는 강의용 작성 예시다. 학습자의 실제 수행·AI 도움은 작업 기록에 별도로 남긴다.
수업의 합성 CSV와 Git 공식 문서를 참고한다.
Git 변경 기록: https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository
````

README를 작성한 뒤 `git diff -- README.md`로 기존 단위·평균·출처가 보존됐는지 읽는다. staged diff와 손계산을 확인한 뒤 문서 목적의 커밋을 만든다. 실제 실행한 뒤에만 작업 기록의 수행 항목에 쓴다.

### 완성 예시 B · 작업 기록

아래는 **실습 6 시나리오를 정상 수행한 경우의 교육용 기록 예시**다. 현재 학생이 수행했다는 뜻이 아니다. 실제 제출은 자신의 해시·관찰·역할로 작성한다.

> **작업명:** 입력·출력 전압 단위 설명 충돌 해결.
>
> **문제와 목표:** main은 입력 mV, docs/units는 출력 V를 같은 줄에 적었다. 두 설명을 보존하고 독자가 단위를 구별하도록 한다.
>
> **관찰:** README의 Unit 줄 병합이 충돌했다. CSV 열 이름은 voltage_mv이고 샘플은 1000·2000·3000이다.
>
> **판단:** 어느 한쪽 전체 선택은 다른 단위 설명을 잃는다. Unit: input mV, output V로 통합한다.
>
> **변경:** README의 충돌 구간과 표시를 최종 한 줄로 정리한다. 커밋 메시지는 docs: reconcile input and output unit descriptions다. 이 교재는 학생의 실제 커밋 해시를 제공하지 않는다.
>
> **예시의 확인 결과:** diff --check 통과, 평균 2V 손계산, Mean·Status·Source 보존, 병합 커밋 뒤 clean 확인을 기록하는 상황이다. 제출자는 실제 출력과 대조해야 한다.
>
> **역할:** 강의가 충돌 시나리오와 해결 후보를 제공했다. 학생이 직접 판단·실행한 범위와 AI의 추가 도움은 본인 기록에서 명시한다.
>
> **상태:** 교육용 문서 예시 작성 완료. 학생 실행·짝 검토·GitHub 반영은 이 예시로 확인할 수 없다.
>
> **다음:** 실제 수행 자료를 연결하고 짝에게 단위와 검증법을 설명하게 한다.


### 완성 예시 C · 블로그 초안

다음은 **수업 시나리오를 설명하는 교육용 글**이다. 특정 학생의 실제 수행담이 아니다. 빈 양식이 아닌 완성 글의 구조를 읽고, 자신의 글은 실제 관찰로 다시 쓴다.

#### Git은 평균이 맞는지 판단하지 않는다

합성 측정 CSV와 README만으로도 Git을 배울 수 있다. 이번 교육 사례의 입력은 1000, 2000, 3000mV다. V로 변환하면 1, 2, 3이고 평균은 2V다. 분석 프로그램은 없으며, 계산은 손계산으로 확인하는 범위다.

수업은 README의 `Mean: 2`를 일부러 `Mean: 2.5`로 바꾸고 커밋하는 상황을 만든다. Git은 이 변경을 기록할 수 있다. 이때 커밋이 성공했다는 사실은 숫자가 맞다는 근거가 아니다. Git은 어떤 상태를 남겼는지를 관리하고, 값의 타당성은 입력과 계산으로 확인해야 한다.

오류를 찾는 순서는 단순하다. 먼저 samples.csv의 세 값을 확인한다. 평균 계산식 `(1000 + 2000 + 3000) / 3 / 1000`은 2다. 이어 `git log --oneline -3`으로 최근 이력을 찾고 `git show HEAD -- README.md`로 방금 기록한 변경을 확인한다. 이 예제에서는 HEAD가 의도적으로 만든 오류 커밋일 때만 다음 단계로 간다.

복구에는 `git revert --no-edit HEAD`를 사용한다. 실행 뒤 확인할 것은 현재 값, 이력, 작업 상태다. README의 Mean은 2로 돌아와야 하고, 잘못된 커밋과 이를 상쇄하는 새 커밋은 모두 남아 있어야 한다. 수업에서 확인한 실제 해시와 출력은 각자의 기록에 붙인다.

이 사례가 보여주는 것은 버전 관리와 검증의 역할 차이다. 변경 이력이 있어야 무엇을 고쳤는지 찾기 쉽다. 동시에 올바른 예상값과 입력이 있어야 무엇이 잘못됐는지 판단할 수 있다. AI가 “수정 완료”라고 말하더라도 이 두 확인은 필요하다.

적용 범위도 작게 잡아야 한다. 이 사례는 방금 만든 일반 커밋 하나를 바로 상쇄한다. 오래된 커밋이나 여러 수정이 얽힌 상황을 모두 해결했다고 주장할 수 없다. 실제 연구 데이터를 처리하거나 자동 분석 시스템을 배포한 사례도 아니다. 다음 연습은 단위 설명이 갈라진 두 브랜치를 비교하고, 입력 mV와 출력 V가 모두 드러나는 문장으로 병합하는 것이다.

### 완성 예시 D · 프로젝트 소개 한 장

아래 소개 역시 **수업용 사례 소개**다. 개인의 실무 성과·팀 기여를 꾸며 넣지 않았다. 학생 제출본에서는 실제 맡은 역할과 확인한 증거로 바꾼다.

#### 합성 측정 자료로 배우는 Git 검증·기록 실습

**목적:** 같은 문서의 수정 이력을 읽고 잘못된 변경을 상쇄하며, 입력·출력 단위 설명을 검증 가능한 형태로 남기는 교육 과제다.

**자료와 범위:** samples.csv의 세 전압값과 README를 사용한다. scratch.txt는 복구 연습에만 쓰며 .gitignore는 임시 출력 등을 제외한다. 자동 분석 프로그램, 실제 장비 데이터, 성능 측정은 포함하지 않는다.

**핵심 문제:** 단위 설명을 고치는 두 브랜치가 같은 줄을 다르게 수정한다. main은 `Unit: input mV`, docs/units는 `Unit: output V`를 기록한다. 한쪽만 선택하면 다른 쪽 설명을 잃는다.

**판단과 처리:** CSV의 voltage_mv와 V 기준 평균을 대조한다. 최종 문장은 `Unit: input mV, output V`로 정한다. 충돌 표시 제거 뒤 staged diff를 읽고 Mean·Status·Source가 보존됐는지 확인하는 절차를 사용한다.

**제출할 증거:** 실제 수행한 저장소의 두 분기 커밋과 병합 커밋, 최종 README, 합성 CSV, 평균 2V의 손계산, status와 내용 확인 기록이다. 이 소개 자체는 그 수행 증거를 대신하지 않는다.

**역할 설명:** 강의는 충돌 상황과 완료 기준을 제공한다. 학습자는 자신이 직접 한 상태 예측·단위 판단·명령 실행·검증을 설명한다. AI 도움을 받았다면 제안·문서 작성·해석 중 어느 부분인지 밝힌다. 수행하지 않은 항목은 본인 역할로 쓰지 않는다.

**확인 가능한 성과의 범위:** 실제 수행 기록이 갖춰지면 브랜치의 분기·병합과 충돌 해결 이유를 설명할 수 있다는 근거가 된다. 연구실 생산성 향상, 서비스 운영, 자동 분석 정확성, GitHub 협업 성공을 입증하는 자료는 아니다.

**다음 단계:** 구현된 CSV 분석 프로그램이 생기면 정상·오류 입력으로 실행하고, 실제 명령과 결과를 README에 추가한다. 공동 작업이 필요해지면 권한을 확인한 원격 저장소에서 PR 검토를 진행한다.


## 강사 확인표

- 학생이 매 단계 작업 폴더·스테이징·커밋 중 무엇이 달라질지 먼저 말했는가?
- restore의 내용 폐기와 revert의 새 이력을 설명했는가?
- 충돌을 해결한 문장이 실제 단위와 일치하는가?
- commit·push·PR을 구분하며 원격 주소·공유 범위를 확인했는가?
- 코드가 없는 연습을 프로그램 완성·성능 개선으로 부풀리지 않았는가?
- 다른 사람이 README와 기록에서 본인 기여·검증·한계를 찾을 수 있는가?

검증 출처와 이번 환경에서 확인한 범위는 [sources.md](sources.md)에 정리한다.
