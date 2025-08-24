const { test, expect } = require('@playwright/test');

test.describe('웹사이트 디버깅 테스트', () => {
  test('Render 배포된 사이트 상태 확인', async ({ page }) => {
    console.log('=== Render 사이트 접속 테스트 시작 ===');
    
    try {
      // Render 사이트로 이동
      console.log('Render 사이트 접속 중...');
      const response = await page.goto('https://trippage-web.onrender.com', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      console.log(`응답 상태: ${response.status()}`);
      console.log(`응답 URL: ${response.url()}`);
      
      // 페이지 내용 확인
      const pageContent = await page.content();
      console.log('페이지 내용 길이:', pageContent.length);
      
      // 에러 메시지 확인
      const bodyText = await page.locator('body').textContent();
      console.log('페이지 텍스트:', bodyText.substring(0, 200));
      
      // 스크린샷 촬영
      await page.screenshot({ 
        path: 'render-site-debug.png', 
        fullPage: true 
      });
      
      // HTML 구조 확인
      const htmlStructure = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        return Array.from(elements).slice(0, 10).map(el => ({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          textContent: el.textContent?.substring(0, 50)
        }));
      });
      
      console.log('HTML 구조:', JSON.stringify(htmlStructure, null, 2));
      
      // 네트워크 요청 확인
      page.on('response', response => {
        console.log(`네트워크 응답: ${response.status()} ${response.url()}`);
      });
      
      // 콘솔 에러 확인
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.log(`브라우저 콘솔 에러: ${msg.text()}`);
        }
      });
      
    } catch (error) {
      console.error('테스트 실행 중 오류:', error.message);
      
      // 에러 발생 시에도 스크린샷 촬영
      try {
        await page.screenshot({ 
          path: 'render-site-error.png', 
          fullPage: true 
        });
      } catch (screenshotError) {
        console.error('스크린샷 촬영 실패:', screenshotError.message);
      }
    }
  });

  test('로컬 서버와 비교 테스트', async ({ page }) => {
    console.log('=== 로컬 서버 테스트 시작 ===');
    
    try {
      // 로컬 서버 접속 (만약 실행 중이라면)
      console.log('로컬 서버 접속 시도...');
      const response = await page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle',
        timeout: 5000 
      });
      
      console.log(`로컬 서버 응답 상태: ${response.status()}`);
      const localContent = await page.content();
      console.log('로컬 페이지 내용 길이:', localContent.length);
      
      await page.screenshot({ 
        path: 'local-site-debug.png', 
        fullPage: true 
      });
      
    } catch (error) {
      console.log('로컬 서버 접속 실패 (정상 - 서버가 실행 중이 아님):', error.message);
    }
  });

  test('API 엔드포인트 테스트', async ({ request }) => {
    console.log('=== API 엔드포인트 테스트 시작 ===');
    
    const baseURL = 'https://trippage-web.onrender.com';
    
    // 기본 API 엔드포인트들 테스트
    const endpoints = [
      '/api/destinations',
      '/api/news',
      '/api/gallery',
      '/api/popular-tours'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`테스트 중: ${endpoint}`);
        const response = await request.get(`${baseURL}${endpoint}`);
        console.log(`${endpoint}: ${response.status()}`);
        
        if (response.status() === 200) {
          const data = await response.json();
          console.log(`${endpoint} 데이터 개수:`, Array.isArray(data) ? data.length : 'Not an array');
        }
      } catch (error) {
        console.error(`${endpoint} 테스트 실패:`, error.message);
      }
    }
  });
});
