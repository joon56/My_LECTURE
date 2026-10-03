# 02 · 저장소와 작업 상태 이해하기

> [!NOTE]
> **PDF 연결 | 새로 추가**
> 원본 PDF에는 working tree·index·HEAD를 설명하는 Git 단원이 없다. 이 단원의 상태 모델과 시연은 강사가 새로 추가했다. 원본의 그림을 Git 구조도로 해석하지 않는다.

## 목표·준비·산출물

- 목표: 작업 폴더, 스테이징 영역(index), 현재 커밋을 구분한다.
- 준비: 단원 1의 저장·add·commit 구분, Git이 설치된 터미널, 파일 편집기.
- 산출물: 네 파일이 있는 `git-lab` 저장소와 `draft → reviewed` 상태 비교 기록.
- 완료 기준: add 뒤 다시 수정한 파일이 커밋에 어떻게 들어가는지 실행 전에 예측한다.

## 개념 설명

일반적인 Git 작업 저장소에는 편집할 **working tree**와 이력을 관리하는 `.git`이 있다. `.git`을 직접 고치거나 지우지 않는다. 저장소 위치를 잘못 잡으면 엉뚱한 파일이 실습 대상이 된다. 먼저 편집기에서 새 `git-lab` 폴더를 만들고 그 폴더를 터미널로 연다. 현재 경로를 확인하는 방법은 사용하는 셸에 맞춰 강사가 보여준다.

**index 또는 staging area**는 다음 커밋을 준비하는 영역이다. `git add README.md`는 그 순간 README의 내용을 준비한다. “이 파일은 앞으로 모든 수정까지 자동으로 커밋하라”는 뜻이 아니다. add 후 다시 편집하면 준비한 내용과 현재 파일 내용이 달라진다.

**HEAD**는 보통 현재 작업 중인 브랜치를 가리키는 참조다. 해당 브랜치를 통해 현재 기준 커밋을 찾는다. 첫 커밋 전에는 브랜치 이름은 있어도 비교할 기존 커밋이 아직 없다. 이 강의의 `git show HEAD:README.md`는 첫 커밋 이후에 사용한다. detached HEAD는 후속 심화 범위다.

추적하지 않은 새 파일은 **untracked**다. add하면 기록 대상으로 준비되며, commit 이후 수정하지 않았다면 해당 파일은 현재 기준과 일치한다. `clean`은 Git이 보는 미커밋 변경이 없다는 뜻이다. 프로그램이 맞거나 폴더에 숨겨진 파일이 전혀 없다는 뜻으로 확장하지 않는다.

비교 기준을 함께 외운다. `git diff`는 작업 파일과 index를 비교한다. `git diff --staged`는 index와 HEAD를 비교한다. `git show HEAD:README.md`는 현재 커밋에 기록된 README를 읽는다. 새 untracked 파일의 본문은 일반 diff에 나타나지 않으므로 편집기로도 확인한다.

## 강사 진행 장면

### 장면 1 · 지금 어느 폴더인가

**강사 발화:** “명령보다 먼저 경로를 봅시다. 지금 터미널이 수업용 빈 폴더를 가리키나요? 실제 연구 폴더에서 연습을 시작하지 않습니다.”

**화면:** 편집기 폴더 이름과 터미널 위치를 나란히 확인한다. `git --version` 결과를 기록한다. 없는 명령이라고 나오면 설치 문제를 먼저 해결한다.

**예상 학생 답:** “새로 만든 git-lab이며 아직 프로젝트 파일이 없습니다.”

### 장면 2 · GitHub 로그인과 작성자 구분

**강사 발화:** “여기서 입력하는 이름과 이메일은 커밋에 붙을 작성 정보입니다. GitHub 비밀번호도 아니고 원격 접근 권한도 아닙니다.”

**화면:** 아래 `--local` 설정과 조회를 실행한다. 전역 설정을 덮어쓰지 않는다.

**예상 학생 답:** “이 연습 저장소에만 작성 정보가 설정됩니다.”

### 장면 3 · 종이 세 장으로 add 설명

**강사 발화:** “책상 위 현재 원고, 제출하려고 골라 둔 원고, 이미 제출한 원고를 나눠봅시다. 준비한 뒤 책상 원고를 고쳤다면 제출본도 자동으로 바뀔까요?”

**판서:** `working tree: reviewed / index: draft / HEAD: Status 줄 없음`을 쓴다. 비유가 실제 파일을 세 폴더로 복사한다는 의미는 아니라고 덧붙인다.

**예상 학생 답:** “add를 다시 하지 않았다면 index에는 draft가 남습니다.”

### 장면 4 · 같은 파일이 두 번 보인다

**강사 발화:** “`MM README.md`는 같은 파일이 고장 나서 두 번 등록됐다는 뜻일까요? 첫 칸과 둘째 칸을 각각 읽어봅시다.”

**화면:** 일반 diff와 staged diff를 연달아 보여준다. GUI에서는 staged 변경과 나머지 변경 목록을 대응시킨다.

