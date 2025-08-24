const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 미들웨어 설정
app.use(helmet({
  contentSecurityPolicy: false, // HTML 파일에서 인라인 스크립트 허용
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 설정
const staticPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, 'src') 
  : __dirname;
app.use(express.static(staticPath));

// API 라우트

// 모든 여행지 목록 조회
app.get('/api/destinations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, title, description, price_min, price_max, rating, image_url, slug
      FROM destinations 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: '여행지 목록을 불러오는데 실패했습니다.' });
  }
});

// 특정 여행지 상세 정보 조회
app.get('/api/destinations/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(`
      SELECT * FROM destinations WHERE slug = $1
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '여행지를 찾을 수 없습니다.' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: '여행지 정보를 불러오는데 실패했습니다.' });
  }
});

// 인기 여행상품 조회 (메인페이지용)
app.get('/api/popular-tours', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM popular_tours 
      WHERE is_featured = true 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching popular tours:', error);
    res.status(500).json({ error: '인기 여행상품을 불러오는데 실패했습니다.' });
  }
});

// 뉴스 목록 조회
app.get('/api/news', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, image_url, published_date, slug
      FROM news 
      ORDER BY published_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: '뉴스 목록을 불러오는데 실패했습니다.' });
  }
});

// 특정 뉴스 상세 조회
app.get('/api/news/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(`
      SELECT * FROM news WHERE slug = $1
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '뉴스를 찾을 수 없습니다.' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: '뉴스 정보를 불러오는데 실패했습니다.' });
  }
});

// 갤러리 이미지 조회
app.get('/api/gallery', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM gallery_images 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: '갤러리를 불러오는데 실패했습니다.' });
  }
});

// HTML 파일 경로 설정
const getHtmlPath = (filename) => {
  const trippageDir = process.env.NODE_ENV === 'production' 
    ? path.join(__dirname, 'src', 'trippage') 
    : path.join(__dirname, 'trippage');
  return path.join(trippageDir, filename);
};

// 메인 페이지 라우트
app.get('/', (req, res) => {
  res.sendFile(getHtmlPath('index.html'));
});

// 여행지 목록 페이지
app.get('/destination', (req, res) => {
  res.sendFile(getHtmlPath('destination.html'));
});

// 여행지 상세 페이지 (동적 라우팅)
app.get('/destination/:slug', (req, res) => {
  res.sendFile(getHtmlPath('single-destination.html'));
});

// 갤러리 페이지
app.get('/gallery', (req, res) => {
  res.sendFile(getHtmlPath('gallery.html'));
});

// 뉴스 페이지
app.get('/news', (req, res) => {
  res.sendFile(getHtmlPath('news.html'));
});

// 뉴스 상세 페이지
app.get('/news/:slug', (req, res) => {
  res.sendFile(getHtmlPath('single-news.html'));
});

// 404 에러 처리
app.use((req, res) => {
  res.status(404).sendFile(getHtmlPath('index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행중입니다.`);
  console.log(`http://localhost:${PORT}`);
});

// 데이터베이스 연결 테스트
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err);
  } else {
    console.log('데이터베이스 연결 성공:', res.rows[0].now);
  }
});
