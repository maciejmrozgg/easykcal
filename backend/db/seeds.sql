-- Default admin account
-- email: admin@easykcal.local
-- password: admin123

INSERT INTO users (email, password, role)
VALUES (
'admin@easykcal.local',
'$2b$10$z1Y9vOZ6eF7Vd9E0YcFf1eKQz9sF8Zt3n9pF0R2dLkJ8Q1d2V5x9G',
'admin'),

('user@easykcal.local',
'$2b$10$z1Y9vOZ6eF7Vd9E0YcFf1eKQz9sF8Zt3n9pF0R2dLkJ8Q1d2V5x9G',
'user')
ON CONFLICT (email) DO NOTHING;


-- Default categories
INSERT INTO categories (user_id, name, image_url)
VALUES
(NULL, 'FastFood', '/images/categories/fastfood.jpg'),
(NULL, 'Zupy', '/images/categories/zupy.jpg'),
(NULL, 'Miesa', '/images/categories/miesa.jpg'),
(NULL, 'Koktajle', '/images/categories/koktajle.jpg'),
(NULL, 'Ciasta', '/images/categories/ciasta.jpg'),
(NULL, 'Salatki', '/images/categories/salatki.jpg'),
(NULL, 'Makarony', '/images/categories/makarony.jpg'),
(NULL, 'Ryby', '/images/categories/ryby.jpg')
ON CONFLICT DO NOTHING;


-- Default product list
INSERT INTO products (name, kcal_per_100g, fat_per_100g, protein_per_100g, carbs_per_100g)
VALUES
('Olej rzepakowy', 884, 100, 0, 0),
('Oliwa z oliwek', 884, 100, 0, 0),
('Maslo', 717, 81, 1, 1),
('Margaryna', 717, 80, 0, 1),
('Cukier', 400, 0, 0, 100),
('Ryż biały', 130, 0.3, 2.7, 28),
('Makaron', 131, 1.1, 5, 25),
('Ziemniaki', 77, 0.1, 2, 17),
('Kurczak piers', 165, 3.6, 31, 0),
('Karkowka wieprzowa', 291, 24, 17, 0),
('Wołowina', 250, 15, 26, 0),
('Jajko', 155, 11, 13, 1),
('Mleko 2%', 50, 2, 3.4, 5),
('Ser żółty', 402, 33, 25, 1),
('Jogurt naturalny', 59, 3, 5, 4),
('Chleb pszenny', 265, 3, 9, 49),
('Chleb razowy', 247, 3.5, 8.5, 41),
('Banany', 89, 0.3, 1.1, 23),
('Jabłka', 52, 0.2, 0.3, 14),
('Pomidor', 18, 0.2, 0.9, 4)
ON CONFLICT DO NOTHING;