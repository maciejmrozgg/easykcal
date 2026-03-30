# Development Log

Development log started on 2026-03-04.
Earlier development notes were kept privately.

## 2026-03-04

### Done
- fixed backend and frontend tests
- reduced backend test time: 12s → 4s
- reduced frontend test time: 34s → 7s
- added seeds.sql for test database
- added safety guard preventing tests from running on production database
- release v1.0.3 – test stabilization and documentation update
- release v1.0.4 – fix preventing tests from wiping production database

### Issues discovered
- tests previously wiped production database due to missing environment guard

## 2026-03-12

### Done
- added default categories seed for production database

## 2026-03-30

### Done
- extracted RecipeCard component

### In Progress
- started refactor of Recipe module