# 트립페이지 테스트 가이드

Playwright를 사용한 종합적인 웹사이트 테스트 가이드입니다.

## 🚀 테스트 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. Playwright 브라우저 설치
```bash
npm run playwright:install
```

### 3. 테스트 실행

#### 전체 테스트 실행
```bash
npm test
```

#### 특정 테스트 실행
```bash
# API 테스트만 실행
npm run test:api

# UI 테스트만 실행
npm run test:ui

# 데이터베이스 테스트만 실행
npm run test:db

# 모바일 테스트만 실행
npm run test:mobile

# 데스크톱 테스트만 실행
npm run test:desktop
```

#### 헤드리스 모드로 실행 (브라우저 창 표시)
```bash
npm run test:headed
```

#### HTML 리포트 생성
```bash
npm run test:all
```

## 📱 테스트 종류

### 1. API 테스트 (`api-tests.spec.js`)
- 데이터베이스 연결 상태 확인
- API 엔드포인트 응답 검증
- 데이터 구조 및 타입 검증
- 에러 핸들링 테스트

### 2. UI 테스트 (`ui-tests.spec.js`)
- 웹페이지 로딩 및 기본 요소 확인
- 네비게이션 및 사이드바 기능
- 폼 입력 및 버튼 동작
- 페이지 간 이동 및 링크 검증

### 3. 모바일 테스트 (`mobile-tests.spec.js`)
- 모바일 뷰포트에서의 레이아웃
- 터치 이벤트 및 제스처
- 반응형 디자인 검증
- 모바일 전용 UI 요소 확인

### 4. 데이터베이스 테스트 (`db-tests.spec.js`)
- 데이터 무결성 검증
- 데이터베이스 성능 테스트
- 관계 및 일관성 확인
- 에러 핸들링 및 예외 상황

## 🔧 테스트 환경 설정

### 로컬 개발환경
1. PostgreSQL 데이터베이스 실행
2. 환경변수 설정 (`.env` 파일)
3. 데이터베이스 스키마 적용
4. `npm run dev`로 서버 실행
5. `npm test`로 테스트 실행

### CI/CD 환경
- GitHub Actions에서 자동 테스트 실행
- Render 배포 전 테스트 검증
- 테스트 실패 시 배포 차단

## 📊 테스트 결과 확인

### HTML 리포트
```bash
npm run test:all
```
- `playwright-report/` 폴더에 상세 리포트 생성
- 테스트 실행 과정 및 스크린샷 확인
- 실패한 테스트의 상세 정보

### JSON 결과
```bash
npm test
```
- `test-results/results.json` 파일에 결과 저장
- CI/CD 파이프라인에서 결과 분석 가능

### JUnit 결과
```bash
npm test
```
- `test-results/results.xml` 파일에 JUnit 형식으로 저장
- Jenkins, GitLab CI 등에서 호환

## 🐛 문제 해결

### 테스트 실패 시 확인사항
1. **데이터베이스 연결**: PostgreSQL 서비스가 실행 중인지 확인
2. **서버 실행**: `npm run dev`로 서버가 정상 실행되는지 확인
3. **환경변수**: `.env` 파일의 데이터베이스 연결 정보 확인
4. **브라우저 설치**: `npm run playwright:install` 실행 여부 확인

### 일반적인 문제들
- **타임아웃 에러**: API 응답 시간이 길어서 발생, `waitForTimeout` 값 조정
- **요소를 찾을 수 없음**: CSS 선택자 변경 또는 페이지 로딩 대기 시간 증가
- **데이터베이스 연결 실패**: 연결 문자열 및 PostgreSQL 서비스 상태 확인

## 📝 테스트 작성 가이드

### 새로운 테스트 추가
```javascript
test('테스트 설명', async ({ page }) => {
  // 테스트 코드 작성
  await page.goto('/');
  await expect(page.locator('.element')).toBeVisible();
});
```

### 테스트 그룹화
```javascript
test.describe('기능 그룹', () => {
  test('테스트 1', async ({ page }) => {});
  test('테스트 2', async ({ page }) => {});
});
```

### 조건부 테스트
```javascript
test('조건부 테스트', async ({ page }) => {
  const element = page.locator('.element');
  if (await element.isVisible()) {
    await expect(element).toHaveText('예상 텍스트');
  }
});
```

## 🎯 테스트 커버리지

### 현재 테스트 범위
- ✅ 메인 페이지 (데스크톱/모바일)
- ✅ 여행지 목록 및 상세 페이지
- ✅ 갤러리 및 뉴스 페이지
- ✅ 네비게이션 및 사이드바
- ✅ 로그인 폼 및 사용자 인터페이스
- ✅ API 엔드포인트 및 데이터베이스 연동
- ✅ 반응형 디자인 및 모바일 최적화

### 향후 추가 예정
- 🔄 결제 프로세스 테스트
- 🔄 사용자 인증 및 권한 테스트
- 🔄 검색 및 필터링 기능 테스트
- 🔄 성능 및 부하 테스트

## 📞 지원

테스트 관련 문제나 질문이 있으시면:
1. GitHub Issues에 문제 등록
2. 테스트 로그 및 스크린샷 첨부
3. 재현 가능한 단계 명시
