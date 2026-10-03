# 02 · 저장소와 작업 상태 이해하기

> [!NOTE]
> **PDF 연결 | 새로 추가**
> 원본 PDF에는 working tree·index·HEAD를 설명하는 Git 단원이 없다. 이 단원의 상태 모델과 시연은 강사가 새로 추가했다. 원본의 그림을 Git 구조도로 해석하지 않는다.

## 목표·강의 준비·핵심 요점

- 목표: 작업 폴더, 스테이징 영역(index), 현재 커밋을 구분한다.
- 강의 준비: 단원 1의 저장·add·commit 구분. 강사가 별도 시연 저장소를 준비한다.
- 핵심 요점: working tree·index·HEAD, untracked·clean, MM과 두 diff의 비교 기준.

## 개념 설명

일반적인 Git 작업 저장소에는 편집할 **working tree**와 이력을 관리하는 `.git`이 있다. `.git`을 직접 고치거나 지우지 않는다. 저장소 위치를 잘못 잡으면 엉뚱한 파일이 실습 대상이 된다. 강사는 별도의 `git-lab` 시연 폴더를 열고 편집기 폴더와 터미널 경로가 일치하는지 보여준다. 학생의 폴더 생성 절차는 통합 실습에 있다.

**index 또는 staging area**는 다음 커밋을 준비하는 영역이다. `git add README.md`는 그 순간 README의 내용을 준비한다. “이 파일은 앞으로 모든 수정까지 자동으로 커밋하라”는 뜻이 아니다. add 후 다시 편집하면 준비한 내용과 현재 파일 내용이 달라진다.

**HEAD**는 보통 현재 작업 중인 브랜치를 가리키는 참조다. 해당 브랜치를 통해 현재 기준 커밋을 찾는다. 첫 커밋 전에는 브랜치 이름은 있어도 비교할 기존 커밋이 아직 없다. 이 강의의 `git show HEAD:README.md`는 첫 커밋 이후에 사용한다. detached HEAD는 후속 심화 범위다.

추적하지 않은 새 파일은 **untracked**다. add하면 기록 대상으로 준비되며, commit 이후 수정하지 않았다면 해당 파일은 현재 기준과 일치한다. `clean`은 Git이 보는 미커밋 변경이 없다는 뜻이다. 프로그램이 맞거나 폴더에 숨겨진 파일이 전혀 없다는 뜻으로 확장하지 않는다.

비교 기준을 함께 외운다. `git diff`는 작업 파일과 index를 비교한다. `git diff --staged`는 index와 HEAD를 비교한다. `git show HEAD:README.md`는 현재 커밋에 기록된 README를 읽는다. 새 untracked 파일의 본문은 일반 diff에 나타나지 않으므로 편집기로도 확인한다.

## 강사 진행 장면

강사가 설명·판서·시연한다. 학생은 상태와 의미를 읽는다. 명령 따라하기·파일 수정·제출은 8단원 강의를 마친 뒤 [통합 실습](../practice.md)에서 진행한다.

### 장면 1 · 지금 어느 폴더인가

**강사 발화:** “화면의 경로는 제가 만든 빈 시연 폴더입니다. 학생 실습 때도 이처럼 새 폴더의 위치부터 확인합니다.”

**화면:** 편집기 폴더 이름과 터미널 위치를 나란히 확인한다. `git --version` 결과를 기록한다. 없는 명령이라고 나오면 설치 문제를 먼저 해결한다.

**예상 학생 답:** “새로 만든 git-lab이며 아직 프로젝트 파일이 없습니다.”

### 장면 2 · GitHub 로그인과 작성자 구분

**강사 발화:** “여기서 입력하는 이름과 이메일은 커밋에 붙을 작성 정보입니다. GitHub 비밀번호도 아니고 원격 접근 권한도 아닙니다.”

**화면:** 강사가 저장소별 `--local` 작성자 설정과 조회를 보여준다. 전역 설정을 덮어쓰지 않는다.

**예상 학생 답:** “이 연습 저장소에만 작성 정보가 설정됩니다.”

### 장면 3 · 종이 세 장으로 add 설명

**강사 발화:** “책상 위 현재 원고, 제출하려고 골라 둔 원고, 이미 제출한 원고를 나눠봅시다. 준비한 뒤 책상 원고를 고쳤다면 제출본도 자동으로 바뀔까요?”

