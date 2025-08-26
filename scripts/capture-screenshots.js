// Playwright를 사용해 주요 페이지 스크린샷을 캡처합니다.
// 사용법: node scripts/capture-screenshots.js

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function capturePage(page, url, filePath, options = {}) {
  await page.goto(url, { waitUntil: 'networkidle' });
  // 살짝 대기하여 폰트/애니메이션 안정화
  await page.waitForTimeout(500);
  await page.screenshot({ path: filePath, fullPage: true, ...options });
  // 뷰포트 작은 버전도 함께 저장 (모바일)
}

(async () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const outDir = path.join(process.cwd(), 'docs', 'screenshots');
  await ensureDir(outDir);

  const browser = await chromium.launch();
  try {
    const contextDesktop = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const pageDesktop = await contextDesktop.newPage();

    // 데스크톱 캡처들
    await capturePage(pageDesktop, `${baseUrl}/`, path.join(outDir, 'home-desktop.png'));
    await capturePage(pageDesktop, `${baseUrl}/destination`, path.join(outDir, 'destinations-desktop.png'));
    await capturePage(pageDesktop, `${baseUrl}/gallery`, path.join(outDir, 'gallery-desktop.png'));

    // 모바일 뷰포트로 재생성
    const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
    const pageMobile = await contextMobile.newPage();
    await capturePage(pageMobile, `${baseUrl}/`, path.join(outDir, 'home-mobile.png'));
    await capturePage(pageMobile, `${baseUrl}/destination`, path.join(outDir, 'destinations-mobile.png'));
    await capturePage(pageMobile, `${baseUrl}/gallery`, path.join(outDir, 'gallery-mobile.png'));

    console.log('✅ Screenshots saved to:', outDir);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error('Screenshot capture failed:', e);
  process.exit(1);
});


