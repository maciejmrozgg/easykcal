ALTER TABLE users
ADD COLUMN goal TEXT DEFAULT 'maintenance',
ADD COLUMN calorie_target INTEGER,
ADD COLUMN protein_target INTEGER,
ADD COLUMN fat_target INTEGER,
ADD COLUMN carbs_target INTEGER,
ADD COLUMN copy_targets_to_new_months BOOLEAN DEFAULT TRUE;