const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('정적 파일 테스트', () => {
  test('HTML 파일들이 존재하는지 확인', () => {
    const trippageDir = path.join(__dirname, '..', 'trippage');
    
    // 필수 HTML 파일들 확인
    const requiredFiles = [
      'index.html',
      'destination.html',
      'single-destination.html',
      'gallery.html',
      'news.html',
      'culture.html',
      'event.html',
      'stay.html'
    ];
    
    requiredFiles.forEach(file => {
      const filePath = path.join(trippageDir, file);
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log(`✅ ${file} 파일 존재 확인`);
    });
  });

  test('CSS 파일들이 존재하는지 확인', () => {
    const cssDir = path.join(__dirname, '..', 'trippage', 'css');
    
    // 필수 CSS 파일들 확인
    const requiredCssFiles = [
      'main.css',
      'ionicons.min.css',
      'swiper.css'
    ];
    
    requiredCssFiles.forEach(file => {
      const filePath = path.join(cssDir, file);
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log(`✅ ${file} CSS 파일 존재 확인`);
    });
  });

  test('JavaScript 파일들이 존재하는지 확인', () => {
    const jsDir = path.join(__dirname, '..', 'trippage', 'js');
    
    // 필수 JS 파일들 확인
    const requiredJsFiles = [
      'jquery.js',
      'main.js'
    ];
    
    requiredJsFiles.forEach(file => {
      const filePath = path.join(jsDir, file);
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log(`✅ ${file} JavaScript 파일 존재 확인`);
    });
  });

  test('이미지 파일들이 존재하는지 확인', () => {
    const imgDir = path.join(__dirname, '..', 'trippage', 'img');
    
    // 필수 이미지 파일들 확인
    const requiredImages = [
      'header.jpg',
      'bali-island.png',
      'selfie.jpg',
      'culture.jpg',
      'event.jpg',
      'stay.jpg'
    ];
    
    requiredImages.forEach(file => {
      const filePath = path.join(imgDir, file);
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log(`✅ ${file} 이미지 파일 존재 확인`);
    });
  });

  test('HTML 파일 내용 검증', () => {
    const trippageDir = path.join(__dirname, '..', 'trippage');
    
    // index.html 파일 내용 확인
    const indexPath = path.join(trippageDir, 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // 필수 HTML 요소들이 포함되어 있는지 확인
    expect(indexContent).toContain('<!DOCTYPE html>');
    expect(indexContent).toContain('<title>');
    expect(indexContent).toContain('트립페이지');
    expect(indexContent).toContain('<nav class="navbar">');
    expect(indexContent).toContain('</body>');
    
    console.log('✅ index.html 내용 검증 완료');
  });

  test('CSS 파일 내용 검증', () => {
    const cssPath = path.join(__dirname, '..', 'trippage', 'css', 'main.css');
    
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      // CSS가 비어있지 않은지 확인
      expect(cssContent.length).toBeGreaterThan(0);
      expect(cssContent).toContain('{');
      expect(cssContent).toContain('}');
      
      console.log('✅ main.css 내용 검증 완료');
    } else {
      console.log('⚠️ main.css 파일이 존재하지 않습니다');
    }
  });

  test('프로젝트 구조 검증', () => {
    const projectRoot = path.join(__dirname, '..');
    
    // 필수 디렉토리들 확인
    const requiredDirs = [
      'trippage',
      'database',
      'tests',
      'node_modules'
    ];
    
    requiredDirs.forEach(dir => {
      const dirPath = path.join(projectRoot, dir);
      expect(fs.existsSync(dirPath)).toBeTruthy();
      console.log(`✅ ${dir} 디렉토리 존재 확인`);
    });
    
    // package.json 확인
    const packagePath = path.join(projectRoot, 'package.json');
    expect(fs.existsSync(packagePath)).toBeTruthy();
    
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    expect(packageContent.name).toBe('trippage-backend');
    expect(packageContent.scripts).toHaveProperty('test');
    
    console.log('✅ package.json 검증 완료');
  });
});
