# 05 · 브랜치에서 작업하고 병합하기

> [!NOTE]
> **PDF 연결 | 새로 추가**
> 원본 PDF에는 Git 브랜치·fast-forward·병합 충돌의 직접 설명이 없다. 강사가 동일한 측정 문서의 수정 사례로 새로 만든 단원이다. Git이 충돌 없이 합친다는 사실과 과학적 내용이 옳다는 판단은 구분한다.

## 목표·준비·산출물

- 목표: 브랜치 생성·전환·병합 방향을 설명하고 의도적인 충돌을 해결한다.
- 준비: 단원 4의 revert까지 완료, main, 깨끗한 작업 상태. README의 Unit은 V, Mean은 2.
- 산출물: docs/source의 fast-forward 이력과 docs/units의 충돌 해결 기록.
- 완료 기준: 명령 실행뿐 아니라 최종 문장의 입력·출력 단위가 맞는지 확인한다.

## 개념 설명

브랜치는 작업 이력의 끝을 가리키는 이름이다. 새 브랜치를 만드는 것은 별도의 프로젝트 폴더 전체를 복사하는 것과 다르다. 같은 폴더에서 브랜치를 전환하면 Git이 해당 이력의 파일 상태를 작업 공간에 반영할 수 있다. 그래서 전환 전에 status를 확인한다. 미커밋 변경이 있을 때 전환이 늘 실패하거나 항상 안전하게 분리된다고 가정하지 않는다. 첫 실습은 깨끗한 상태로 제한한다.

`git switch -c docs/source`는 현재 위치에서 새 브랜치를 만들고 그 브랜치로 이동한다. 그다음 커밋하면 해당 브랜치가 새 커밋을 가리킨다. main은 그대로다. 다시 main으로 가면 docs/source에서만 추가한 문장은 아직 보이지 않는다.

병합은 **현재 브랜치로 다른 브랜치의 변경을 통합**한다. main에서 `git merge docs/source`를 하면 main이 받는 쪽이다. 브랜치 이름의 왼쪽·오른쪽 위치가 아니라 현재 체크아웃한 브랜치가 기준이다. 실행 전 status로 확인한다.

main이 분기 뒤 별도로 진행되지 않았다면 main을 작업 브랜치 끝으로 이동시키는 fast-forward가 가능하다. 이 경우 새 병합 커밋 없이 반영될 수 있다. 두 쪽이 각각 다른 커밋으로 진행했다면 이력을 결합하는 병합이 필요하다. Git이 내용을 자동으로 합치지 못하면 충돌을 알리고 사람의 결정을 기다린다.

충돌은 어느 설명이 맞는지 Git이 알지 못하는 상황이다. 양쪽 줄을 모두 붙이는 것, 현재 쪽만 선택하는 것 자체가 정답은 아니다. 요구사항과 원자료를 보고 최종 내용을 작성한다. 충돌 표시를 지웠다고 의미까지 검증된 것은 아니다.

## 강사 진행 장면

### 장면 1 · 이름표 이동

**강사 발화:** “커밋을 점으로 그리고 main 이름표를 붙입시다. docs/source 이름표를 같은 점에 추가한 뒤 새 커밋을 하나 만들면 어느 이름표가 움직일까요?”

**판서:** `공통 점 → 새 점`을 그리고 docs/source만 새 점으로 옮긴다.

**예상 학생 답:** “현재 작업한 docs/source가 움직이고 main은 공통 점에 남습니다.”

### 장면 2 · 문장이 사라져 보인다

**강사 발화:** “docs/source에서 Source 문장을 커밋하고 main으로 돌아왔습니다. 문장이 안 보인다고 삭제된 걸까요?”

**화면:** main의 README와 `git log --oneline --graph --all --decorate`를 같이 보여준다.

**예상 학생 답:** “문장은 docs/source의 커밋에 남아 있고, main은 아직 그 커밋을 포함하지 않습니다.”

### 장면 3 · 단위 문장 두 개

**강사 발화:** “한 사람은 ‘입력 mV’, 다른 사람은 ‘출력 V’라고 썼습니다. 하나가 반드시 틀린 걸까요? 무엇을 설명하려던 문장인지 보세요.”

**화면:** CSV 헤더 voltage_mv와 README의 Mean 2를 보여준다. 충돌 구간을 읽는다.

**예상 학생 답:** “입력과 출력이 다르므로 둘 다 필요한 설명입니다. Unit: input mV, output V로 합칠 수 있습니다.”

### 장면 4 · Git 검사와 내용 검사

**강사 발화:** “diff --check를 통과했습니다. 평균과 단위도 맞다는 뜻일까요?”

**판서:** `형식 검사: 공백·충돌 표시 등 / 내용 검사: 입력 mV, 출력 V, 평균 2`를 쓴다.

**예상 학생 답:** “형식 검사를 통과한 것이고, 수치와 의미는 CSV·손계산으로 따로 확인해야 합니다.”

## 함께 풀 사례 A · fast-forward

[연속 실습 6 A](../practice.md)와 같은 순서다. 깨끗한 main에서 시작한다.

```shell
git status
git switch -c docs/source
```

