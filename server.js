const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();
const multer = require('multer');

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
// Render 환경에서는 __dirname이 /opt/render/project/src이므로 trippage 폴더를 직접 서빙
app.use(express.static(path.join(__dirname, 'trippage')));
// CSS, JS, 이미지 등의 정적 파일들을 위해 trippage 폴더를 루트로 설정
app.use('/css', express.static(path.join(__dirname, 'trippage', 'css')));
app.use('/js', express.static(path.join(__dirname, 'trippage', 'js')));
app.use('/img', express.static(path.join(__dirname, 'trippage', 'img')));
app.use('/fonts', express.static(path.join(__dirname, 'trippage', 'fonts')));

// 파일 업로드 설정 (갤러리 업로드 경로)
const uploadsDir = path.join(__dirname, 'trippage', 'img', 'gallery-uploads');
const fs = require('fs');
try { if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true }); } catch(e){}

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsDir); },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || '');
    const base = path.basename(file.originalname || 'upload', ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const fname = `${Date.now()}_${base}${ext}`;
    cb(null, fname);
  }
});
const upload = multer({ storage });

// 정적 파일 서빙에 업로드 폴더 추가
app.use('/img/gallery-uploads', express.static(uploadsDir));

// API 라우트

// 서비스 중지 엔드포인트 (필요시 사용)
app.get('/api/stop', (req, res) => {
  console.log('서비스 중지 요청 받음');
  res.json({ message: '서비스가 5초 후 중지됩니다.' });
  
  setTimeout(() => {
    console.log('서비스 중지 중...');
    process.exit(0);
  }, 5000);
});

// 디버깅 엔드포인트 추가
app.get('/api/debug/server-info', (req, res) => {
  const fs = require('fs');
  
  try {
    const debugInfo = {
      currentDirectory: __dirname,
      nodeEnv: process.env.NODE_ENV,
      port: PORT,
      timestamp: new Date().toISOString()
    };
    
    // 현재 디렉토리 파일 목록
    try {
      debugInfo.rootFiles = fs.readdirSync(__dirname);
    } catch (error) {
      debugInfo.rootFilesError = error.message;
    }
    
    // trippage 디렉토리 확인
    const trippagePath = path.join(__dirname, 'trippage');
    try {
      if (fs.existsSync(trippagePath)) {
        debugInfo.trippageExists = true;
        debugInfo.trippageFiles = fs.readdirSync(trippagePath);
        
        // index.html 파일 확인
        const indexPath = path.join(trippagePath, 'index.html');
        debugInfo.indexHtmlExists = fs.existsSync(indexPath);
        if (debugInfo.indexHtmlExists) {
          const stats = fs.statSync(indexPath);
          debugInfo.indexHtmlSize = stats.size;
          debugInfo.indexHtmlModified = stats.mtime;
        }
      } else {
        debugInfo.trippageExists = false;
      }
    } catch (error) {
      debugInfo.trippageError = error.message;
    }
    
    res.json(debugInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 여행지 목록 조회 (페이지네이션)
app.get('/api/destinations', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '9', 10), 1), 50);
    const offset = (page - 1) * pageSize;

    const totalResult = await pool.query('SELECT COUNT(*)::int AS count FROM destinations');
    const total = totalResult.rows[0].count;

    const itemsResult = await pool.query(`
      SELECT id, name, title, description, price_min, price_max, rating, image_url, slug
      FROM destinations 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [pageSize, offset]);

    res.json({
      items: itemsResult.rows,
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1)
    });
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

// 갤러리 이미지 조회 (페이지네이션)
app.get('/api/gallery', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '12', 10), 1), 60);
    const offset = (page - 1) * pageSize;

    const totalResult = await pool.query('SELECT COUNT(*)::int AS count FROM gallery_images');
    const total = totalResult.rows[0].count;

    const itemsResult = await pool.query(`
      SELECT id, image_url, alt_text, destination_id, is_featured, created_at
      FROM gallery_images 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [pageSize, offset]);

    res.json({
      items: itemsResult.rows,
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1)
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: '갤러리를 불러오는데 실패했습니다.' });
  }
});

// 관리자 인증 API
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isEmailAdmin = email === 'admin@trippage.com' && password === 'admin123';
    const isLegacyAdmin = username === 'admin' && password === 'admin123';

    if (isEmailAdmin || isLegacyAdmin) {
      res.json({
        success: true,
        message: '로그인 성공',
        admin: { username: 'admin', email: email || 'admin@trippage.com', role: 'admin' }
      });
    } else {
      res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: '로그인 처리 중 오류가 발생했습니다.' });
  }
});

