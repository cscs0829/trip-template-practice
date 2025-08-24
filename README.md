# 트립페이지 (TripPage)

동적 여행 상품 웹사이트 - PostgreSQL과 Node.js를 사용한 여행지 정보 관리 시스템

## 🚀 기능

- **동적 여행지 관리**: PostgreSQL 데이터베이스를 통한 여행지 정보 관리
- **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- **실시간 가격 계산**: 인원수에 따른 실시간 총 가격 계산
- **SEO 최적화**: 각 여행지별 동적 메타 태그 생성
- **API 기반**: RESTful API를 통한 데이터 관리

## 🛠 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Deployment**: Render
- **Icons**: Ionicons

## 📦 설치 및 실행

### 로컬 개발환경

1. **저장소 클론**
   ```bash
   git clone <your-repo-url>
   cd trippage
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경변수 설정**
   ```bash
   cp env.example .env
   ```
   `.env` 파일에서 데이터베이스 연결 정보를 설정하세요.

4. **데이터베이스 설정**
   ```bash
   # PostgreSQL에서 데이터베이스 생성 후
   psql -d your_database -f database/schema.sql
   ```

5. **개발 서버 실행**
   ```bash
   npm run dev
   ```

## 🌐 Render 배포

### 1. GitHub 저장소 준비
- 코드를 GitHub에 푸시

### 2. Render에서 PostgreSQL 생성
1. [Render](https://render.com)에 로그인
2. "New" → "PostgreSQL" 선택
3. 데이터베이스 이름: `trippage-db`
4. 생성 후 연결 정보 확인

### 3. 데이터베이스 초기화
```bash
# Render PostgreSQL에 스키마 적용
psql $DATABASE_URL -f database/schema.sql
```

### 4. 웹 서비스 배포
1. "New" → "Web Service" 선택
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `trippage-web`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: PostgreSQL 서비스에서 자동 생성된 URL 사용

## 📊 데이터베이스 구조

### destinations (여행지)
- `id`: 기본키
- `name`: 여행지 이름
- `title`: 페이지 제목
- `description`: 상세 설명
- `highlights`: 하이라이트 (배열)
- `price_min`, `price_max`: 가격 범위
- `rating`: 평점
- `image_url`: 이미지 URL
- `location_info`: 위치 정보
- `schedule`: 일정
- `includes`: 포함 사항 (배열)
- `slug`: URL 슬러그

### popular_tours (인기 여행상품)
- 메인페이지에 표시되는 인기 상품

### news (뉴스)
- 여행 관련 뉴스 및 정보

## 🔗 API 엔드포인트

- `GET /api/destinations` - 모든 여행지 목록
- `GET /api/destinations/:slug` - 특정 여행지 상세 정보
- `GET /api/popular-tours` - 인기 여행상품
- `GET /api/news` - 뉴스 목록
- `GET /api/news/:slug` - 특정 뉴스 상세 정보

## 📱 페이지 구조

- `/` - 메인 페이지
- `/destination` - 여행지 목록
- `/destination/:slug` - 여행지 상세 페이지
- `/gallery` - 갤러리
- `/news` - 뉴스 목록
- `/news/:slug` - 뉴스 상세 페이지

## 🔧 개발 가이드

### 새로운 여행지 추가
```sql
INSERT INTO destinations (name, title, description, highlights, price_min, rating, image_url, slug) 
VALUES ('여행지명', '페이지 제목', '설명', ARRAY['하이라이트1', '하이라이트2'], 가격, 평점, '이미지URL', '슬러그');
```

### 환경변수
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `NODE_ENV`: 환경 설정 (development/production)
- `PORT`: 서버 포트 (기본값: 3000)

## 📄 라이선스

MIT License

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.
