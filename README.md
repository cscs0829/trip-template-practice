# 트립페이지 - 여행 웹사이트

[![Render Status](https://img.shields.io/badge/Render-Deployed-success)](https://trippage-web.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/cscs0829/trippage-website)

## 🎯 **프로젝트 개요**

**트립페이지**는 20년간 여행업계에서 쌓은 노하우를 바탕으로 고객에게 최고의 여행 경험을 제공하는 전문 여행사 웹사이트입니다. 

### 🌟 **주요 특징**

- **🎨 토스 스타일 UI/UX**: 모던하고 직관적인 사용자 인터페이스
- **📱 완벽한 반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **🔒 보안 강화된 권한 시스템**: 관리자와 일반 사용자 권한 분리
- **🗄️ PostgreSQL 데이터베이스**: 안정적이고 확장 가능한 데이터 관리
- **🧪 Playwright 테스트**: 자동화된 품질 보증 시스템
- **☁️ Render 클라우드 배포**: 안정적인 서비스 운영

## 🚀 **실행 방법**

### **로컬 개발 환경**

```bash
# 저장소 클론
git clone https://github.com/cscs0829/trippage-website.git
cd trippage-website

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 확인
open http://localhost:3000
```

### **테스트 실행**

```bash
# 모든 테스트 실행
npm test

# 특정 테스트 실행
npm run test:api      # API 테스트만
npm run test:ui       # UI 테스트만
npm run test:mobile   # 모바일 테스트만
npm run test:db       # 데이터베이스 테스트만

# Playwright 설치
npm run playwright:install
```

## 🔐 **권한 시스템**

### **관리자 권한 (admin@trippage.com)**

- **갤러리**: 이미지 추가/삭제 가능
- **게시판**: 모든 사용자의 게시글 수정/삭제 가능
- **사용자 관리**: 전체 사용자 정보 관리

### **일반 사용자 권한**

- **갤러리**: 이미지 조회만 가능
- **게시판**: 자신이 작성한 게시글만 수정/삭제 가능
- **프로필**: 개인 정보 수정 가능

### **권한 확인 방식**

```javascript
// 관리자 여부 확인
function isAdmin() {
    try {
        const u = JSON.parse(localStorage.getItem('currentUser'));
        return !!(u && u.email === 'admin@trippage.com');
    } catch (e) {
        return false;
    }
}

// 게시글 수정 권한 확인
function canUserEditPost(post, user) {
    if (!user || !post) return false;
    // 관리자는 모든 글 수정/삭제 가능, 일반 사용자는 자신의 글만
    return user.email === 'admin@trippage.com' || user.id === post.author_id;
}
```

## 🎨 **UI/UX 시스템**

### **토스 스타일 디자인 가이드**

#### **컬러 팔레트**
```css
:root {
    --primary-color: #f25601;      /* 토스 오렌지 */
    --secondary-color: #ea1350;    /* 토스 핑크 */
    --accent-color: #667eea;       /* 토스 블루 */
    --success-color: #28a745;      /* 성공 그린 */
    --danger-color: #dc3545;       /* 에러 레드 */
}
```

#### **타이포그래피**
- **헤더**: Montserrat-Bold, 24px
- **본문**: Roboto-Regular, 16px
- **라벨**: Montserrat-SemiBold, 15px

#### **컴포넌트 스타일**
- **버튼**: 16px 패딩, 16px 둥근 모서리
- **입력 필드**: 18px 패딩, 16px 둥근 모서리
- **모달**: 20px 둥근 모서리, 25px 그림자

## 🗄️ **데이터베이스 구조**

### **주요 테이블**

| 테이블명           | 설명     | 주요 필드                                                       |
| -------------- | ------ | ----------------------------------------------------------- |
| destinations   | 여행지 정보 | id, name, slug, description, price_min, price_max, rating |
| popular_tours | 인기 투어  | id, name, description, price, duration, image_url          |
| news           | 여행 뉴스  | id, title, content, image_url, created_at                 |
| gallery        | 여행 갤러리 | id, title, image_url, category                             |
| users          | 사용자 정보 | id, name, email, phone, created_at                         |
| board          | 게시판     | id, title, content, author_id, created_at                  |

## 🔌 **API 엔드포인트**

### **인증 관련**
| 메서드 | 엔드포인트           | 설명         |
| --- | --------------- | ---------- |
| POST | /api/auth/login | 사용자 로그인   |
| POST | /api/auth/register | 사용자 회원가입 |
| PUT  | /api/auth/profile | 프로필 수정    |

### **갤러리 관련**
| 메서드 | 엔드포인트                | 설명           |
| --- | -------------------- | ------------ |
| GET  | /api/gallery         | 갤러리 이미지 목록 |
| POST | /api/admin/gallery   | 이미지 추가 (관리자) |
| DELETE | /api/admin/gallery/:id | 이미지 삭제 (관리자) |

### **게시판 관련**
| 메서드 | 엔드포인트        | 설명           |
| --- | ------------ | ------------ |
| GET  | /api/board         | 게시글 목록     |
| POST | /api/board         | 게시글 작성     |
| PUT  | /api/board/:id     | 게시글 수정     |
| DELETE | /api/board/:id  | 게시글 삭제     |

## 🧪 **테스트 시스템**

### **테스트 커버리지**

* ✅ **API 테스트**: 백엔드 API 엔드포인트 검증
* ✅ **UI 테스트**: 사용자 인터페이스 및 상호작용 검증
* ✅ **모바일 테스트**: 반응형 디자인 및 모바일 최적화 검증
* ✅ **데이터베이스 테스트**: 데이터 무결성 및 성능 검증
* ✅ **권한 테스트**: 관리자/일반 사용자 권한 검증

### **테스트 실행 예시**

```bash
# 특정 페이지 테스트
npx playwright test gallery.spec.js
npx playwright test board.spec.js

# 헤드리스 모드
npx playwright test --headless

# 특정 브라우저
npx playwright test --project=chromium
```

## 🚀 **Render 배포**

### **자동 배포 설정**

이 프로젝트는 Render Blueprint를 사용하여 자동으로 배포됩니다.

1. **Render 웹사이트 접속**: [https://render.com](https://render.com)
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

### **v2.2.0 (2025-01-XX)**

* 🔒 **권한 시스템 대폭 개선**: 관리자/일반 사용자 권한 분리 및 보안 강화
* 🎨 **갤러리 관리 시스템**: 관리자 전용 이미지 추가/삭제 기능
* 📝 **게시판 권한 관리**: 관리자는 모든 글, 일반 사용자는 자신의 글만 수정/삭제
* 🚫 **관리자 로그인 모달 제거**: navbar 로그인 시스템과 통합
* 🧹 **코드 정리**: 불필요한 관리자 로그인 관련 스타일 및 코드 제거

### **v2.1.0 (2025-01-XX)**

* ✨ 토스 스타일 UI/UX 대폭 개선
* 🔒 실시간 이메일/전화번호 중복 검증 시스템
* 📱 반응형 모달 레이아웃 최적화
* 🎨 프로필 모달 토스 스타일 디자인 적용
* 🚀 실시간 폼 검증 및 사용자 피드백 개선

### **v2.0.0 (2024-12-XX)**

* 🎯 기본 여행 웹사이트 기능 구현
* 📱 반응형 디자인 적용
* 🗄️ PostgreSQL 데이터베이스 연동
* 🧪 Playwright 테스트 시스템 구축

## 🤝 **기여하기**

1. **Fork** 이 저장소
2. **Feature branch** 생성 (`git checkout -b feature/AmazingFeature`)
3. **변경사항 커밋** (`git commit -m 'Add some AmazingFeature'`)
4. **Branch에 Push** (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

## 📄 **라이선스**

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.

## 📞 **연락처**

* **프로젝트 링크**: [https://github.com/cscs0829/trippage-website](https://github.com/cscs0829/trippage-website)
* **웹사이트**: [https://trippage-web.onrender.com](https://trippage-web.onrender.com)
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