README 마지막에 `Source: synthetic sample`을 추가하고 저장한다.

```shell
git add README.md
git commit -m "docs: identify synthetic sample source"
git switch main
git show HEAD:README.md
git merge --ff-only docs/source
git log --oneline --graph --all --decorate
```

기대: main 복귀 직후에는 Source 줄이 없고, 병합 뒤에는 있다. main과 docs/source가 같은 끝 커밋을 가리킨다. `--ff-only`는 fast-forward가 가능한 경우에만 진행한다. 새 병합 커밋이 없다는 이유로 실패했다고 판정하지 않는다.

## 함께 풀 사례 B · 서로 다르게 바꾼 같은 줄

공통 출발점은 `Unit: V`다.

```shell
git switch -c docs/units
```

docs/units에서 해당 줄만 `Unit: output V`로 고친다.

```shell
git add README.md
git commit -m "docs: clarify output voltage unit"
git switch main
```

main에서는 같은 줄을 `Unit: input mV`로 고친다.

```shell
git add README.md
git commit -m "docs: clarify input voltage unit"
git merge docs/units
git status
git diff
```

기대는 README 충돌이다. 다음은 기본 형식의 설명 예시이며 설정에 따라 공통 조상 구간이 더 보일 수 있다.

```text
<<<<<<< HEAD
Unit: input mV
=======
Unit: output V
>>>>>>> docs/units
```

현재 쪽은 main의 입력 설명이고 들어오는 쪽은 docs/units의 출력 설명이다. CSV의 열 이름을 확인한 뒤 전체 충돌 구간을 다음 한 줄로 바꾼다. 표시 문자도 제거한다.

```text
Unit: input mV, output V
```

Mean: 2, Status: reviewed, Source: synthetic sample이 그대로 남아 있는지도 확인한다.

```shell
git diff --check
git add README.md
git diff --staged
git commit -m "docs: reconcile input and output unit descriptions"
git status
git log --oneline --graph --all --decorate
```

기대는 깨끗한 main과 두 이력을 연결하는 병합 커밋이다. 순서대로 재현했을 때의 예상이며 학생의 해시·날짜를 교재가 대신 정하지 않는다.

병합 중단은 별도 회차에서 깨끗한 출발점으로 충돌을 다시 만든 직후 `git merge --abort`로 시연한다. 이미 병합 커밋을 만든 뒤 쓰는 명령으로 가르치지 않는다. 미커밋 작업을 가진 일반 상황에서도 모든 내용을 완벽히 복원한다고 보장하지 않는다.

## 학생 활동 · 두 번의 병합 비교

1. 시작 상태·현재 브랜치를 기록한다. 변경이 남아 있으면 원인을 확인한 뒤 진행한다.
2. A에서 main으로 돌아오기 전후 Source 줄 존재 여부를 예측하고 확인한다.
3. A의 log 그림에 main과 docs/source 위치를 표시한다.
4. B에서 merge 직전 각 브랜치가 가진 Unit 문장을 적는다.
5. 충돌 뒤 원하는 최종 문장을 먼저 쓰고 CSV 헤더를 근거로 제시한다.
6. 표시 제거·diff 검토·add·commit을 완료한 뒤 B의 이력을 그린다.
7. A와 B의 차이를 “main이 따로 진행했는가”와 “병합 커밋이 생겼는가”로 설명한다.

**풀이 기준:** A는 main의 독립 변경이 없어 fast-forward, B는 양쪽 커밋과 같은 줄 수정 때문에 충돌한다. 내용 정답은 입력 mV·출력 V를 동시에 명시하는 문장이다. 단순히 충돌 표시만 없앤 답은 통과시키지 않는다.

## 질문·오해

- **브랜치를 만들면 GitHub에도 생기나요?** 로컬 생성만으로 원격에 전달되지 않는다. 다음 단원의 push가 필요하다.
- **merge는 항상 충돌하나요?** 자동 통합 가능한 경우도 있다. 자동 통합 성공 뒤에도 의미 검증은 필요하다.
- **충돌하면 파일이 망가진 건가요?** Git이 자동 결정을 멈춘 상태다. status와 표시를 읽고 원하는 내용을 정한다.
- **한쪽을 통째로 선택하면 빠르지 않나요?** 상대의 필요한 변경까지 잃을 수 있다. 이번 사례는 두 설명을 함께 살려야 한다.
- **main이라는 이름은 특별한 명령인가요?** 이 수업의 기본 브랜치 이름이다. 실제 프로젝트에서는 현재 이름을 확인한다.

## 통과 기준·다음·출처

받는 브랜치·합칠 브랜치를 말하고 충돌 해결의 의미적 근거를 설명하면 통과다. 다음 [06 · 원격](06-remotes.md)에서 다른 저장소와 이력을 주고받는다.

공식 문서 확인일: 2026-10-03. [git switch](https://git-scm.com/docs/git-switch), [Git 용어](https://git-scm.com/docs/gitglossary), [브랜치와 병합](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging). 기존 로컬 시나리오 검증은 [sources.md](../sources.md). 실제 공동 작업·GitHub PR 수행과는 별개다.