// 여행상품 추가 API
app.post('/api/admin/destinations', async (req, res) => {
  try {
    const { 
      name, description, price, duration, image_url, category 
    } = req.body;
    
    // 필수 필드 검증
    if (!name || !description || !price || !duration) {
      return res.status(400).json({ 
        error: '필수 필드가 누락되었습니다. (name, description, price, duration)' 
      });
    }
    
    // slug 생성 (한글 이름을 영문으로 변환하는 간단한 로직)
    const slug = name.toLowerCase()
      .replace(/[^a-zA-Z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const result = await pool.query(`
      INSERT INTO destinations (name, title, description, price_min, price_max, rating, 
                              image_url, location_info, schedule, min_participants, 
                              max_participants, includes, slug)
      VALUES ($1, $1, $2, $3, $3, 4.5, $4, $5, $6, 1, 20, ARRAY['항공권', '숙박', '식사', '가이드'], $7)
      RETURNING *
    `, [name, description, price, image_url || 'img/destination/default.jpg', 
        category || '일반', duration, slug]);
    
    res.json({ 
      success: true, 
      message: '여행상품이 성공적으로 추가되었습니다.',
      destination: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding destination:', error);
    res.status(500).json({ error: '여행상품 추가에 실패했습니다.' });
  }
});

// 갤러리 이미지 추가 API (파일 업로드 지원)
app.post('/api/admin/gallery', upload.single('image'), async (req, res) => {
  try {
    const { alt_text, is_featured } = req.body;
    let image_url = req.body.image_url || '';

    if (req.file) {
      // 업로드된 파일의 정적 접근 경로 저장 (예: /img/gallery-uploads/filename.jpg)
      image_url = `/img/gallery-uploads/${req.file.filename}`;
    }

    if (!image_url) {
      return res.status(400).json({ success: false, error: '이미지 파일이 필요합니다.' });
    }

    const result = await pool.query(`
      INSERT INTO gallery_images (image_url, alt_text, destination_id, is_featured)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [image_url, alt_text || null, null, String(is_featured) === 'true']);

    res.json({ success: true, message: '갤러리 이미지가 성공적으로 추가되었습니다.', image: result.rows[0] });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({ success: false, error: '갤러리 이미지 추가에 실패했습니다.' });
  }
});

// 여행상품 삭제 API (관리자)
app.delete('/api/admin/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'id가 필요합니다.' });

    const existing = await pool.query('SELECT id FROM destinations WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: '대상을 찾을 수 없습니다.' });
    }

    await pool.query('DELETE FROM destinations WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('여행상품 삭제 오류:', error);
    res.status(500).json({ success: false, error: '여행상품 삭제에 실패했습니다.' });
  }
});

// 갤러리 이미지 삭제 API (관리자)
app.delete('/api/admin/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'id가 필요합니다.' });

    const existing = await pool.query('SELECT id FROM gallery_images WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: '대상을 찾을 수 없습니다.' });
    }

    await pool.query('DELETE FROM gallery_images WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('갤러리 이미지 삭제 오류:', error);
    res.status(500).json({ success: false, error: '갤러리 이미지 삭제에 실패했습니다.' });
  }
});

// 이메일로 회원 확인 API (토스 스타일)
app.post('/api/auth/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: '이메일을 입력해주세요.' 
      });
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: '올바른 이메일 형식을 입력해주세요.' 
      });
    }
    
    const result = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
    
    if (result.rows.length > 0) {
      // 기존 회원
      res.json({ 
        success: true, 
        isExistingUser: true,
        message: '가입된 이메일입니다. 비밀번호를 입력해주세요.',
        email: email
      });
    } else {
      // 신규 회원
      res.json({ 
        success: true, 
        isExistingUser: false,
        message: '새로운 이메일입니다. 회원가입을 진행해주세요.',
        email: email
      });
    }
  } catch (error) {
    console.error('이메일 확인 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 사용자 인증 관련 API (토스 스타일 - 나이, 성별 포함)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, age, gender } = req.body;
    
    // 필수 필드 검증
    if (!name || !email || !password || !phone || !age || !gender) {
      return res.status(400).json({ 
        success: false, 
        message: '모든 필드를 입력해주세요.' 
      });
    }
    
    // 이메일 중복 확인
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: '이미 등록된 이메일입니다.' 
      });
    }
    
    // 비밀번호 해시화 (실제 프로덕션에서는 bcrypt 사용 권장)
    const hashedPassword = password; // 간단한 예시
    
    // 사용자 등록
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, age, gender) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, phone, age, gender',
      [name, email, hashedPassword, phone, age, gender]
    );
    
    res.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '이메일과 비밀번호를 입력해주세요.' 
      });
    }
    
    // 사용자 조회
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }
    
    const user = result.rows[0];
    
    res.json({
      success: true,
      message: '로그인이 완료되었습니다.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 사용자 정보 수정 API
app.put('/api/auth/profile', async (req, res) => {
  try {
    const { id, name, email, phone, password } = req.body;
    
    // 필수 필드 검증
    if (!id || !name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: '필수 필드가 누락되었습니다.' 
      });
    }
    
    // 사용자 정보 업데이트 (비밀번호 포함)
    let query, values;
    
    if (password && password.trim() !== '') {
      // 비밀번호도 함께 업데이트
      query = 'UPDATE users SET name = $1, email = $2, phone = $3, password = $4, updated_at = NOW() WHERE id = $5 RETURNING id, name, email, phone';
      values = [name, email, phone, password, id];
    } else {
      // 비밀번호 제외하고 업데이트
      query = 'UPDATE users SET name = $1, email = $2, phone = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, phone';
      values = [name, email, phone, id];
    }
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: '사용자를 찾을 수 없습니다.' 
      });
    }
    
    res.json({
      success: true,
      message: password && password.trim() !== '' 
        ? '사용자 정보와 비밀번호가 수정되었습니다.' 
        : '사용자 정보가 수정되었습니다.',
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// -------------------------
// 게시판(Board) API
// -------------------------

// 게시글 목록 조회 (페이지네이션)
app.get('/api/board', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '10', 10), 1), 50);
    const offset = (page - 1) * pageSize;

    const totalResult = await pool.query('SELECT COUNT(*)::int AS count FROM board_posts');
    const total = totalResult.rows[0].count;

    const itemsResult = await pool.query(`
      SELECT id, title, content, image_url, category, author_id, author_name, created_at, updated_at
      FROM board_posts
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [pageSize, offset]);

    res.json({
      items: itemsResult.rows,
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1)
    });
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    // 폴백: DB 오류 시에도 빈 목록을 반환하여 프런트가 정상 렌더되도록 함
    res.json({ items: [], total: 0, page: 1, pageSize: Number(req.query.pageSize) || 10, totalPages: 1, fallback: true });
  }
});

// 게시글 단건 조회
app.get('/api/board/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM board_posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    res.status(500).json({ error: '게시글을 불러오는데 실패했습니다.' });
  }
});

// 게시글 작성
app.post('/api/board', async (req, res) => {
  try {
    const { title, content, image_url, category, author } = req.body;
    // author: { id, name, email }
    if (!author || !author.id || !author.name || !author.email) {
      return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
    }
    if (!title || !content) {
      return res.status(400).json({ success: false, message: '제목과 내용을 입력해주세요.' });
    }
    const result = await pool.query(`
      INSERT INTO board_posts (title, content, image_url, category, author_id, author_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, content, image_url || null, category || null, author.id, author.name]);
    res.json({ success: true, post: result.rows[0] });
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    res.status(500).json({ success: false, message: '게시글 작성에 실패했습니다.' });
  }
});

// 게시글 수정 (관리자 또는 작성자 본인)
app.put('/api/board/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url, category, author } = req.body;
    if (!author || !author.id || !author.email) {
      return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
    }
    // 관리자 판단: admin@trippage.com
    const isAdmin = author.email === 'admin@trippage.com';

    const existing = await pool.query('SELECT * FROM board_posts WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
    }
    const post = existing.rows[0];
    if (!isAdmin && post.author_id !== author.id) {
      return res.status(403).json({ success: false, message: '수정 권한이 없습니다.' });
    }

    const result = await pool.query(`
      UPDATE board_posts
      SET title = $1, content = $2, image_url = $3, category = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [title || post.title, content || post.content, image_url || post.image_url, category || post.category, id]);

    res.json({ success: true, post: result.rows[0] });
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    res.status(500).json({ success: false, message: '게시글 수정에 실패했습니다.' });
  }
});

// 게시글 삭제 (관리자 또는 작성자 본인)
app.delete('/api/board/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { author } = req.body; // fetch로 DELETE 시 body 사용
    if (!author || !author.id || !author.email) {
      return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
    }
    const isAdmin = author.email === 'admin@trippage.com';

    const existing = await pool.query('SELECT * FROM board_posts WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
    }
    const post = existing.rows[0];
    if (!isAdmin && post.author_id !== author.id) {
      return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' });
    }

    await pool.query('DELETE FROM board_posts WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    res.status(500).json({ success: false, message: '게시글 삭제에 실패했습니다.' });
  }
});

