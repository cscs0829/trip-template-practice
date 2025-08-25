-- 갤러리 이미지 추가
INSERT INTO gallery_images (image_url, alt_text, destination_id, is_featured) VALUES 
('img/Gallery/22427484_369553130149066_8205756025140150272_n.jpg', 'Bali Beach Sunset', null, true),
('img/Gallery/22709112_126847261368839_3816787601726111744_n.jpg', 'Bali Traditional Temple', null, false),
('img/Gallery/23823687_523669887982025_4768024408549752832_n.jpg', 'Bali Jungle Landscape', null, false),
('img/Gallery/24175228_913344825485214_1747928750328119296_n.jpg', 'Bali Rice Terraces', null, true);

-- 현재 갤러리 이미지 수 확인
SELECT COUNT(*) as total_images FROM gallery_images;
