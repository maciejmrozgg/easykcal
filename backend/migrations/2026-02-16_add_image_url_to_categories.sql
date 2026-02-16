-- Add image_url column with default value
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '/images/categories/default.jpg';

-- Set images for global categories (user_id IS NULL)
UPDATE categories
SET image_url = '/images/categories/miesa.jpg'
WHERE name = 'Miesa' AND user_id IS NULL;

UPDATE categories
SET image_url = '/images/categories/zupy.jpg'
WHERE name = 'Zupy' AND user_id IS NULL;

UPDATE categories
SET image_url = '/images/categories/fastfood.jpg'
WHERE name = 'FastFood' AND user_id IS NULL;

UPDATE categories
SET image_url = '/images/categories/koktajle.jpg'
WHERE name = 'Koktajle' AND user_id IS NULL;

UPDATE categories
SET image_url = '/images/categories/ciasta.jpg'
WHERE name = 'Ciasta' AND user_id IS NULL;

UPDATE categories
SET image_url = '/images/categories/salatki.jpg'
WHERE name = 'Salatki' AND user_id IS NULL;

UPDATE categories
SET image_url = '/images/categories/makarony.jpg'
WHERE name = 'Makarony' AND user_id IS NULL;

UPDATE categories
SET image_url = '/images/categories/ryby.jpg'
WHERE name = 'Ryby' AND user_id IS NULL;