// HTML 파일 경로 설정
const getHtmlPath = (filename) => {
  const fullPath = path.join(__dirname, 'trippage', filename);
  console.log(`Attempting to serve file: ${fullPath}`);
  return fullPath;
};

// HTML 파일 전송 헬퍼 함수
const sendHtmlFile = (res, filename) => {
  const filePath = getHtmlPath(filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving ${filename}:`, err);
      res.status(500).send(`파일을 찾을 수 없습니다: ${filename}`);
    }
  });
};

// 메인 페이지 라우트
app.get('/', (req, res) => {
  sendHtmlFile(res, 'index.html');
});

// 여행지 목록 페이지
app.get('/destination', (req, res) => {
  sendHtmlFile(res, 'destination.html');
});

// 여행지 상세 페이지 (동적 라우팅)
app.get('/destination/:slug', (req, res) => {
  sendHtmlFile(res, 'single-destination.html');
});

// 갤러리 페이지
app.get('/gallery', (req, res) => {
  sendHtmlFile(res, 'gallery.html');
});

// 뉴스 페이지
app.get('/news', (req, res) => {
  sendHtmlFile(res, 'news.html');
});

// 뉴스 상세 페이지
app.get('/news/:slug', (req, res) => {
  sendHtmlFile(res, 'single-news.html');
});

// 404 에러 처리
app.use((req, res) => {
  res.status(404);
  sendHtmlFile(res, 'index.html');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행중입니다.`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Current directory: ${__dirname}`);
  console.log(`Looking for trippage files at: ${path.join(__dirname, 'trippage')}`);
  
  // 파일 시스템 확인
  const fs = require('fs');
  try {
    const files = fs.readdirSync(__dirname);
    console.log('Files in current directory:', files);
    
    const trippagePath = path.join(__dirname, 'trippage');
    if (fs.existsSync(trippagePath)) {
      const trippageFiles = fs.readdirSync(trippagePath);
      console.log('Files in trippage directory:', trippageFiles);
    } else {
      console.log('trippage directory does not exist!');
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
});

// 데이터베이스 연결 테스트 및 관리자 계정 생성
pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err);
  } else {
    console.log('데이터베이스 연결 성공:', res.rows[0].now);
    // 필수 테이블 보장 (없으면 생성)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          age INTEGER,
          gender VARCHAR(10) CHECK (gender IN ('male','female')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await pool.query(`
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
      `);
      
      // destinations 테이블 생성
      await pool.query(`
        CREATE TABLE IF NOT EXISTS destinations (
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
      `);
      
      // gallery_images 테이블 생성
      await pool.query(`
        CREATE TABLE IF NOT EXISTS gallery_images (
          id SERIAL PRIMARY KEY,
          image_url VARCHAR(500) NOT NULL,
          alt_text VARCHAR(255),
          destination_id INTEGER REFERENCES destinations(id),
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // popular_tours 테이블 생성
      await pool.query(`
        CREATE TABLE IF NOT EXISTS popular_tours (
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
      `);
      
      // news 테이블 생성
      await pool.query(`
        CREATE TABLE IF NOT EXISTS news (
          id SERIAL PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          content TEXT,
          image_url VARCHAR(500),
          published_date DATE,
          slug VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('필수 테이블(users, board_posts, destinations, gallery_images, popular_tours, news) 확인/생성 완료');
    } catch (e) {
      console.error('필수 테이블 생성 중 오류:', e);
    }
    
    // 데이터베이스 스키마 업데이트 (토스 스타일 - age, gender 컬럼 추가)
    try {
      await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER');
      await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN (\'male\', \'female\'))');
      console.log('데이터베이스 스키마 업데이트 완료 (age, gender 컬럼 추가)');
    } catch (error) {
      console.log('스키마 업데이트 건너뜀:', error.message);
    }
    
    // 관리자 계정이 존재하는지 확인하고, 없으면 생성
    try {
      const adminCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@trippage.com']);
      
      if (adminCheck.rows.length === 0) {
        // 관리자 계정 생성
        await pool.query(
          'INSERT INTO users (name, email, password, phone, age, gender) VALUES ($1, $2, $3, $4, $5, $6)',
          ['관리자', 'admin@trippage.com', 'admin123', '02-1234-5678', 30, 'male']
        );
        console.log('관리자 계정이 자동으로 생성되었습니다.');
        console.log('관리자 이메일: admin@trippage.com');
        console.log('관리자 비밀번호: admin123');
      } else {
        console.log('관리자 계정이 이미 존재합니다.');
      }
    } catch (error) {
      console.error('관리자 계정 생성 실패:', error);
    }

    // 게시판 초기 데이터 시드 (없을 때만)
    try {
      const countRes = await pool.query('SELECT COUNT(*)::int AS count FROM board_posts');
      const count = countRes.rows[0].count;
      if (count === 0) {
        await pool.query(
          `INSERT INTO board_posts (title, content, author_id, author_name)
           VALUES 
           ($1, $2, $3, $4),
           ($5, $6, $7, $8),
           ($9, $10, $11, $12)`,
          [
            '첫 게시글: 여행 Q&A를 시작합니다', '여행에 대한 질문을 자유롭게 남겨주세요!', 1, '관리자',
            '제주도 3월 날씨 어떤가요?', '3월 중순 제주도 여행 예정인데 옷차림 조언 부탁드려요.', 1, '관리자',
            '부산 2박3일 추천 코스 있을까요?', '가족여행으로 부산 계획 중입니다. 코스 추천 부탁드립니다.', 1, '관리자'
          ]
        );
        console.log('board_posts 초기 데이터가 삽입되었습니다.');
      }
          } catch (error) {
        console.error('게시판 초기 데이터 시드 실패:', error);
      }
      
      // destinations 초기 데이터 시드 (없을 때만)
      try {
        const destCountRes = await pool.query('SELECT COUNT(*)::int AS count FROM destinations');
        const destCount = destCountRes.rows[0].count;
        if (destCount === 0) {
          await pool.query(`
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
            ARRAY['입장료', '케착 댄스 관람료', '교통편', '가이드 서비스'], 'uluwatu-beach')
          `);
          console.log('destinations 초기 데이터가 삽입되었습니다.');
        }
      } catch (error) {
        console.error('destinations 초기 데이터 시드 실패:', error);
      }
      
      // popular_tours 초기 데이터 시드 (없을 때만)
      try {
        const tourCountRes = await pool.query('SELECT COUNT(*)::int AS count FROM popular_tours');
        const tourCount = tourCountRes.rows[0].count;
        if (tourCount === 0) {
          await pool.query(`
            INSERT INTO popular_tours (name, description, price_min, price_max, rating, image_url, is_featured) VALUES
            ('제주도 3박4일 패키지', '제주도의 아름다운 자연과 맛있는 음식을 즐기는 완벽한 패키지', 299000, NULL, 4.0, 'img/pantai-kuta.jpg', true),
            ('부산 2박3일 패키지', '부산의 바다와 도시를 함께 즐기는 여행', 199000, NULL, 4.0, 'img/temple.jpg', true),
            ('강릉 1박2일 패키지', '강릉의 커피와 바다를 만끽하는 짧은 여행', 99000, 149000, 4.0, 'img/tanah-lot.jpeg', true),
            ('여수 2박3일 패키지', '여수 밤바다의 아름다움을 느끼는 여행', 179000, 249000, 4.0, 'img/bali-bird-park.jpg', true),
            ('속초 1박2일 패키지', '속초의 자연과 맛집을 즐기는 여행', 89000, NULL, 4.0, 'img/gunung.jpg', true)
          `);
          console.log('popular_tours 초기 데이터가 삽입되었습니다.');
        }
      } catch (error) {
        console.error('popular_tours 초기 데이터 시드 실패:', error);
      }
      
      // news 초기 데이터 시드 (없을 때만)
      try {
        const newsCountRes = await pool.query('SELECT COUNT(*)::int AS count FROM news');
        const newsCount = newsCountRes.rows[0].count;
        if (newsCount === 0) {
          await pool.query(`
            INSERT INTO news (title, content, image_url, published_date, slug) VALUES
            ('2024년 가장 인기 있는 국내 여행지 TOP 10', '2024년 한 해 동안 가장 많은 관심을 받은 국내 여행지들을 소개합니다.', 'img/news/039443100_1523457714-IMG-20180411-WA0038.jpg', '2024-01-15', '2024-top-destinations'),
            ('봄맞이 꽃 축제 일정 및 추천 여행지', '봄철 전국 각지에서 열리는 꽃 축제 정보와 추천 여행 코스를 안내드립니다.', 'img/news/038321800_1523380452-IMG-20180410-WA0031.jpg', '2024-01-10', 'spring-flower-festivals'),
            ('여행 가이드북 출간 및 특별 할인 이벤트', '트립페이지에서 새롭게 출간한 여행 가이드북과 특별 할인 이벤트를 소개합니다.', 'img/news/023053600_1523534851-IMG-20180412-WA0034.jpg', '2024-01-05', 'guidebook-launch-event')
          `);
          console.log('news 초기 데이터가 삽입되었습니다.');
        }
      } catch (error) {
        console.error('news 초기 데이터 시드 실패:', error);
      }
  }
});
