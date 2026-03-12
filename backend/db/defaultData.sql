-- Default categories for production database
-- These categories are global (user_id = NULL)
-- They will be visible to all users.

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