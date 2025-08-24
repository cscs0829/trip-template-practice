# 🌏 트립페이지 (Trippage)

> **최고의 여행 경험을 제공하는 여행사 웹사이트**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40+-orange.svg)](https://playwright.dev/)
[![Render](https://img.shields.io/badge/Render-Deployed-brightgreen.svg)](https://render.com/)

## 📖 **프로젝트 개요**

트립페이지는 여행자들을 위한 종합 여행 플랫폼입니다. 아름다운 여행지 소개, 실시간 예약 시스템, 그리고 사용자 친화적인 인터페이스를 제공합니다.

### ✨ **주요 기능**

- 🗺️ **여행지 탐색**: 다양한 여행지 정보와 상세 가이드
- 📅 **실시간 예약**: 간편한 여행 일정 예약 시스템
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- 🎨 **갤러리**: 여행 사진과 영상으로 생생한 여행 경험
- 📰 **뉴스 & 정보**: 최신 여행 소식과 팁
- 🔍 **검색 & 필터**: 원하는 여행지를 쉽게 찾기

## 🚀 **빠른 시작**

### **사전 요구사항**

- Node.js 18+ 
- PostgreSQL 15+
- npm 또는 yarn

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
│   ├── 📄 single-destination.html # 여행지 상세
│   ├── 📁 css/            # 스타일시트
│   ├── 📁 js/             # 자바스크립트
│   └── 📁 img/            # 이미지 리소스
├── 📁 database/           # 데이터베이스 스키마
│   └── 📄 schema.sql      # 테이블 구조 및 초기 데이터
├── 📁 tests/              # Playwright 테스트
│   ├── 📄 api-tests.spec.js    # API 테스트
│   ├── 📄 ui-tests.spec.js     # UI 테스트
│   ├── 📄 mobile-tests.spec.js # 모바일 테스트
│   ├── 📄 db-tests.spec.js     # 데이터베이스 테스트
│   └── 📄 static-tests.spec.js # 정적 파일 테스트
├── 📄 server.js           # Express 서버
├── 📄 package.json        # 프로젝트 설정
├── 📄 render.yaml         # Render 배포 설정
└── 📄 README.md           # 프로젝트 문서
```

## 🗄️ **데이터베이스 구조**

### **주요 테이블**

| 테이블명 | 설명 | 주요 필드 |
|---------|------|-----------|
| `destinations` | 여행지 정보 | id, name, slug, description, price_min, price_max, rating |
| `popular_tours` | 인기 투어 | id, name, description, price, duration, image_url |
| `news` | 여행 뉴스 | id, title, content, image_url, created_at |
| `gallery` | 여행 갤러리 | id, title, image_url, category |

### **데이터베이스 연결**

```javascript
// 환경 변수 설정
DATABASE_URL=postgresql://username:password@localhost:5432/trippage
NODE_ENV=development
PORT=3000
```

## 🔌 **API 엔드포인트**

### **여행지 관련**

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| `GET` | `/api/destinations` | 모든 여행지 목록 조회 |
| `GET` | `/api/destinations/:slug` | 특정 여행지 상세 정보 |
| `GET` | `/destination/:slug` | 여행지 상세 페이지 (HTML) |

### **기타 API**

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| `GET` | `/api/popular-tours` | 인기 투어 목록 |
| `GET` | `/api/news` | 여행 뉴스 목록 |
| `GET` | `/api/gallery` | 갤러리 이미지 목록 |

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

- ✅ **API 테스트**: 백엔드 API 엔드포인트 검증
- ✅ **UI 테스트**: 사용자 인터페이스 및 상호작용 검증
- ✅ **모바일 테스트**: 반응형 디자인 및 모바일 최적화 검증
- ✅ **데이터베이스 테스트**: 데이터 무결성 및 성능 검증
- ✅ **정적 파일 테스트**: 리소스 파일 존재 및 접근성 검증

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

- 📱 **모바일 우선**: 375px × 667px (iPhone SE) 최적화
- 💻 **태블릿**: 768px × 1024px 지원
- 🖥️ **데스크톱**: 1920px × 1080px 지원

### **터치 최적화**

- 👆 **터치 제스처**: 탭, 스와이프 지원
- 🎯 **터치 타겟**: 최소 44px × 44px 터치 영역
- 📏 **적응형 레이아웃**: 화면 크기에 따른 자동 조정

## 🛠️ **개발 도구**

### **사용된 기술 스택**

- **프론트엔드**: HTML5, CSS3, JavaScript (ES6+)
- **백엔드**: Node.js, Express.js
- **데이터베이스**: PostgreSQL
- **테스팅**: Playwright
- **배포**: Render
- **버전 관리**: Git, GitHub

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

## 🤝 **기여하기**

1. **Fork** 이 저장소
2. **Feature branch** 생성 (`git checkout -b feature/AmazingFeature`)
3. **변경사항 커밋** (`git commit -m 'Add some AmazingFeature'`)
4. **Branch에 Push** (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

## 📄 **라이선스**

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 **연락처**

- **프로젝트 링크**: [https://github.com/cscs0829/trippage-website](https://github.com/cscs0829/trippage-website)
- **이메일**: info@trippage.co.kr
- **전화**: 02-1234-5678

## 🙏 **감사의 말**

- [Express.js](https://expressjs.com/) - 웹 프레임워크
- [PostgreSQL](https://www.postgresql.org/) - 데이터베이스
- [Playwright](https://playwright.dev/) - 테스팅 프레임워크
- [Render](https://render.com/) - 클라우드 배포 플랫폼

---

⭐ **이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**
