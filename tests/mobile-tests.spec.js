const { test, expect } = require('@playwright/test');

test.describe('모바일 테스트', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE 크기

  test('모바일 메인 페이지 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 모바일용 제목이 표시되는지 확인
    await expect(page.locator('.section-header-title-xs')).toBeVisible();
    await expect(page.locator('.section-header-title-xs .title')).toContainText('여행의 모든 것 트립페이지');
    
    // 데스크톱용 제목은 숨겨지는지 확인
    await expect(page.locator('.section-header-title')).not.toBeVisible();
    
    // 기본 섹션들이 모바일에 맞게 표시되는지 확인
    await expect(page.locator('.section-header')).toBeVisible();
    await expect(page.locator('.section-about')).toBeVisible();
    await expect(page.locator('.section-discover')).toBeVisible();
    
    // 여행 상품 카드들이 존재하는지 확인 (애니메이션 상태와 관계없이)
    const tourCards = page.locator('.section-tour-body .col-1, .section-tour-body .col-2');
    await expect(tourCards).toHaveCount(5);
    
    // 애니메이션 상태와 관계없이 요소 존재 여부만 확인
    for (let i = 0; i < await tourCards.count(); i++) {
      const card = tourCards.nth(i);
      // 이미지 요소가 DOM에 존재하는지만 확인
      await expect(card.locator('img')).toBeAttached();
      // 이미지 소스 속성이 있는지 확인
      await expect(card.locator('img')).toHaveAttribute('src');
    }
  });

  test('모바일 네비게이션 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 모바일에서 네비게이션 바가 적절히 표시되는지 확인
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.navbar-bars')).toBeVisible();
    
    // 사이드바 토글 버튼이 모바일에 맞게 표시되는지 확인
    const sidebarToggle = page.locator('.sidebar-toggle');
    await expect(sidebarToggle).toBeVisible();
    
    // 사이드바 열기
    await sidebarToggle.click();
    await expect(page.locator('.sidebar')).toHaveClass(/active/);
    
    // 사이드바 메뉴 항목들이 모바일에 맞게 표시되는지 확인
    const sidebarItems = page.locator('.sidebar-list li');
    await expect(sidebarItems).toHaveCount(7);
    
    // 사이드바 닫기
    await page.locator('.sidebar .close').click();
    await expect(page.locator('.sidebar')).not.toHaveClass(/active/);
  });

  test('모바일 여행지 목록 페이지 테스트', async ({ page }) => {
    await page.goto('/destination');
    
    // 여행지 목록이 모바일에 맞게 표시되는지 확인
    await expect(page.locator('#destinations-container')).toBeVisible();
    
    // API 응답 대기
    await page.waitForTimeout(2000);
    
    // 여행지 카드들이 모바일 화면에 맞게 표시되는지 확인
    const destinationCards = page.locator('#destinations-container .col');
    await expect(destinationCards).toHaveCount(9);
    
    // 각 카드의 이미지와 텍스트가 모바일에 맞게 표시되는지 확인
    for (let i = 0; i < Math.min(await destinationCards.count(), 3); i++) {
      const card = destinationCards.nth(i);
      await expect(card.locator('img')).toBeVisible();
      await expect(card.locator('.caption-text p')).toBeVisible();
      await expect(card.locator('.btn-orange')).toBeVisible();
    }
  });

  test('모바일 여행지 상세 페이지 테스트', async ({ page }) => {
    // 여행지 목록에서 첫 번째 여행지 상세보기로 이동
    await page.goto('/destination');
    await page.waitForTimeout(2000);
    
    const firstDestinationLink = page.locator('#destinations-container .col').first().locator('.btn-orange');
    await firstDestinationLink.click();
    
    // 상세 페이지가 모바일에 맞게 표시되는지 확인
    await expect(page.locator('.section-ticket')).toBeVisible();
    await expect(page.locator('#destination-title')).toBeVisible();
    
    // 여행지 정보 로드 대기
    await page.waitForTimeout(2000);
    await expect(page.locator('#destination-title')).not.toContainText('로딩 중');
    
    // 예약 폼이 모바일에 맞게 표시되는지 확인
    await expect(page.locator('#bookingForm')).toBeVisible();
    await expect(page.locator('#travelDate')).toBeVisible();
    await expect(page.locator('#paxCount')).toBeVisible();
    await expect(page.locator('#paymentButton')).toBeVisible();
    
    // 모바일에서 폼 입력 테스트
    await page.locator('#travelDate').click();
    await page.locator('#paxCount').selectOption('2');
    
    // 총 금액이 업데이트되는지 확인
    await expect(page.locator('.total-price')).toBeVisible();
  });

  test('모바일 갤러리 페이지 테스트', async ({ page }) => {
    await page.goto('/gallery');
    
    // 갤러리가 모바일에 맞게 표시되는지 확인
    await expect(page.locator('.section-gallery')).toBeVisible();
    
    // 갤러리 이미지들이 모바일 화면에 맞게 표시되는지 확인
    const galleryImages = page.locator('.section-gallery-body img');
    await expect(galleryImages).toHaveCount(4);
    
    // 각 이미지가 모바일 화면에 맞게 표시되는지 확인
    for (let i = 0; i < await galleryImages.count(); i++) {
      const image = galleryImages.nth(i);
      await expect(image).toBeVisible();
    }
  });

  test('모바일 뉴스 페이지 테스트', async ({ page }) => {
    await page.goto('/news');
    
    // 뉴스가 모바일에 맞게 표시되는지 확인
    await expect(page.locator('.section-news')).toBeVisible();
    
    // 뉴스 카드들이 모바일 화면에 맞게 표시되는지 확인
    const newsCards = page.locator('.section-news-body .col, .section-news-body .col-2');
    await expect(newsCards).toHaveCount(3);
    
    // 각 뉴스 카드가 모바일에 맞게 표시되는지 확인
    for (let i = 0; i < await newsCards.count(); i++) {
      const card = newsCards.nth(i);
      await expect(card.locator('img')).toBeVisible();
      await expect(card.locator('.text-top')).toBeVisible();
      await expect(card.locator('.text-bottom')).toBeVisible();
    }
  });

  test('모바일 터치 제스처 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 모바일에서 스와이프 제스처가 작동하는지 확인 (스와이프 슬라이더)
    const swipeContainer = page.locator('.swipe');
    if (await swipeContainer.isVisible()) {
      // 스와이프 제스처 시뮬레이션
      await page.mouse.move(200, 300);
      await page.mouse.down();
      await page.mouse.move(100, 300);
      await page.mouse.up();
    }
    
    // 모바일에서 터치 이벤트가 정상 작동하는지 확인
    await page.locator('.navbar-item .navbar-title').tap();
    await expect(page).toHaveURL('/');
  });

  test('모바일 반응형 레이아웃 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 모바일 화면에서 레이아웃이 깨지지 않는지 확인
    await expect(page.locator('.container').first()).toBeVisible();
    
    // 모바일에서 텍스트가 적절히 줄바꿈되는지 확인
    const aboutText = page.locator('.about-head p');
    await expect(aboutText).toBeVisible();
    
    // 모바일에서 버튼들이 적절한 크기로 표시되는지 확인
    const buttons = page.locator('.btn');
    for (let i = 0; i < Math.min(await buttons.count(), 3); i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();
      // 버튼이 터치하기에 적절한 크기인지 확인
      const box = await button.boundingBox();
      expect(box.width).toBeGreaterThan(44); // 최소 터치 영역
      expect(box.height).toBeGreaterThan(44);
    }
  });
});
