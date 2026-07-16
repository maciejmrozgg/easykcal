# EasyKcal Backlog

## Features
- [x] Schedule + Products integration (meal tracker with kcal and macros)
- [x] Daily and meal-level nutrition summaries
- [x] Daily macro progress bars in Schedule

- [x] Today button in Schedule
- [x] Weekly and monthly nutrition averages
- [ ] Custom daily kcal and macro targets

- [ ] Integrate Nutrition Summary with Schedule
- [ ] Add recipe images support
- [ ] Use Product database in Recipe ingredients

- [x] BaseModal component for shared modal logic
- [x] Default categories in production database
- [x] Restrict product management for guests (read-only access)
- [x] Toast notifications for user actions
- [x] Add protein, fat and carbs support for products

- [x] Add backend CRUD tests for products API
- [x] Improve product error handling and toast notifications

## Backend improvements
- [ ] Transactional tests
- [ ] Test coverage reporting
- [x] Backup system for products (export / seed)

## Frontend improvements
- [ ] Refactor product data flow to pass Product objects instead of individual fields
- [x] Refactor Recipes.jsx into smaller components
  - [x] Extract RecipeCard
  - [x] Extract RecipesToolbar
  - [x] Extract views (categories / list)
  - [x] Move logic to hooks
- [x] Introduce TypeScript in Recipes module

## DevOps
- [ ] Docker containerization
- [ ] Deployment (backend + frontend + database)