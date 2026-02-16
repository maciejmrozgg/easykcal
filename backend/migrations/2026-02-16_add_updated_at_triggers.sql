-- Create universal function for updated_at

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger for categories

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Trigger for recipes

CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Trigger for users

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Trigger for monthly_schedules

CREATE TRIGGER update_monthly_schedules_updated_at
BEFORE UPDATE ON monthly_schedules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();