**판서:** `working tree: reviewed / index: draft / HEAD: Status 줄 없음`을 쓴다. 비유가 실제 파일을 세 폴더로 복사한다는 의미는 아니라고 덧붙인다.

**예상 학생 답:** “add를 다시 하지 않았다면 index에는 draft가 남습니다.”

### 장면 4 · 같은 파일이 두 번 보인다

**강사 발화:** “`MM README.md`는 같은 파일이 고장 나서 두 번 등록됐다는 뜻일까요? 첫 칸과 둘째 칸을 각각 읽어봅시다.”

**화면:** 일반 diff와 staged diff를 연달아 보여준다. GUI에서는 staged 변경과 나머지 변경 목록을 대응시킨다.

**예상 학생 답:** “첫 칸은 index 쪽 수정, 둘째 칸은 그 뒤 작업 폴더 수정입니다. commit하면 draft가 들어가고 reviewed는 남습니다.”

## 읽는 사례 · add 시점의 상태

강사는 첫 커밋이 있는 별도 시연 저장소에서 README에 `Status: draft`를 추가해 add한 뒤, 같은 줄을 `Status: reviewed`로 바꾼 화면을 준비한다. 학생은 이 강의 중 명령을 따라 실행하지 않는다.

| 확인 대상 | 보이는 내용 | 의미 |
|---|---|---|
| working tree | Status: reviewed | 편집기로 저장한 현재 파일 |
| index | Status: draft | 마지막 add 시점에 준비한 내용 |
| HEAD | Status 줄 없음 | 앞서 기록한 기준 상태 |
| `git diff` | draft → reviewed | 작업 파일과 index의 차이 |
| `git diff --staged` | draft 줄 추가 | index와 HEAD의 차이 |

```shell
git status --short
git diff -- README.md
git diff --staged -- README.md
```

`MM README.md`의 첫 칸은 index 변경, 둘째 칸은 작업 파일 변경이다. 이 상태에서 commit하면 draft가 기록되고 reviewed 수정은 남는다. reviewed까지 기록하려면 그 변경을 다시 add한 뒤 커밋한다. 여기서 reviewed는 손계산 검토를 나타내는 연습 문구이며 프로그램 테스트 완료를 뜻하지 않는다.

새 저장소는 `git init -b main`으로 시작하고 기존 저장소의 새 복사본은 clone으로 시작한다. 같은 빈 폴더에서 두 시작 방식을 연달아 실행할 필요는 없다. 저장소별 작성 정보는 `git config --local user.name`과 `user.email`로 설정하며 GitHub 인증과 별개다. 전체 준비·상태 비교는 [통합 실습 0~2](../practice.md)에 있다.

## 질문·막힐 때

- **commit했는데 modified가 남아요.** commit 전후 diff를 확인한다. add 뒤 수정했다면 정상적인 결과다.
- **diff가 비었는데 파일이 있어요.** staged 또는 untracked인지 status부터 확인한다.
- **README가 README.md.txt로 보여요.** 실제 확장자를 확인하고 해당 연습 파일을 올바르게 저장한다.
- **모든 줄이 바뀌었어요.** 내용 외에 CRLF/LF 변환을 확인한다. 원인 확인 없이 전역 Git 설정을 바꾸지 않는다.
- **긴 화면에서 입력이 안 돼요.** pager가 열렸다면 `q`로 나간다. 실행 중 작업을 무조건 종료하는 단축키로 설명하지 않는다.

## 핵심 요점·다음·출처

add는 그 시점의 내용을 준비한다. 두 diff의 비교 기준이 다르므로 같은 파일에 staged·unstaged 변경이 함께 있을 수 있다. 다음 [03 · 커밋](03-commits.md)에서는 무엇을 기록할지 고른다.

공식 문서 확인일: 2026-10-03. [git init](https://git-scm.com/docs/git-init), [git config](https://git-scm.com/docs/git-config), [git add](https://git-scm.com/docs/git-add), [git diff](https://git-scm.com/docs/git-diff), [변경 기록](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository). 기존 로컬 실행 범위는 [검증 기록 안내](../sources.md). 학생별 실행 결과는 수업 후 별도로 남긴다.

학생 활동·명령 실행·풀이·제출 기준은 8단원 강의 뒤 [챕터 2 통합 실습](../practice.md)에서 진행한다.
