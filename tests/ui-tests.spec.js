const { test, expect } = require('@playwright/test');

test.describe('UI 테스트', () => {
  test('메인 페이지 로드 및 기본 요소 확인', async ({ page }) => {
    await page.goto('/');
    
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/트립페이지/);
    
    // 네비게이션 바 확인
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.navbar-item .navbar-title')).toContainText('트립페이지');
    
    // 메인 섹션들 확인
    await expect(page.locator('.section-header')).toBeVisible();
    await expect(page.locator('.section-about')).toBeVisible();
    await expect(page.locator('.section-discover')).toBeVisible();
    
    // 여행 상품 카드들 확인
    const tourCards = page.locator('.section-tour-body .col-1, .section-tour-body .col-2');
    await expect(tourCards).toHaveCount(5);
  });

  test('여행지 목록 페이지 테스트', async ({ page }) => {
    await page.goto('/destination');
    
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/해외여행지/);
    
    // 여행지 목록이 로드되는지 확인
    await expect(page.locator('#destinations-container')).toBeVisible();
    
    // 여행지 카드들이 로드되는지 확인 (API 응답 대기)
    await page.waitForTimeout(2000);
    const destinationCards = page.locator('#destinations-container .col');
    await expect(destinationCards).toHaveCount(9);
    
    // 첫 번째 여행지 카드의 내용 확인
    const firstCard = destinationCards.first();
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('.caption-text p')).toBeVisible();
    await expect(firstCard.locator('.btn-orange')).toContainText('상세보기');
  });

  test('여행지 상세 페이지 테스트', async ({ page }) => {
    // 먼저 여행지 목록에서 첫 번째 여행지의 상세보기 클릭
    await page.goto('/destination');
    await page.waitForTimeout(2000);
    
    const firstDestinationLink = page.locator('#destinations-container .col').first().locator('.btn-orange');
    await firstDestinationLink.click();
    
    // 상세 페이지 로드 확인
    await expect(page.locator('.section-ticket')).toBeVisible();
    await expect(page.locator('#destination-title')).toBeVisible();
    
    // 여행지 정보가 로드되는지 확인
    await page.waitForTimeout(2000);
    await expect(page.locator('#destination-title')).not.toContainText('로딩 중');
    
    // 예약 폼 확인
    await expect(page.locator('#bookingForm')).toBeVisible();
    await expect(page.locator('#travelDate')).toBeVisible();
    await expect(page.locator('#paxCount')).toBeVisible();
    await expect(page.locator('#paymentButton')).toBeVisible();
  });

  test('사이드바 네비게이션 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 사이드바 토글 버튼 클릭
    await page.locator('.navbar-bars .sidebar-toggle').click();
    
    // 사이드바가 열리는지 확인
    await expect(page.locator('.sidebar')).toHaveClass(/active/);
    
    // 사이드바 메뉴 항목들 확인
    await expect(page.locator('.sidebar-list li')).toHaveCount(7);
    await expect(page.locator('.sidebar-list a[href="index.html"]')).toContainText('홈');
    await expect(page.locator('.sidebar-list a[href="destination.html"]')).toContainText('여행지');
    
    // 사이드바 닫기
    await page.locator('.sidebar .close').click();
    await expect(page.locator('.sidebar')).not.toHaveClass(/active/);
  });

  test('로그인 폼 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 로그인 버튼 클릭
    await page.locator('#openLogin').click();
    
    // 로그인 폼이 나타나는지 확인
    await expect(page.locator('.login-form')).toBeVisible();
    await expect(page.locator('.login-overlay')).toBeVisible();
    
    // 로그인 폼 필드들 확인
    await expect(page.locator('input[name="loginEmail"]')).toBeVisible();
    await expect(page.locator('input[name="loginPassword"]')).toBeVisible();
    await expect(page.locator('#loginForm .btn-login')).toBeVisible();
    
    // 로그인 폼 닫기
    await page.locator('.login-form .close').click();
    await expect(page.locator('.login-form')).not.toBeVisible();
  });

  test('갤러리 페이지 테스트', async ({ page }) => {
    await page.goto('/gallery');
    
    // 갤러리 페이지 로드 확인
    await expect(page.locator('.section-gallery')).toBeVisible();
    
    // 갤러리 이미지들 확인
    const galleryImages = page.locator('.section-gallery-body img');
    await expect(galleryImages).toHaveCount(4);
    
    // 이미지 클릭 시 갤러리로 이동하는지 확인
    await galleryImages.first().click();
    await expect(page).toHaveURL(/gallery/);
  });

  test('뉴스 페이지 테스트', async ({ page }) => {
    await page.goto('/news');
    
    // 뉴스 페이지 로드 확인
    await expect(page.locator('.section-news')).toBeVisible();
    
    // 뉴스 카드들 확인
    const newsCards = page.locator('.section-news-body .col, .section-news-body .col-2');
    await expect(newsCards).toHaveCount(3);
    
    // 뉴스 제목과 날짜 확인
    await expect(page.locator('.text-top')).toBeVisible();
    await expect(page.locator('.text-bottom')).toBeVisible();
  });

  test('페이지네이션 테스트', async ({ page }) => {
    await page.goto('/destination');
    
    // 페이지네이션이 표시되는지 확인
    await expect(page.locator('.pagination')).toBeVisible();
    
    // 페이지 번호들 확인
    await expect(page.locator('.pagin-number')).toHaveCount(5);
    await expect(page.locator('.pagin-number.active')).toContainText('1');
    
    // 화살표 버튼들 확인
    await expect(page.locator('.pagination-arrow.arrow-left')).toBeVisible();
    await expect(page.locator('.pagination-arrow.arrow-right')).toBeVisible();
  });
});