**예상 학생 답:** “첫 칸은 index 쪽 수정, 둘째 칸은 그 뒤 작업 폴더 수정입니다. commit하면 draft가 들어가고 reviewed는 남습니다.”

## 함께 풀 사례 · 처음 만들고 두 버전 비교하기

새 `git-lab` 안에서 다음을 실행한다. Git이 `-b` 옵션을 지원하지 않으면 버전을 확인하고 강사가 환경을 정리한다.

```shell
git --version
git init -b main
git config --local user.name "Git Student"
git config --local user.email "student@example.invalid"
git config --local --get user.name
git config --local --get user.email
git status
```

기대는 main, 아직 커밋 없음, 연습용 작성 정보다. 이때 init과 clone을 연달아 실행하지 않는다. 새 저장소 시작과 기존 저장소 복제는 다른 시작 경로다.

[실습 1](../practice.md)대로 README, samples.csv, scratch.txt, .gitignore를 만든다. README는 `Unit: V`, `Mean: 2`, scratch는 `keep`이다. CSV는 앞 단원의 세 행이다. ignore 내용은 다음과 같다.

```gitignore
.env
.env.*
!.env.example
.venv/
__pycache__/
outputs/
```

```shell
git add README.md samples.csv scratch.txt .gitignore
git diff --staged
git commit -m "docs: record sample data and expected mean"
git status
```

이제 README 마지막에 `Status: draft`를 추가하고 저장한 다음 add한다.

```shell
git add README.md
```

편집기에서 `Status: reviewed`로 고치고 저장한다. **다시 add하지 않고** 비교한다.

```shell
git status --short
git diff -- README.md
git diff --staged -- README.md
git commit -m "docs: record draft review status"
git show HEAD:README.md
git status --short
```

예상 상태는 다음과 같다. 출력 전체를 복제한 실행 로그가 아니라 학생이 확인할 기준이다.

| 시점·확인 | 기대 내용 |
|---|---|
| commit 전 status | `MM README.md` |
| 일반 diff | draft를 reviewed로 바꿈 |
| staged diff | Status: draft 줄 추가 |
| commit 뒤 HEAD의 README | Status: draft |
| 실제 작업 파일 | Status: reviewed |
| commit 뒤 status | ` M README.md` |

이 예제의 reviewed는 샘플 손계산을 검토했다는 연습 문구다. 분석 프로그램의 테스트 완료를 뜻하지 않는다. 관찰을 끝내면 남은 reviewed 수정을 검토하고 기록한다.

```shell
git add README.md
git diff --staged
git commit -m "docs: mark sample review complete"
git status
```

## 학생 활동 · 상태를 먼저 적고 실행하기

1. 첫 커밋이 생성됐는지 log로 확인한다. 없으면 이 단원의 준비 단계부터 완료한다.
2. draft를 add하기 전후의 working tree·index·HEAD 내용을 각각 적는다.
3. reviewed로 수정한 뒤 세 영역을 다시 적는다. 앞 단계 답을 덮어쓰지 않는다.
4. commit 직전 “무슨 문장이 기록될 것인가”를 한 문장으로 제출한다.
5. show 결과와 파일을 비교하고 예측이 틀렸다면 어느 영역을 혼동했는지 쓴다.
6. 남은 변경을 커밋하고 깨끗한 상태인지 확인한다. 최종 상태만 제출하지 말고 중간 비교도 보존한다.

**풀이:** 두 번째 add 이전에 index는 draft다. 첫 commit에는 draft가 들어간다. reviewed가 작업 파일에 남으므로 이후 별도 커밋이 필요하다. 채점은 명령 복사 여부보다 세 시점의 내용을 정확히 설명했는지로 한다.

## 질문·막힐 때

- **commit했는데 modified가 남아요.** commit 전후 diff를 확인한다. add 뒤 수정했다면 정상적인 결과다.
- **diff가 비었는데 파일이 있어요.** staged 또는 untracked인지 status부터 확인한다.
- **README가 README.md.txt로 보여요.** 실제 확장자를 확인하고 해당 연습 파일을 올바르게 저장한다.
- **모든 줄이 바뀌었어요.** 내용 외에 CRLF/LF 변환을 확인한다. 원인 확인 없이 전역 Git 설정을 바꾸지 않는다.
- **긴 화면에서 입력이 안 돼요.** pager가 열렸다면 `q`로 나간다. 실행 중 작업을 무조건 종료하는 단축키로 설명하지 않는다.

## 통과 기준·다음·출처

세 영역과 두 diff의 비교 기준을 정확히 말하고 `MM`의 이유를 설명하면 통과다. 다음 [03 · 커밋](03-commits.md)에서는 무엇을 기록할지 고른다.

공식 문서 확인일: 2026-10-03. [git init](https://git-scm.com/docs/git-init), [git config](https://git-scm.com/docs/git-config), [git add](https://git-scm.com/docs/git-add), [git diff](https://git-scm.com/docs/git-diff), [변경 기록](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository). 기존 로컬 실행 범위는 [검증 기록 안내](../sources.md). 학생별 실행 결과는 수업 후 별도로 남긴다.
