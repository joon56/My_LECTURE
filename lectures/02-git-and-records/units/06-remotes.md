# 06 · 원격 저장소와 GitHub로 공유하기

> [!NOTE]
> **PDF 연결 | 새로 추가**
> 원본 PDF에는 clone·push·fetch·pull·GitHub PR의 직접 설명이 없다. 강사가 로컬 작업 이력을 공유·검토하는 교육 내용으로 추가했다. GitHub 인증·웹 PR 절차는 공식 문서 확인, 로컬 실행 미검증이다.

## 목표·준비·산출물

- 목표: 로컬·원격·원격 추적 참조를 구분하고 fetch와 pull의 차이를 관찰한다.
- 준비: 단원 5까지 마친 깨끗한 main. GitHub 경로는 계정·권한·인증 준비가 추가로 필요하다.
- 산출물: 원격 주소 확인, 두 작업 복사본의 상태 비교, PR 설명 또는 PR 미수행 기록.
- 경로 선택: A GitHub와 B 로컬 대체는 각각 별도 연습 복사본에서 진행한다. origin을 중복 등록하지 않는다.

## 개념 설명

**remote**는 다른 Git 저장소 주소에 붙인 이름과 설정이다. `origin`은 흔히 쓰는 이름이며 GitHub 자체를 뜻하지 않는다. 원격은 GitHub일 수도 있고 다른 서버나 별도 로컬 폴더일 수도 있다. `git remote -v`로 실제 주소를 확인한다.

**clone**은 기존 저장소로부터 새 작업 복사본을 만든다. 일반적인 clone은 이력과 원격 연결도 가져온다. ZIP 다운로드는 특정 시점 파일을 받는 방식이므로 같은 이력·연결을 가진 작업 저장소 복제와 구분한다. clone할 때 기존 작업 폴더에 덮어쓰지 않고 새 위치를 쓴다.

**push**는 로컬 커밋을 원격 브랜치에 전달한다. 저장한 모든 파일이나 아직 커밋하지 않은 내용까지 보내는 폴더 동기화 기능이 아니다. `-u`는 이후 비교·동기화에 사용할 upstream 연결을 설정한다. **fetch**는 원격 이력과 참조를 가져오지만 현재 작업 브랜치에 바로 통합하지 않는다. `origin/main`은 마지막으로 가져온 원격 상태를 나타내는 로컬 참조라서 실시간 서버 상태와 다를 수 있다.

**pull**은 fetch 뒤 현재 브랜치에 통합한다. 수업은 `pull --ff-only`로 fast-forward가 가능한 경우만 허용한다. 양쪽 이력이 갈라졌다면 멈추고 상태를 읽는다. 오류를 없애려고 강제 push부터 사용하지 않는다.

**Pull Request(PR)** 는 GitHub에서 브랜치 변경의 반영과 검토를 요청하는 기능이다. `git pull` 명령과 다르다. PR을 만들면 무엇을 왜 바꿨는지, 무엇을 검증했는지, 남은 한계가 무엇인지 설명한다. 검토자가 diff와 증거를 보고 판단할 수 있어야 한다.

## 강사 진행 장면

### 장면 1 · 커밋했는데 웹에 없다

**강사 발화:** “로컬 log에는 새 커밋이 있는데 웹에는 없습니다. 우선 무엇을 확인할까요?”

**판서:** `로컬 commit 생성 / 원격 주소 / push 수행 / 웹 대상 브랜치`를 순서대로 쓴다.

**예상 학생 답:** “commit만 했는지, 올바른 주소와 브랜치로 push했는지 확인합니다.”

### 장면 2 · 인증과 작성자

**강사 발화:** “user.email을 설정해도 GitHub 접근 권한이 생기지는 않습니다. 작성 정보와 인증은 따로 확인합니다.”

**화면:** 공식 인증 안내에서 학생 도구에 맞는 HTTPS·자격 증명 관리자·GitHub CLI 또는 SSH 경로를 선택한다. 토큰이나 개인 키 화면을 수업 자료로 캡처하지 않는다.

**예상 학생 답:** “작성자 표기와 계정 접근을 증명하는 인증은 다릅니다.”

### 장면 3 · 가져왔지만 파일은 그대로

**강사 발화:** “fetch를 했는데 README의 새 문장이 아직 보이지 않습니다. log에서 main..origin/main을 보면 새 커밋은 있습니다. 무엇이 바뀐 걸까요?”

**화면:** 원본의 HEAD 내용과 origin/main이 앞선 상태를 비교한다.

**예상 학생 답:** “원격 추적 참조와 이력은 갱신됐고 현재 main에는 아직 통합하지 않았습니다.”

### 장면 4 · 검토 요청 쓰기

**강사 발화:** “PR 설명에 ‘잘 됩니다’라고만 쓰면 짝이 무엇을 확인할 수 있을까요? 입력과 검증 방법을 함께 써봅시다.”

**판서:** `문제 / 변경 / 실제 검증 / 한계`를 쓰고 샘플 설명을 채운다.

**예상 학생 답:** “합성 CSV의 1·2·3V를 손계산해 평균 2V를 확인했고, 프로그램 구현·실행은 하지 않았다고 적습니다.”

## 함께 풀 사례 A · GitHub에 연결하기

**공식 문서 확인, GitHub에서의 로컬 실행 미검증.** 이 경로는 학생이 직접 수행한 결과를 나중에 기록한다.

