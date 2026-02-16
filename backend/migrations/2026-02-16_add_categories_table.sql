-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Add category_id to recipes
ALTER TABLE recipes
ADD COLUMN category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

-- Insert default global categories (user_id = NULL)
INSERT INTO categories (user_id, name) VALUES
(NULL, 'FastFood'),
(NULL, 'Zupy'),
(NULL, 'Mięsa'),
(NULL, 'Koktajle'),
(NULL, 'Ciasta'),
(NULL, 'Sałatki'),
(NULL, 'Makarony'),
(NULL, 'Ryby');
