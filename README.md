# 🚀 트립페이지 - 여행 웹사이트 및 API 서버

> **최신 업데이트**: ✨ 토스 스타일 UI/UX 대폭 개선 및 실시간 중복 검증 시스템 구현 완료!

[![GitHub stars](https://img.shields.io/github/stars/cscs0829/trippage-website)](https://github.com/cscs0829/trippage-website/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/cscs0829/trippage-website)](https://github.com/cscs0829/trippage-website/network)
[![GitHub issues](https://img.shields.io/github/issues/cscs0829/trippage-website)](https://github.com/cscs0829/trippage-website/issues)
[![GitHub license](https://img.shields.io/github/license/cscs0829/trippage-website)](https://github.com/cscs0829/trippage-website/blob/master/LICENSE)

## 🌟 **새로운 기능 (2025년 1월 업데이트)**

### 🎨 **토스 스타일 UI/UX 대폭 개선**
- **프로필 모달**: 토스와 동일한 디자인 언어 적용
- **그라데이션 헤더**: 오렌지 그라데이션으로 브랜드 아이덴티티 강화
- **부드러운 애니메이션**: fadeInUp, shake 등 세련된 애니메이션 효과
- **모던한 그림자**: 25px 그림자로 깊이감 있는 디자인

### 🔒 **실시간 중복 검증 시스템**
- **이메일 중복 검증**: 타이핑 중단 후 500ms 자동 검증
- **전화번호 중복 검증**: 한국 전화번호 형식 + 중복 체크
- **사용자별 구분**: 본인 정보 수정 시 중복으로 처리하지 않음
- **즉시 피드백**: 실시간 에러/성공 메시지 표시

### 📱 **반응형 모달 최적화**
- **가운데 정렬**: 화면 정중앙에 고정된 모달 위치
- **스크롤 지원**: 긴 내용도 잘리지 않는 스크롤 가능한 모달
- **모바일 최적화**: 모든 화면 크기에서 완벽한 사용자 경험

## 🎯 **주요 기능**

* 🌍 **여행지 정보**: 다양한 여행지 정보와 상세 가이드
* 📅 **실시간 예약**: 간편한 여행 일정 예약 시스템
* 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 경험
* 🎨 **갤러리**: 여행 사진과 영상으로 생생한 여행 경험
* 📰 **뉴스 & 정보**: 최신 여행 소식과 팁
* 🔍 **검색 & 필터**: 원하는 여행지를 쉽게 찾기
* 🔐 **토스 스타일 인증**: 현대적이고 안전한 사용자 인증 시스템

## 🚀 **빠른 시작**

### **사전 요구사항**

* Node.js 18+
* PostgreSQL 15+
* npm 또는 yarn

### **설치 및 실행**

```bash
# 저장소 클론
git clone https://github.com/cscs0829/trippage-website.git
cd trippage-website

# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env
# .env 파일에서 데이터베이스 설정 수정

# 데이터베이스 스키마 적용
psql -U your_username -d your_database -f database/schema.sql

# 개발 서버 실행
npm run dev

# 브라우저에서 확인
open http://localhost:3000
```

## 🏗️ **프로젝트 구조**

```
트립페이지 홈페이지/
├── 📁 trippage/           # 프론트엔드 HTML/CSS/JS
│   ├── 📄 index.html      # 메인 페이지
│   ├── 📄 destination.html # 여행지 목록
│   ├── 📄 single-destination.html # 여행지 상세 (토스 스타일 모달 포함)
│   ├── 📁 css/            # 스타일시트
│   │   ├── 📄 main.css    # 메인 스타일 (토스 스타일 포함)
│   │   ├── 📄 board.css   # 게시판 스타일
│   │   └── 📄 destination.css # 여행지 스타일
│   ├── 📁 js/             # 자바스크립트
│   │   ├── 📄 navbar.js   # 네비게이션 바
│   │   ├── 📄 toss-auth.js # 토스 스타일 인증 시스템
│   │   └── 📄 main.js     # 메인 기능
│   └── 📁 img/            # 이미지 리소스
├── 📁 database/           # 데이터베이스 스키마
│   └── 📄 schema.sql      # 테이블 구조 및 초기 데이터
├── 📁 tests/              # Playwright 테스트
├── 📄 server.js           # Express 서버
├── 📄 package.json        # 프로젝트 설정
├── 📄 render.yaml         # Render 배포 설정
└── 📄 README.md           # 프로젝트 문서
```

## 🎨 **토스 스타일 디자인 시스템**

### **컬러 팔레트**
```css
:root {
    --primary-color: #f25601;      /* 토스 오렌지 */
    --secondary-color: #ea1350;    /* 토스 핑크 */
    --accent-color: #667eea;       /* 토스 블루 */
    --success-color: #28a745;      /* 성공 그린 */
    --danger-color: #dc3545;       /* 에러 레드 */
}
```

### **타이포그래피**
- **헤더**: Montserrat-Bold, 24px
- **본문**: Roboto-Regular, 16px
- **라벨**: Montserrat-SemiBold, 15px

### **컴포넌트 스타일**
- **버튼**: 16px 패딩, 16px 둥근 모서리
- **입력 필드**: 18px 패딩, 16px 둥근 모서리
- **모달**: 20px 둥근 모서리, 25px 그림자

## 🔒 **중복 검증 시스템 아키텍처**

### **실시간 검증 플로우**
```
사용자 입력 → 500ms 대기 → 형식 검증 → 중복 검증 → 결과 표시
```

### **검증 함수들**
```javascript
// 이메일 중복 검증
validateEmailUniqueness(email, currentUserId)

// 전화번호 중복 검증  
validatePhoneUniqueness(phone, currentUserId)

// 실시간 검증 설정
setupRealTimeEmailValidation(inputElement, errorElement, currentUserId)
setupRealTimePhoneValidation(inputElement, errorElement, currentUserId)
```

### **에러 처리**
- **형식 오류**: 즉시 표시
- **중복 오류**: 500ms 후 표시
- **성공**: 에러 메시지 자동 숨김

## 🗄️ **데이터베이스 구조**

### **주요 테이블**

| 테이블명           | 설명     | 주요 필드                                                       |
| -------------- | ------ | ----------------------------------------------------------- |
| destinations   | 여행지 정보 | id, name, slug, description, price_min, price_max, rating |
| popular_tours | 인기 투어  | id, name, description, price, duration, image_url          |
| news           | 여행 뉴스  | id, title, content, image_url, created_at                 |
| gallery        | 여행 갤러리 | id, title, image_url, category                             |

### **데이터베이스 연결**

```bash
# 환경 변수 설정
DATABASE_URL=postgresql://username:password@localhost:5432/trippage
NODE_ENV=development
PORT=3000
```

## 🔌 **API 엔드포인트**

### **여행지 관련**

| 메서드 | 엔드포인트                   | 설명                |
| --- | ----------------------- | ----------------- |
| GET | /api/destinations       | 모든 여행지 목록 조회      |
| GET | /api/destinations/:slug | 특정 여행지 상세 정보      |
| GET | /destination/:slug      | 여행지 상세 페이지 (HTML) |

### **기타 API**

| 메서드 | 엔드포인트              | 설명         |
| --- | ------------------ | ---------- |
| GET | /api/popular-tours | 인기 투어 목록   |
| GET | /api/news          | 여행 뉴스 목록   |
| GET | /api/gallery       | 갤러리 이미지 목록 |

## 🧪 **테스트**

### **테스트 실행**

```bash
# 모든 테스트 실행
npm test

# 특정 테스트 실행
npm run test:api      # API 테스트만
npm run test:ui       # UI 테스트만
npm run test:mobile   # 모바일 테스트만
npm run test:db       # 데이터베이스 테스트만

# 헤드리스 모드로 테스트
npm run test:headed

# Playwright 설치
npm run playwright:install
```

### **테스트 커버리지**

* ✅ **API 테스트**: 백엔드 API 엔드포인트 검증
* ✅ **UI 테스트**: 사용자 인터페이스 및 상호작용 검증
* ✅ **모바일 테스트**: 반응형 디자인 및 모바일 최적화 검증
* ✅ **데이터베이스 테스트**: 데이터 무결성 및 성능 검증
* ✅ **정적 파일 테스트**: 리소스 파일 존재 및 접근성 검증

## 🚀 **Render 배포**

### **자동 배포 설정**

이 프로젝트는 Render Blueprint를 사용하여 자동으로 배포됩니다.

1. **Render 웹사이트 접속**: https://render.com
2. **"New +" → "Blueprint" 선택**
3. **GitHub 저장소 연결**: `cscs0829/trippage-website`
4. **자동 배포 실행**

### **배포 구성**

```yaml
services:
  # PostgreSQL 데이터베이스
  - type: pserv
    name: trippage-db
    env: postgresql
    plan: free
    
  # Node.js 웹 서비스
  - type: web
    name: trippage-web
    env: node
    buildCommand: npm install
    startCommand: npm start
```

## 📱 **모바일 최적화**

### **반응형 디자인**

* 📱 **모바일 우선**: 375px × 667px (iPhone SE) 최적화
* 💻 **태블릿**: 768px × 1024px 지원
* 🖥️ **데스크톱**: 1920px × 1080px 지원

### **터치 최적화**

* 👆 **터치 제스처**: 탭, 스와이프 지원
* 🎯 **터치 타겟**: 최소 44px × 44px 터치 영역
* 📏 **적응형 레이아웃**: 화면 크기에 따른 자동 조정

## 🛠️ **개발 도구**

### **사용된 기술 스택**

* **프론트엔드**: HTML5, CSS3, JavaScript (ES6+)
* **백엔드**: Node.js, Express.js
* **데이터베이스**: PostgreSQL
* **테스팅**: Playwright
* **배포**: Render
* **버전 관리**: Git, GitHub

### **개발 스크립트**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "playwright test",
    "test:api": "playwright test api-tests.spec.js",
    "test:ui": "playwright test ui-tests.spec.js",
    "test:mobile": "playwright test mobile-tests.spec.js",
    "test:db": "playwright test db-tests.spec.js",
    "playwright:install": "playwright install"
  }
}
```

## 🆕 **최신 업데이트 내역**

### **v2.1.0 (2025-01-XX)**
- ✨ 토스 스타일 UI/UX 대폭 개선
- 🔒 실시간 이메일/전화번호 중복 검증 시스템
- 📱 반응형 모달 레이아웃 최적화
- 🎨 프로필 모달 토스 스타일 디자인 적용
- 🚀 실시간 폼 검증 및 사용자 피드백 개선

### **v2.0.0 (2024-12-XX)**
- 🎯 기본 여행 웹사이트 기능 구현
- 📱 반응형 디자인 적용
- 🗄️ PostgreSQL 데이터베이스 연동
- 🧪 Playwright 테스트 시스템 구축

## 🤝 **기여하기**

1. **Fork** 이 저장소
2. **Feature branch** 생성 (`git checkout -b feature/AmazingFeature`)
3. **변경사항 커밋** (`git commit -m 'Add some AmazingFeature'`)
4. **Branch에 Push** (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

## 📄 **라이선스**

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.

## 📞 **연락처**

* **프로젝트 링크**: https://github.com/cscs0829/trippage-website
* **이메일**: info@trippage.co.kr
* **전화**: 02-1234-5678

## 🙏 **감사의 말**

* Express.js - 웹 프레임워크
* PostgreSQL - 데이터베이스
* Playwright - 테스팅 프레임워크
* Render - 클라우드 배포 플랫폼
* **토스 (Toss)** - UI/UX 디자인 인스피레이션

---

⭐ **이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**

## 📸 **스크린샷**

### 🎨 **토스 스타일 프로필 모달**
![프로필 모달](https://via.placeholder.com/800x600/f25601/ffffff?text=토스+스타일+프로필+모달)

### 📱 **반응형 디자인**
![반응형 디자인](https://via.placeholder.com/800x600/667eea/ffffff?text=반응형+디자인)

### 🔒 **중복 검증 시스템**
![중복 검증](https://via.placeholder.com/800x600/28a745/ffffff?text=실시간+중복+검증)