1. 공유 가능한 합성 파일만 있는지 검토한다. 실제 연구 자료는 담당자와 반출 범위를 확인한다. private 저장소도 외부 서비스 전송이다.
2. GitHub에 빈 연습 저장소를 만든다. 이 경로에서는 웹에서 README·라이선스·gitignore를 추가 초기화하지 않는다.
3. 공식 안내로 인증한다. 계정 암호·토큰·개인 키를 문서나 원격 URL에 넣지 않는다.
4. 아래 `REPOSITORY_URL`을 GitHub에서 복사한 실제 저장소 주소로 바꾼다. 예시 문자열을 그대로 실행하지 않는다.

```shell
git remote add origin REPOSITORY_URL
git remote -v
git status
git push -u origin main
```

origin이 이미 있으면 기존 주소부터 확인한다. 위 명령을 성공시키려고 임의로 덮어쓰지 않는다. 웹에서 파일과 커밋·브랜치를 확인한 뒤 별도 부모 폴더에서 복제한다.

```shell
git clone REPOSITORY_URL git-lab-copy
```

원본에 `docs/readme-review` 브랜치를 만들고 README 설명을 개선·검토·커밋한 뒤 해당 브랜치를 push한다. GitHub에서 main을 대상으로 PR을 만든다. 웹 메뉴 위치는 사용하는 UI에서 확인한다.

```text
문제: README에서 입력 mV와 출력 V의 관계를 이해하기 어렵다.
변경: 샘플 평균 계산식과 입력·출력 단위를 설명했다.
검증: 합성 CSV의 1, 2, 3V를 손계산해 평균 2V 확인.
한계: 분석 프로그램 구현·실행은 이번 변경 범위에 없다.
```

이 문구도 실제 해당 변경과 확인을 했을 때만 자신의 PR에 쓴다. 검토·반영은 공유 권한과 실제 검토 결과에 따라 진행한다.

## 함께 풀 사례 B · 계정 없이 원격 동작 확인하기

[연속 실습 7 B](../practice.md)와 동일하다. 원본 git-lab의 부모 위치에 아래 이름의 폴더가 없는지 먼저 확인한다. 기존 자료를 덮어쓰지 않는다.

```shell
git init --bare -b main ../remote-demo.git
git remote add origin ../remote-demo.git
git push -u origin main
git clone ../remote-demo.git ../git-lab-copy
```

bare 저장소는 일반 작업 파일을 편집하는 폴더가 아니라 이력을 주고받는 역할이다. 별도 복사본 git-lab-copy를 열고 작성 정보를 저장소별로 설정한다.

```shell
git config --local user.name "Second Workspace"
git config --local user.email "second@example.invalid"
```

복사본 README에 `Reviewed by a second workspace.`를 추가하고 저장한다.

```shell
git add README.md
git commit -m "docs: record second workspace review"
git push origin main
```

이제 원본 git-lab의 깨끗한 main으로 돌아간다.

```shell
git fetch origin
git status -sb
git log --oneline main..origin/main
git show HEAD:README.md
git pull --ff-only origin main
git show HEAD:README.md
```

기대: fetch 후 origin/main이 앞서지만 원본 HEAD에는 새 문장이 없다. pull 후에는 문장이 들어온다. 로컬 폴더끼리의 성공으로 GitHub 인증·웹 PR까지 성공했다고 기록하지 않는다.

## 학생 활동·풀이 기준

1. A 또는 B를 선택하고 선택 이유와 수행 범위를 기록한다.
2. remote -v에서 실제 대상 주소를 확인한다. 비밀값이 포함된 출력은 공유하지 않는다.
3. **A 경로:** 원본의 feature 브랜치 push와 웹 PR의 대상·변경을 확인한다. clone한 복사본의 main과 원격 주소를 확인하고, PR 생성만으로 main에 반영되지는 않는다고 설명한다. PR 병합은 실제 검토·반영을 했을 때만 기록한다.
4. **B 경로:** 복사본의 main을 바꾸고 push하기 전에 원본 파일이 바뀔지 예측한다. 원본에서 fetch 전·후·pull 후의 HEAD 내용과 origin/main 위치를 각각 비교한다.
5. “원격에서 변경을 받았다”를 이력 수신과 현재 브랜치 통합으로 나눠 설명한다. A에서 통합을 수행하지 않았다면 B 사례의 예상 상태로 답하고 직접 관찰했다고 적지 않는다.
6. A 미수행이면 “GitHub 인증·PR 미수행”, B 수행이면 “로컬 bare 원격 교환 확인”으로 적는다.

**정답 핵심:** clone은 저장소 복제, push는 커밋 전송, fetch는 가져오기, pull은 가져오기 후 통합, PR은 검토 요청이다. 다섯 동작을 예와 연결하고 관찰 범위를 과장하지 않아야 통과한다.

## 질문·다음·출처

- **push가 거절됐어요.** 주소·권한·대상 브랜치·원격의 새 변경을 확인한다. 강제 전송을 기본 처방으로 쓰지 않는다.
- **pull --ff-only가 실패했어요.** 이력이 갈라졌을 수 있다. status와 log로 분기를 읽고 통합 계획을 정한다.
- **ZIP만 받아도 PR 가능한가요?** 이력·원격 연결을 가진 Git 작업 흐름과 다르다. 수업은 clone한 저장소를 기준으로 진행한다.

다음 [07 · 기록과 README](07-records.md)에서 검증과 판단을 다른 사람이 읽을 수 있게 정리한다.

공식 문서 확인일: 2026-10-03. [fetch](https://git-scm.com/docs/git-fetch), [pull](https://git-scm.com/docs/git-pull), [GitHub 인증](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github), [push](https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository), [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow). 검증 범위는 [sources.md](../sources.md).
