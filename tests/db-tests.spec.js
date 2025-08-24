const { test, expect } = require('@playwright/test');

test.describe('데이터베이스 연동 테스트', () => {
  test('데이터베이스 연결 상태 확인', async ({ request }) => {
    // API 엔드포인트가 정상적으로 응답하는지 확인
    const response = await request.get('/api/destinations');
    expect(response.ok()).toBeTruthy();
    
    // 응답 시간이 적절한지 확인 (데이터베이스 연결 상태)
    const startTime = Date.now();
    await request.get('/api/destinations');
    const responseTime = Date.now() - startTime;
    
    // 응답 시간이 5초 이내여야 함
    expect(responseTime).toBeLessThan(5000);
  });

  test('여행지 데이터 무결성 테스트', async ({ request }) => {
    const response = await request.get('/api/destinations');
    const destinations = await response.json();
    
    // 데이터가 비어있지 않은지 확인
    expect(destinations.length).toBeGreaterThan(0);
    
    // 각 여행지의 필수 필드가 올바르게 설정되어 있는지 확인
    destinations.forEach(destination => {
      // 필수 필드 존재 확인
      expect(destination.id).toBeDefined();
      expect(destination.name).toBeDefined();
      expect(destination.title).toBeDefined();
      expect(destination.price_min).toBeDefined();
      expect(destination.slug).toBeDefined();
      
      // 데이터 타입 확인
      expect(typeof destination.id).toBe('number');
      expect(typeof destination.name).toBe('string');
      expect(typeof destination.title).toBe('string');
      expect(typeof destination.price_min).toBe('number');
      expect(typeof destination.slug).toBe('string');
      
      // 데이터 유효성 확인
      expect(destination.id).toBeGreaterThan(0);
      expect(destination.name.length).toBeGreaterThan(0);
      expect(destination.title.length).toBeGreaterThan(0);
      expect(destination.price_min).toBeGreaterThan(0);
      expect(destination.slug.length).toBeGreaterThan(0);
      
      // slug 형식 확인 (하이픈으로 구분된 소문자)
      expect(destination.slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  test('여행지 상세 데이터 무결성 테스트', async ({ request }) => {
    // 먼저 여행지 목록을 가져와서 slug 확인
    const listResponse = await request.get('/api/destinations');
    const destinations = await listResponse.json();
    
    // 첫 번째 여행지의 상세 정보 확인
    const firstSlug = destinations[0].slug;
    const detailResponse = await request.get(`/api/destinations/${firstSlug}`);
    const destination = await detailResponse.json();
    
    // 상세 정보의 필수 필드 확인
    expect(destination.description).toBeDefined();
    expect(destination.highlights).toBeDefined();
    expect(destination.includes).toBeDefined();
    expect(destination.location_info).toBeDefined();
    expect(destination.schedule).toBeDefined();
    
    // 배열 필드들의 유효성 확인
    if (destination.highlights) {
      expect(Array.isArray(destination.highlights)).toBeTruthy();
      destination.highlights.forEach(highlight => {
        expect(typeof highlight).toBe('string');
        expect(highlight.length).toBeGreaterThan(0);
      });
    }
    
    if (destination.includes) {
      expect(Array.isArray(destination.includes)).toBeTruthy();
      destination.includes.forEach(item => {
        expect(typeof item).toBe('string');
        expect(item.length).toBeGreaterThan(0);
      });
    }
  });

  test('인기 여행상품 데이터 무결성 테스트', async ({ request }) => {
    const response = await request.get('/api/popular-tours');
    const tours = await response.json();
    
    if (tours.length > 0) {
      tours.forEach(tour => {
        // 필수 필드 확인
        expect(tour.id).toBeDefined();
        expect(tour.name).toBeDefined();
        expect(tour.price_min).toBeDefined();
        expect(tour.is_featured).toBeDefined();
        
        // 데이터 타입 확인
        expect(typeof tour.id).toBe('number');
        expect(typeof tour.name).toBe('string');
        expect(typeof tour.price_min).toBe('number');
        expect(typeof tour.is_featured).toBe('boolean');
        
        // 데이터 유효성 확인
        expect(tour.id).toBeGreaterThan(0);
        expect(tour.name.length).toBeGreaterThan(0);
        expect(tour.price_min).toBeGreaterThan(0);
      });
    }
  });

  test('뉴스 데이터 무결성 테스트', async ({ request }) => {
    const response = await request.get('/api/news');
    const news = await response.json();
    
    if (news.length > 0) {
      news.forEach(newsItem => {
        // 필수 필드 확인
        expect(newsItem.id).toBeDefined();
        expect(newsItem.title).toBeDefined();
        expect(newsItem.published_date).toBeDefined();
        expect(newsItem.slug).toBeDefined();
        
        // 데이터 타입 확인
        expect(typeof newsItem.id).toBe('number');
        expect(typeof newsItem.title).toBe('string');
        expect(typeof newsItem.slug).toBe('string');
        
        // 데이터 유효성 확인
        expect(newsItem.id).toBeGreaterThan(0);
        expect(newsItem.title.length).toBeGreaterThan(0);
        expect(newsItem.slug.length).toBeGreaterThan(0);
        
        // slug 형식 확인
        expect(newsItem.slug).toMatch(/^[a-z0-9-]+$/);
      });
    }
  });

  test('데이터베이스 관계 테스트', async ({ request }) => {
    // 여행지와 인기 여행상품 간의 관계 확인
    const destinationsResponse = await request.get('/api/destinations');
    const destinations = await destinationsResponse.json();
    
    const toursResponse = await request.get('/api/popular-tours');
    const tours = await toursResponse.json();
    
    // 여행지 데이터가 인기 여행상품보다 많거나 같은지 확인
    expect(destinations.length).toBeGreaterThanOrEqual(tours.length);
    
    // 여행지 slug가 고유한지 확인
    const slugs = destinations.map(d => d.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  test('API 에러 핸들링 테스트', async ({ request }) => {
    // 존재하지 않는 여행지 요청 시 404 응답 확인
    const notFoundResponse = await request.get('/api/destinations/non-existent-slug');
    expect(notFoundResponse.status()).toBe(404);
    
    const error = await notFoundResponse.json();
    expect(error).toHaveProperty('error');
    expect(typeof error.error).toBe('string');
    
    // 잘못된 API 엔드포인트 요청 시 404 응답 확인
    const invalidEndpointResponse = await request.get('/api/invalid-endpoint');
    expect(invalidEndpointResponse.status()).toBe(404);
  });

  test('데이터베이스 성능 테스트', async ({ request }) => {
    // 여러 번의 요청을 빠르게 보내서 데이터베이스 성능 확인
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(request.get('/api/destinations'));
    }
    
    await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    
    // 5개의 요청이 10초 이내에 완료되어야 함
    expect(totalTime).toBeLessThan(10000);
  });

  test('데이터베이스 일관성 테스트', async ({ request }) => {
    // 같은 API를 여러 번 호출했을 때 일관된 결과가 나오는지 확인
    const response1 = await request.get('/api/destinations');
    const destinations1 = await response1.json();
    
    const response2 = await request.get('/api/destinations');
    const destinations2 = await response2.json();
    
    // 두 응답이 동일해야 함
    expect(destinations1.length).toBe(destinations2.length);
    
    // 첫 번째 여행지의 정보가 동일해야 함
    if (destinations1.length > 0 && destinations2.length > 0) {
      expect(destinations1[0].id).toBe(destinations2[0].id);
      expect(destinations1[0].name).toBe(destinations2[0].name);
      expect(destinations1[0].slug).toBe(destinations2[0].slug);
    }
  });
});
