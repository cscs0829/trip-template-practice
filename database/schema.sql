-- 트립페이지 데이터베이스 스키마
CREATE DATABASE trippage;

-- 여행지 테이블
CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    highlights TEXT[],
    price_min INTEGER NOT NULL,
    price_max INTEGER,
    rating DECIMAL(2,1) DEFAULT 4.0,
    image_url VARCHAR(500),
    location_info TEXT,
    map_embed_url TEXT,
    duration VARCHAR(100),
    min_participants INTEGER DEFAULT 1,
    max_participants INTEGER DEFAULT 15,
    includes TEXT[],
    schedule VARCHAR(100),
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인기 여행 상품 테이블 (메인페이지용)
CREATE TABLE popular_tours (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_min INTEGER NOT NULL,
    price_max INTEGER,
    rating DECIMAL(2,1) DEFAULT 4.0,
    image_url VARCHAR(500),
    destination_id INTEGER REFERENCES destinations(id),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 갤러리 이미지 테이블
CREATE TABLE gallery_images (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    destination_id INTEGER REFERENCES destinations(id),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 뉴스 테이블
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    published_date DATE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 게시판 테이블 (Q&A/자유게시판 등)
CREATE TABLE IF NOT EXISTS board_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 테이블 생성 (토스 스타일 - 나이, 성별 추가)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    age INTEGER,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터 삽입
INSERT INTO destinations (name, title, description, highlights, price_min, price_max, rating, image_url, location_info, schedule, min_participants, max_participants, includes, slug) VALUES
('발리 울룬다누 사원', '발리 울룬다누 사원', '발리의 아름다운 호수 위에 자리잡은 신성한 사원을 방문하여 평온함과 영적인 경험을 느껴보세요.', 
ARRAY['호수 위의 아름다운 사원 경관', '발리 전통 건축 양식 감상', '평화로운 호수 산책', '현지 가이드 동행'], 
15000, NULL, 4.0, 'img/temple.jpg', '발리 중부 베두굴 지역', '08:00 - 16:00', 1, 15, 
ARRAY['입장료', '가이드 서비스', '교통편'], 'bali-ulun-danu-temple'),

('쿠타 비치', '쿠타 비치', '발리에서 가장 유명한 해변 중 하나로, 서핑과 석양으로 유명한 아름다운 해변입니다.', 
ARRAY['세계적으로 유명한 서핑 스팟', '아름다운 석양 감상', '해변 레스토랑과 바', '쇼핑 및 나이트라이프'], 
30000, NULL, 4.0, 'img/pantai-kuta.jpg', '발리 남부 쿠타 지역', '전일', 1, 15, 
ARRAY['해변 이용료', '서핑보드 대여(선택)', '가이드 서비스'], 'kuta-beach'),

('울루와투 비치', '울루와투 비치', '절벽 위에서 바라보는 환상적인 바다 전망과 전통 케착 댄스를 감상할 수 있는 곳입니다.', 
ARRAY['절벽 위의 장관', '케착 댄스 공연 관람', '울루와투 사원 방문', '석양 감상 포인트'], 
75000, NULL, 4.0, 'img/uluwatu.jpg', '발리 남부 울루와투', '14:00 - 20:00', 1, 15, 
ARRAY['입장료', '케착 댄스 관람료', '교통편', '가이드 서비스'], 'uluwatu-beach'),

('타나롯 사원', '타나롯 사원', '바다 위 바위 위에 세워진 발리의 가장 상징적인 사원 중 하나입니다.', 
ARRAY['바다 위 바위 사원의 신비로운 경관', '발리 힌두교 문화 체험', '석양 명소', '전통 시장 구경'], 
15000, 60000, 4.0, 'img/tanah-lot.jpeg', '발리 서부 타바난', '15:00 - 19:00', 1, 15, 
ARRAY['입장료', '가이드 서비스', '교통편'], 'tanah-lot-temple'),

('발리 버드파크', '발리 버드파크', '다양한 열대 조류를 가까이서 관찰할 수 있는 조류 공원입니다.', 
ARRAY['250여 종의 열대 조류 관람', '조류와의 상호작용 체험', '아름다운 열대 정원', '사진 촬영 기회'], 
75000, NULL, 3.0, 'img/bali-bird-park.jpg', '발리 기아냐르', '09:00 - 17:00', 1, 15, 
ARRAY['입장료', '가이드 서비스', '교통편'], 'bali-bird-park'),

('발리 박물관', '발리 박물관', '발리의 역사와 문화를 한눈에 볼 수 있는 종합 박물관입니다.', 
ARRAY['발리 전통 예술품 전시', '역사적 유물 관람', '발리 문화 이해', '교육적 체험'], 
54000, NULL, 3.0, 'img/museum-bali.jpg', '발리 덴파사르', '08:00 - 16:00', 1, 15, 
ARRAY['입장료', '오디오 가이드', '교통편'], 'bali-museum'),

('바투르 산', '바투르 산', '일출 트레킹으로 유명한 활화산으로, 정상에서 보는 일출이 장관입니다.', 
ARRAY['일출 트레킹 체험', '활화산 분화구 관람', '온천 체험', '현지 가이드와 함께하는 안전한 등반'], 
15000, NULL, 5.0, 'img/gunung.jpg', '발리 동부 킨타마니', '03:00 - 08:00', 1, 15, 
ARRAY['가이드 서비스', '트레킹 장비', '아침식사', '온천 입장료'], 'mount-batur'),

('사누르 비치', '사누르 비치', '조용하고 평화로운 해변으로 가족 여행객들에게 인기가 높은 곳입니다.', 
ARRAY['평화로운 해변 분위기', '수상 스포츠 체험', '해변 산책로', '전통 어촌 마을 체험'], 
49000, NULL, 5.0, 'img/sanur.jpg', '발리 남동부 사누르', '전일', 1, 15, 
ARRAY['해변 이용료', '수상스포츠 장비', '가이드 서비스'], 'sanur-beach'),

('엘리펀트 사파리파크', '코끼리 사파리 공원', '코끼리와 함께하는 특별한 체험을 할 수 있는 사파리 공원입니다.', 
ARRAY['코끼리 사파리 공원을 방문하여 코끼리의 다양성과 혈통에 대해 알아보기', '박물관과 코끼리 발견 정보 센터에서 두개골, 뿔, 엄니 등 1000개 이상의 화석 관람', '성체와 아기 코끼리에게 먹이 주기', '곡예, 스포츠, 관객 참여가 특징인 동물 쇼 관람', '입장료, 보험, 픽업 서비스 포함', '타로 레스토랑에서 뷔페 점심 포함'], 
120000, NULL, 4.0, 'img/elephant.jpg', 
'호텔 픽업 - 누사두아, 쿠타, 세미냑, 사누르, 우붓 지역 내에서만 픽업 및 드롭오프 가능합니다.', 
'08:00 - 16:00', 1, 15, 
ARRAY['교통편', '아침식사', '입장료', '보험', '픽업 서비스'], 'elephant-safari-park');

-- 인기 여행상품 데이터 (메인페이지용)
INSERT INTO popular_tours (name, description, price_min, price_max, rating, image_url, is_featured) VALUES
('제주도 3박4일 패키지', '제주도의 아름다운 자연과 맛있는 음식을 즐기는 완벽한 패키지', 299000, NULL, 4.0, 'img/pantai-kuta.jpg', true),
('부산 2박3일 패키지', '부산의 바다와 도시를 함께 즐기는 여행', 199000, NULL, 4.0, 'img/temple.jpg', true),
('강릉 1박2일 패키지', '강릉의 커피와 바다를 만끽하는 짧은 여행', 99000, 149000, 4.0, 'img/tanah-lot.jpeg', true),
('여수 2박3일 패키지', '여수 밤바다의 아름다움을 느끼는 여행', 179000, 249000, 4.0, 'img/bali-bird-park.jpg', true),
('속초 1박2일 패키지', '속초의 자연과 맛집을 즐기는 여행', 89000, NULL, 4.0, 'img/gunung.jpg', true);

-- 뉴스 데이터
INSERT INTO news (title, content, image_url, published_date, slug) VALUES
('2024년 가장 인기 있는 국내 여행지 TOP 10', '2024년 한 해 동안 가장 많은 관심을 받은 국내 여행지들을 소개합니다.', 'img/news/039443100_1523457714-IMG-20180411-WA0038.jpg', '2024-01-15', '2024-top-destinations'),
('봄맞이 꽃 축제 일정 및 추천 여행지', '봄철 전국 각지에서 열리는 꽃 축제 정보와 추천 여행 코스를 안내드립니다.', 'img/news/038321800_1523380452-IMG-20180410-WA0031.jpg', '2024-01-10', 'spring-flower-festivals'),
('여행 가이드북 출간 및 특별 할인 이벤트', '트립페이지에서 새롭게 출간한 여행 가이드북과 특별 할인 이벤트를 소개합니다.', 'img/news/023053600_1523534851-IMG-20180412-WA0034.jpg', '2024-01-05', 'guidebook-launch-event');
