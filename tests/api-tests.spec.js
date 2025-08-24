const { test, expect } = require('@playwright/test');

test.describe('API 테스트', () => {
  test('여행지 목록 API 테스트', async ({ request }) => {
    const response = await request.get('/api/destinations');
    expect(response.ok()).toBeTruthy();
    
    const destinations = await response.json();
    expect(Array.isArray(destinations)).toBeTruthy();
    expect(destinations.length).toBeGreaterThan(0);
    
    // 첫 번째 여행지 데이터 구조 확인
    const firstDestination = destinations[0];
    expect(firstDestination).toHaveProperty('id');
    expect(firstDestination).toHaveProperty('name');
    expect(firstDestination).toHaveProperty('title');
    expect(firstDestination).toHaveProperty('price_min');
    expect(firstDestination).toHaveProperty('slug');
  });

  test('특정 여행지 상세 정보 API 테스트', async ({ request }) => {
    // 먼저 여행지 목록을 가져와서 slug 확인
    const listResponse = await request.get('/api/destinations');
    const destinations = await listResponse.json();
    const firstSlug = destinations[0].slug;
    
    // 특정 여행지 상세 정보 요청
    const detailResponse = await request.get(`/api/destinations/${firstSlug}`);
    expect(detailResponse.ok()).toBeTruthy();
    
    const destination = await detailResponse.json();
    expect(destination.slug).toBe(firstSlug);
    expect(destination).toHaveProperty('description');
    expect(destination).toHaveProperty('highlights');
    expect(destination).toHaveProperty('includes');
  });

  test('존재하지 않는 여행지 API 테스트', async ({ request }) => {
    const response = await request.get('/api/destinations/non-existent-slug');
    expect(response.status()).toBe(404);
    
    const error = await response.json();
    expect(error).toHaveProperty('error');
  });

  test('인기 여행상품 API 테스트', async ({ request }) => {
    const response = await request.get('/api/popular-tours');
    expect(response.ok()).toBeTruthy();
    
    const tours = await response.json();
    expect(Array.isArray(tours)).toBeTruthy();
    
    if (tours.length > 0) {
      const tour = tours[0];
      expect(tour).toHaveProperty('name');
      expect(tour).toHaveProperty('price_min');
      expect(tour).toHaveProperty('is_featured');
    }
  });

  test('뉴스 API 테스트', async ({ request }) => {
    const response = await request.get('/api/news');
    expect(response.ok()).toBeTruthy();
    
    const news = await response.json();
    expect(Array.isArray(news)).toBeTruthy();
    
    if (news.length > 0) {
      const newsItem = news[0];
      expect(newsItem).toHaveProperty('title');
      expect(newsItem).toHaveProperty('published_date');
      expect(newsItem).toHaveProperty('slug');
    }
  });

  test('갤러리 API 테스트', async ({ request }) => {
    const response = await request.get('/api/gallery');
    expect(response.ok()).toBeTruthy();
    
    const gallery = await response.json();
    expect(Array.isArray(gallery)).toBeTruthy();
  });
});
