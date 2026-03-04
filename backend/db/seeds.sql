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
INSERT INTO products (name, kcal_per_100g)
VALUES
('Olej rzepakowy', 884),
('Oliwa z oliwek', 884),
('Maslo', 717),
('Margaryna', 717),
('Cukier', 400),
('Ryż biały', 130),
('Makaron', 131),
('Ziemniaki', 77),
('Kurczak piers', 165),
('Karkowka wieprzowa', 291),
('Wołowina', 250),
('Jajko', 155),
('Mleko 2%', 50),
('Ser żółty', 402),
('Jogurt naturalny', 59),
('Chleb pszenny', 265),
('Chleb razowy', 247),
('Banany', 89),
('Jabłka', 52),
('Pomidor', 18)
ON CONFLICT DO NOTHING;