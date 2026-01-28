# Database Schema – EasyKcal

Snapshot of the database schema as of **2026-01-28**.

This document describes the current structure of the PostgreSQL database.
Schema changes over time are tracked separately using SQL migration files
located in `backend/migrations`.

---

## Tables

### users

| Column       | Type      | Notes              |
|--------------|-----------|--------------------|
| id           | integer   | Primary key        |
| email        | varchar   | Unique             |
| password     | varchar   | Hashed             |
| role         | enum      | user / admin       |
| created_at   | timestamp | Default: now()     |
| updated_at   | timestamp | Auto-updated       |

**Relations**
- users.id → recipes.user_id
- users.id → schedule.user_id
- users.id → monthly_schedules.user_id

---

### products

| Column          | Type    | Notes        |
|-----------------|---------|--------------|
| id              | integer | Primary key  |
| name            | varchar |              |
| kcal_per_100g   | numeric |              |

**Relations**
- none

---

### recipes

| Column        | Type      | Notes                  |
|---------------|-----------|------------------------|
| id            | integer   | Primary key            |
| user_id       | integer   | FK → users.id          |
| title         | varchar   |                        |
| description   | text      | Optional               |
| ingredients   | jsonb     | Array                  |
| instructions  | jsonb     | Array                  |
| image_name    | text      | Optional               |
| created_at    | timestamp | Default: now()         |
| updated_at    | timestamp | Added via migration    |

**Relations**
- recipes.user_id → users.id
- recipes.id → schedule.recipe_id

---

### schedule

| Column        | Type      | Notes                 |
|---------------|-----------|-----------------------|
| id            | integer   | Primary key           |
| user_id       | integer   | FK → users.id         |
| recipe_id     | integer   | FK → recipes.id       |
| day_of_week   | varchar   |                       |
| meal_name     | varchar   |                       |
| created_at    | timestamp | Default: now()        |

---

### monthly_schedules

| Column           | Type      | Notes              |
|------------------|-----------|--------------------|
| id               | integer   | Primary key        |
| user_id          | integer   | FK → users.id      |
| year             | integer   |                    |
| month            | integer   |                    |
| kcal_limit       | integer   |                    |
| zero_kcal_limit  | integer   |                    |
| meals            | jsonb     |                    |
| days             | jsonb     |                    |
| created_at       | timestamp | Default: now()     |
| updated_at       | timestamp |                    |

**Relations**
- monthly_schedules.user_id → users.id

---

## Notes

- This file is **documentation only**
- All schema changes must be introduced via SQL migration files
- Migration history is stored in `backend/migrations`