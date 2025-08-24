const { test, expect } = require('@playwright/test');

test.describe('Render 서버 디버깅 API', () => {
  test('서버 디버깅 정보 확인', async ({ request }) => {
    console.log('=== 서버 디버깅 API 테스트 ===');
    
    const baseURL = 'https://trippage-web.onrender.com';
    
    try {
      // 먼저 디버깅 API 호출
      console.log('디버깅 API 호출 중...');
      const debugResponse = await request.get(`${baseURL}/api/debug/server-info`);
      console.log(`디버깅 API 상태: ${debugResponse.status()}`);
      
      if (debugResponse.status() === 200) {
        const debugData = await debugResponse.json();
        console.log('=== 서버 디버깅 정보 ===');
        console.log('현재 디렉토리:', debugData.currentDirectory);
        console.log('NODE_ENV:', debugData.nodeEnv);
        console.log('포트:', debugData.port);
        console.log('루트 파일들:', debugData.rootFiles);
        console.log('trippage 존재:', debugData.trippageExists);
        console.log('trippage 파일들:', debugData.trippageFiles);
        console.log('index.html 존재:', debugData.indexHtmlExists);
        
        if (debugData.indexHtmlExists) {
          console.log('index.html 크기:', debugData.indexHtmlSize);
          console.log('index.html 수정일:', debugData.indexHtmlModified);
        }
        
        if (debugData.trippageError) {
          console.error('trippage 오류:', debugData.trippageError);
        }
      } else {
        console.error('디버깅 API 오류:', await debugResponse.text());
      }
      
      // 다른 HTML 파일들도 테스트
      console.log('\n=== HTML 페이지 테스트 ===');
      const htmlFiles = [
        '/',
        '/destination',
        '/gallery', 
        '/news'
      ];
      
      for (const path of htmlFiles) {
        try {
          const resp = await request.get(`${baseURL}${path}`);
          const responseText = await resp.text();
          console.log(`${path}: ${resp.status()} - ${responseText.substring(0, 100)}...`);
        } catch (error) {
          console.error(`${path} 테스트 실패:`, error.message);
        }
      }
      
    } catch (error) {
      console.error('디버깅 API 테스트 실패:', error.message);
    }
  });

  test('정적 파일 접근 테스트', async ({ request }) => {
    console.log('=== 정적 파일 접근 테스트 ===');
    
    const baseURL = 'https://trippage-web.onrender.com';
    
    // CSS, JS, 이미지 파일들 테스트
    const staticFiles = [
      '/css/main.css',
      '/js/main.js', 
      '/img/header.jpg',
      '/fonts/Roboto-Regular.ttf'
    ];
    
    for (const file of staticFiles) {
      try {
        const response = await request.get(`${baseURL}${file}`);
        console.log(`${file}: ${response.status()}`);
        
        if (response.status() !== 200) {
          const text = await response.text();
          console.log(`  오류 내용: ${text.substring(0, 200)}`);
        }
      } catch (error) {
        console.error(`${file} 테스트 실패:`, error.message);
      }
    }
  });
});
