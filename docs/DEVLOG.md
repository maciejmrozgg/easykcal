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

## 2026-04-08

### Done
- performed security audit of backend and frontend dependencies using npm audit
- extracted RecipesToolbar component

### In Progress
- refactor of Recipe module

## 2026-04-15

### Done
- completed view extraction in Recipes module
- extracted CategoriesView component
- extracted CategoryView component
- extracted RecipesListView component
- improved separation of concerns (logic vs UI)
- reduced size and complexity of Recipes.jsx
- introduced custom hook (useRecipes) for data fetching and CRUD logic
- moved recipes and categories logic into useRecipes hook
- removed direct API usage from Recipes.jsx

### In Progress
- refactor of Recipe module
- cleanup of Recipes.jsx (further simplification)
- preparing for TypeScript migration in Recipes module

## 2026-04-20

### Done
- moved filtering and grouping into hook
- cleanup Recipe component and improve structure
- initialized TypeScript setup

### In Progress
- introduce TypeScript in Recipes module

## 2026-04-27

### Done
- configured TypeScript for frontend (tsconfig, global types, gradual adoption setup)
- migrated Recipes module to TypeScript (Recipes.tsx)
- introduced shared types (Recipe, Category, User, ViewMode)
- typed useRecipes hook (state and return values)
- migrated recipesApi and categoriesApi to TypeScript with typed responses
- added type safety for component state, handlers and refs in Recipes
- removed usage of 'any' in Recipes component

### In Progress
- introduce TypeScript in remaining Recipes module components
- typing component props (starting with RecipesToolbar)

## 2026-05-05

### Done
- added TypeScript typings for RecipesToolbar props
- added TypeScript typings for CategoryView props
- aligned component props with shared types (Recipe, Category, User, ViewMode)
- improved type safety in Recipes module (removed implicit any in components)
- refined conditional rendering logic for category-based views

### In Progress
- typing remaining Recipes module components (RecipesListView, CategoriesView, RecipeCard)
- final cleanup before closing refactor/recipes-module branch

## 2026-05-08

### Done
- completed TypeScript migration of Recipes module
- added typings for RecipesListView, CategoriesView, RecipeCard and CategoryModal
- typed CRUD handlers in useRecipes hook
- migrated recipeUtils to TypeScript
- aligned frontend types with backend API responses
- added missing Recipe, User and Category properties
- fixed category selection bug caused by typed Category state
- verified frontend build, tests and TypeScript compilation

### Release
- release v1.1.0 – completed Recipes module TypeScript migration