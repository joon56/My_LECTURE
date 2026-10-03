# 챕터 2 출처와 검증 범위

확인일: 2026-10-03, Asia/Seoul. Git 공식 문서·Pro Git·GitHub Docs의 해당 개념과 옵션을 확인했다. 단원 순서·과제·평가·기록 양식은 이 프로젝트의 교육 제안이다.

## Git 개념과 로컬 작업

| 출처 | 사용 범위 |
|---|---|
| [What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F) | 스냅샷 모델과 로컬 작업 |
| [Git 용어](https://git-scm.com/docs/gitglossary) | 저장소·branch·HEAD·index |
| [변경 기록](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository) | 추적 여부, 파일 상태, 선택 후 커밋 |
| [git init](https://git-scm.com/docs/git-init) | 새 저장소·초기 브랜치·bare |
| [git config](https://git-scm.com/docs/git-config) | 저장소별 설정과 작성 정보 |
| [git add](https://git-scm.com/docs/git-add) | add 시점의 내용을 index에 준비 |
| [git diff](https://git-scm.com/docs/git-diff) | 작업 파일·index·HEAD 비교 |
| [git log](https://git-scm.com/docs/git-log) | 이력과 그래프 확인 |
| [gitignore](https://git-scm.com/docs/gitignore) | 미추적 파일 제외, 이미 추적된 파일의 한계 |
| [git restore](https://git-scm.com/docs/git-restore) | 작업 폴더·index 변경, 기본 복원 원본 |
| [git revert](https://git-scm.com/docs/git-revert) | 변경을 상쇄하는 새 커밋 |
| [git switch](https://git-scm.com/docs/git-switch) | 브랜치 생성·전환 |
| [기본 브랜치와 병합](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging) | fast-forward·병합·충돌 |
| [git fetch](https://git-scm.com/docs/git-fetch) | 원격 이력·참조 가져오기 |
| [git pull](https://git-scm.com/docs/git-pull) | 가져오기와 통합, 명시적 --ff-only |

## GitHub와 설명 문서

| 출처 | 사용 범위 |
|---|---|
| [What is GitHub?](https://docs.github.com/en/get-started/start-your-journey/what-is-github) | Git과 호스팅·협업 플랫폼의 역할 구분 |
| [원격에 push](https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository) | 원격 이름·브랜치, 전송 거절의 의미 |
| [인증](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github) | 접속 방식에 따른 인증 차이 |
| [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) | 브랜치·PR·검토·반영 |
| [README](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) | 프로젝트 설명과 시작 안내 |

기본 설정·자동 동작은 Git 버전과 개인 설정에 영향을 받는다. 수업은 브랜치 이름·대상 파일·원격 이름·통합 방식을 명시한다. 제품 문서의 버전과 이 컴퓨터에 설치된 Git 버전을 같다고 가정하지 않는다.

## 실행 검증 상태

- 설치 확인: `git version 2.54.0.windows.1`.
- 격리된 합성 자료로 명령 72회와 상태·내용 확인 항목 28개를 검증했다. stage 이후 수정·복구·병합·충돌·로컬 원격과의 교환을 확인했다. 환경과 상세 결과는 이번 작업 기록에 있다.
- 챕터 말 통합 실습으로 재구성한 뒤 배포용 초기 파일 네 개를 실제로 읽어 같은 격리 시나리오를 재검증했다. 실습 8의 완성 README와 문서 커밋 단계를 포함해 Git 호출 86회·내용과 상태 확인 32항목을 통과했다. 최종 문서 커밋이 자동으로 원격에 전송되지 않는 것도 확인했다. 문서 단계의 추가 세 파일은 검증용 최소 내용이며 학생의 글 품질이나 실제 수행을 검증한 결과는 아니다.
- 초기 파일과 실습 본문 일치, 8개 강의의 4장면 유지·학생 활동 절 분리, 코드 펜스·상대 파일 링크를 별도로 검사했다. 폴더 생성·편집기 저장·GitHub 웹 조작을 학생 화면에서 처음부터 수행한 검증과 구분한다.
- GitHub 계정 생성·인증·실제 원격 전송·PR은 **공식 문서 확인, 로컬 실행 미검증**.
- 학생별 운영체제·Git 설정·편집기·계정 권한, 실제 연구 프로그램의 재현은 미확인.
- 로컬 bare 저장소와의 교환 성공을 GitHub 사용 성공으로 기록하지 않는다.

이전 자료: [챕터 1 공통 측정 과제](../01-ai-use/practice.md). 이번 기본 실습은 작은 문서·합성 CSV를 사용하므로 아직 제작하지 않은 분석 프로그램에 의존하지 않는다.
