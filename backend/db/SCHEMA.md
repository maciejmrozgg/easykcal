# Database Schema – EasyKcal

Snapshot of the database schema as of **2026-02-16**.

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

### categories

| Column       | Type      | Notes                                   |
|--------------|-----------|-----------------------------------------|
| id           | integer   | Primary key                             |
| user_id      | integer   | FK → users.id (NULL = global category)  |
| name         | varchar   | Category name                           |
| image_url    | text      | Optional image path (static file)       |
| created_at   | timestamp | Default: now()                          |
| updated_at   | timestamp |                                         |

**Constraints**
- UNIQUE(user_id, name)

**Relations**
- categories.user_id → users.id
- categories.id → recipes.category_id

---

### recipes

| Column        | Type      | Notes                          |
|---------------|-----------|--------------------------------|
| id            | integer   | Primary key                    |
| user_id       | integer   | FK → users.id                  |
| category_id   | integer   | FK → categories.id (nullable)  |
| title         | varchar   |                                |
| description   | text      | Optional                       |
| ingredients   | jsonb     | Array                          |
| instructions  | jsonb     | Array                          |
| image_name    | text      | Optional                       |
| created_at    | timestamp | Default: now()                 |
| updated_at    | timestamp | Added via migration            |

**Relations**
- recipes.user_id → users.id
- recipes.category_id → categories.id

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

## Triggers

All tables containing an `updated_at` column use a database trigger
that automatically sets `updated_at = NOW()` before every UPDATE.

Implemented via:
- Function: update_updated_at_column()
- Triggers on: users, recipes, categories, monthly_schedules

## Notes

- This file is **documentation only**
- All schema changes must be introduced via SQL migration files
- Migration history is stored in `backend/migrations`