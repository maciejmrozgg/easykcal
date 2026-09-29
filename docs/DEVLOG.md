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

## 2026-05-11

### Done
- protected product CRUD routes using authMiddleware
- restricted guests to read-only product access
- hide add/edit/delete product actions in frontend for unauthorized users
- improved ProductManager spacing and guest UI layout
- updated ProductManager frontend tests for guest/user conditional rendering
- added frontend test case for hidden CRUD actions for guests
- verified backend and frontend behavior for guest permissions

### Notes
- backend authorization is now enforced both on API level and frontend UI level
- guests can browse products but cannot modify them

## 2026-05-12

### Done
- introduced global toast notification system
- implemented ToastProvider, ToastContext and useToast hook
- added reusable Toast and ToastContainer components
- added TypeScript typings for toast system (ToastType, ToastItem)
- integrated toast notifications with NutritionSummary component
- integrated toast notifications with authentication flow (login/register)
- fixed unauthorized frontend requests by adding credentials: 'include' to protected fetch requests
- improved frontend UX feedback for async actions and errors

### Notes
- toast system is implemented globally using React Context API
- components can trigger notifications through useToast hook
- backend uses JWT authentication stored in HttpOnly cookies
- protected backend routes require credentials: 'include' in frontend fetch requests
- frontend auth state and backend authorization state can differ without credentials support

## 2026-05-13

### Done
- integrated toast notifications with ProductManager component
- added toast feedback for product add/edit/delete actions
- updated frontend tests to support ToastProvider context
- updated auth and product tests after toast integration
- verified frontend tests after toast notification integration

### Notes
- toast notifications are now integrated into auth, nutrition and product management modules
- remaining planned integrations: Recipes and Schedule modules

## 2026-05-14

### Done
- integrated toast notifications with Recipes module
- integrated toast notifications with Schedule module
- added success/info/error/warning toast feedback for recipe and schedule CRUD actions
- added warning toast type with dedicated styling
- added toast icons for all notification types
- improved calorie limit validation UX in Schedule view
- updated Schedule frontend tests to support ToastProvider context
- verified frontend tests after toast integration

### Notes
- toast notifications are now used across auth, nutrition, products, recipes and schedule modules
- warning toast type is intended for validation and non-critical user feedback

### Release
- release v1.1.1 – completed toast notification integration across application

## 2026-06-09

### Started: Product macros

Goal:
- add protein
- add fat
- add carbs

Purpose:
prepare product database for Schedule integration and Nutrition Summary.

## 2026-06-10

### Done
- added protein_per_100g field
- added fat_per_100g field
- added carbs_per_100g field
- added SQL migration for product macros
- updated Product model CRUD operations
- updated Product controller validation
- updated frontend product forms
- updated Product API payloads
- extended ProductManager edit flow with macro fields
- added macro display in ProductList
- improved handling of missing products in update/delete operations
- updated frontend product tests

### Notes
- macro values are optional (NULL allowed)
- prepared product database for future Nutrition Summary and Schedule integration

## 2026-06-11

### Done
- introduced reusable BaseModal component
- moved modal backdrop and container logic into shared UI component
- migrated CategoryModal to BaseModal
- migrated IngredientModal to BaseModal
- moved modal rendering to React Portal (document.body)
- fixed modal positioning issues caused by parent container hover transforms
- verified frontend build and tests after modal refactor

- added ProductModal for product editing
- replaced browser prompt-based product editing with modal form
- added product typings (Product, ProductFormData)
- updated product tests for modal workflow

- improved ProductsProvider error propagation
- fixed product CRUD error handling
- added error toast notifications for failed product operations

### Notes
- BaseModal is now the foundation for future application modals
- modal rendering is independent from parent layout containers
- product editing now uses the shared modal infrastructure
- product API errors now propagate correctly to UI layer

## 2026-06-16

### Done
- added backend CRUD integration tests for products API
- added validation tests for invalid product payloads
- added authorization tests for protected product endpoints
- added not-found test cases for update and delete operations
- synchronized test database schema with product macro fields
- updated test seed data with protein, fat and carbs values
- normalized product numeric fields returned from PostgreSQL to JavaScript Number

### Notes
- product API test coverage now includes CRUD, validation and authorization scenarios
- test database schema is aligned with production product structure
- product numeric values are consistently returned as numbers instead of strings

## 2026-06-17

### Done
- extended schedule ingredient model with protein, fat, carbs and productId fields
- updated schedule backend ingredient CRUD to persist macro nutrients
- extended IngredientModal with protein, fat and carbs inputs
- integrated product database with schedule ingredient modal
- added product selector inside ingredient modal
- implemented automatic kcal and macro calculation based on selected product and weight
- preserved manual ingredient creation workflow alongside product-based workflow
- added meal macro summaries in desktop schedule view
- added meal and day macro summaries in mobile schedule view
- improved mobile schedule layout readability for macro nutrients

### Notes
- ingredients can now be created manually or based on existing products
- product-based ingredients automatically calculate kcal, protein, fat and carbs from weight
- ingredient data now stores optional productId reference
- desktop and mobile schedule views display aggregated macro nutrients

## 2026-06-18

### Done
- added product backup tooling (exportProducts, seedProducts)
- added gitignore rules for local product backup and seed files
- restored selected product in IngredientModal edit mode using productId
- fixed IngredientModal state reset by reinitializing form state on modal open
- added product autocomplete suggestions in ingredient name field
- improved product selector styling
- reset selected product reference when ingredient name is edited manually
- added hover feedback for schedule ingredients in desktop view

### Notes
- older schedule ingredients created before productId support cannot restore product selection automatically
- autocomplete currently supports mouse selection and works alongside the existing product dropdown

## 2026-06-19

### Done
- added products entry to application sidebar
- added kcal per 100g information to product autocomplete suggestions
- added source badges in IngredientModal for manual and product-based ingredients
- added source badges in calorie calculator for manual, product and reverse modes
- moved shared badge styles to global stylesheet
- improved visual consistency between calculator modes
- added schedule information banner explaining calorie deficit and maintenance calories
- added "calculator coming soon" notice in schedule view
- improved schedule information banner styling and status indicators

### Notes
- ingredient source is now visible during creation and editing
- calculator clearly indicates whether values come from product database or manual input
- reverse calculator is visually distinguished from standard calorie calculation flow
- schedule now provides basic guidance for users who do not know their calorie targets
- future plan: replace informational banner with integrated TDEE/BMR calculator

## 2026-06-22

### Done
- added protein, fat and carbs calculation to calorie calculator for product-based mode
- added macro nutrient display in Nutrition Summary
- hide macro nutrients for manually entered calorie values
- moved calorie and reverse calorie calculations entirely to the frontend
- removed calculator backend API, routes and controller
- removed unnecessary frontend calculator API layer
- added macro nutrient preview to calculator product suggestions
- improved reverse calculator toggle button styling
- updated frontend tests after Schedule + Products integration
- added IngredientModal tests for manual and product-based ingredient workflows
- updated MonthView tests after product context integration
- updated desktop and mobile Schedule component tests
- removed obsolete calculator tests after frontend calculator migration
- added total weight display in Nutrition Summary
- updated NutritionSummary tests after macro nutrient support

### Notes
- manual calculator mode displays only calories because macro nutrients are unavailable
- product-based mode calculates calories and macro nutrients locally using selected product values
- reverse calorie calculation is now performed entirely on the frontend
- product suggestions now display kcal and macro nutrients before calculation to simplify product selection
- frontend test suite is aligned with the new frontend-only calculator architecture
- schedule component tests now cover product-based ingredients and macro nutrient support

## 2026-06-24

### Done
- extracted reusable DaySummary component shared by desktop and mobile Schedule views
- added daily macro progress percentages (protein, fat, carbs)
- added configurable macro targets (temporary frontend constants)
- added color indicators for macro goal completion
- added macro progress bars to daily summary
- unified Schedule daily summary UI between desktop and mobile
- started cleanup and refactor of DaySummary component

### Notes
- macro targets are currently stored as frontend constants
- custom user-configurable macro targets are planned in future Schedule update

## 2026-06-26

### Done
- completed DaySummary component cleanup and refactor
- improved macro progress calculation structure
- renamed helper functions for better readability
- added dedicated frontend tests for DaySummary component
- verified frontend tests after DaySummary refactor

### Notes
- DaySummary is now shared by both desktop and mobile Schedule views
- macro progress rendering is generated from a reusable configuration array

## 2026-07-02

### Done
- added "Go to today" navigation in Schedule
- implemented automatic scrolling to current day in desktop Schedule view
- implemented automatic current day selection in mobile Schedule view
- synchronized current day navigation across month changes
- improved Schedule navigation state by resetting scroll target after navigation

### Notes
- desktop uses scrollIntoView() for current day navigation
- mobile switches selected day instead of scrolling

## 2026-07-08

### Done
- improved recipe search suggestions readability
- replaced blurred suggestions background with component background
- improved search suggestion colors for both light and dark themes
- improved Schedule product suggestion readability
- clarified product list nutrition label by displaying "kcal/100g"

### Notes
- recipe search suggestions now provide better contrast and readability across both themes

## 2026-07-16

### Done
- added monthly nutrition averages in Schedule
- added last 7 days nutrition averages for current month
- display days included in average calculations
- added quick navigation from averages to selected day
- added hover highlighting for last 7 days average
- extracted reusable nutrition averages utilities
- improved Schedule averages UI for desktop and mobile themes
- adjusted Schedule layering (z-index) after sticky header improvements

### Notes
- last 7 days averages are displayed only for the current month
- averages ignore empty days without nutrition data

## 2026-07-21

### Done
- improved Schedule layout to use the full available content width
- replaced percentage-based sidebar widths with fixed CSS variables
- introduced shared sidebar width variables for desktop layout
- lifted sidebar collapsed state to App component
- synchronized main content spacing with sidebar state
- improved Schedule responsiveness across desktop resolutions
- prepared layout for future tablet-specific breakpoint
- extracted reusable custom scrollbar styles
- reused shared scrollbar styling across Products, Recipes and Schedule views
- improved tablet responsiveness for Schedule
- optimized Schedule header and Nutrition Averages spacing
- improved Schedule day navigation scrolling
- aligned "Today" button and nutrition averages navigation to shared scroll handler
- adjusted desktop day navigation to account for sticky schedule header

### Notes
- desktop layout now uses fixed sidebar dimensions instead of percentage widths
- mobile layout keeps overlay sidebar behavior
- tablet-specific responsive layout is planned as a separate improvement
- custom scrollbar styling is now centralized and can be reused by future scrollable components
- desktop scrolling now aligns the selected day below the sticky header using scroll-margin-top
- mobile navigation behavior remains unchanged

## 2026-07-22

### Done
- added Nodemon as a backend development dependency
- updated database schema documentation (SCHEMA.md)
- added custom scrollbar styling to the Ingredient Modal product selector

### Notes
- backend development no longer depends on a globally installed Nodemon
- project setup is now fully reproducible after installing project dependencies
- Ingredient Modal product selector now uses the shared custom scrollbar styling

## 2026-09-04

### Done
- Added reusable `UserSettingsModal` component.
- Styled the user settings modal for desktop and mobile layouts.
- Added optional `className` support to `BaseModal` for component-specific styling.
- Connected the user settings modal to the sidebar.
- Improved modal responsiveness without affecting other modal components.
- Prepared database migration for user nutrition settings.
- Updated `SCHEMA.md` with the new `users` table fields.

### Notes
- The modal UI is complete.
- Database schema has been prepared for user nutrition settings.
- Next step is implementing user settings persistence (backend API and frontend integration).

## 2026-09-07

### Done
- Implemented backend API for user settings.
- Added authenticated GET /api/user-settings endpoint.
- Added authenticated PATCH /api/user-settings endpoint.
- Implemented user settings database queries.
- Added frontend userSettingsApi service.
- Verified backend endpoints using Postman.

### Notes
- Backend API for user settings is complete.
- Remaining work focuses on React integration and user settings persistence in the UI.

## 2026-09-16

### Done
- completed frontend integration of UserSettingsModal with user settings API
- implemented loading and displaying user settings from backend
- implemented saving user settings to backend
- added frontend validation for user settings
- added validation for required goal and custom nutrition targets
- implemented validation for optional custom targets and prevention of partially configured targets
- added error handling for GET and PATCH user settings requests
- integrated success and error toast notifications for user settings
- verified frontend validation and error handling behavior

### Notes
- user can leave all custom nutrition targets unset; existing deficit and zero-calorie limits remain active
- when custom targets are configured, all four targets (kcal, protein, fat and carbs) must be provided
- custom nutrition targets must be positive integers
- backend validation remains to be verified
- Schedule integration and frontend/backend tests are still pending

## 2026-09-18

### Done
- completed backend validation for user nutrition settings
- updated DaySummary to use userSettings instead of frontend macroTargets constants
- lifted user settings state and fetching from MonthView to App
- implemented custom daily calorie target progress in DaySummary
- added calorie progress percentage with progress bar width capped at 100%
- implemented calorie status colors for mass, reduction and maintenance goals
- preserved existing deficit and zero-calorie limit behavior when custom calorie targets are not configured

### Notes
- custom calorie and macro targets remain optional
- when custom targets are not configured, the existing deficit and zero-calorie limits remain active
- calorie progress can exceed 100%, while the progress bar itself is capped at 100%
- calorie status colors depend on the selected nutrition goal
- Schedule/MonthView integration and frontend/backend tests are still pending

## 2026-09-21

### Done
- completed conditional macro rendering in DaySummary
- when custom targets are not configured, DaySummary displays only current macro values without percentages or progress bars
- when custom targets are configured, DaySummary displays macro progress percentages and progress bars
- completed MonthView integration with user nutrition settings
- displayed selected nutrition goal and custom daily calorie target in Schedule header
- added information that custom targets can be edited in User Settings
- added message displayed when custom nutrition targets are not configured
- improved MonthView header layout for custom target information and calorie limits
- added goal label mapping for user-facing nutrition goal names
- completed custom calorie and macro target integration in Schedule
- verified custom target behavior on desktop and mobile layouts

### Notes
- custom calorie and macro targets remain optional
- when custom targets are not configured, the existing deficit and zero-calorie limits remain active
- calorie progress can exceed 100%, while the progress bar itself is capped at 100%
- calorie status colors depend on the selected nutrition goal
- DaySummary displays macro progress only when custom targets are configured
- backend and frontend tests for user settings are still pending

## 2026-09-23

### Done
- completed backend integration tests for user settings
- added validation test coverage for user settings API
- verified valid and invalid user settings payloads
- updated existing frontend tests after userSettings integration
- added required userSettings props to DaySummary, MonthView and desktop/mobile Schedule tests
- verified frontend test suite after userSettings integration
- started UserSettingsModal frontend tests
- added tests for modal rendering when open
- added test for modal not rendering when closed
- added test for closing the modal using the Cancel button
- mocked userSettingsApi.getUserSettings to prevent real API requests during frontend tests

### Notes
- backend user settings tests are complete
- UserSettingsModal frontend tests are partially complete
- current UserSettingsModal tests cover basic rendering and closing behavior
- remaining UserSettingsModal tests should cover validation, saving settings, API errors and updateUserSettings callback
- frontend tests currently pass, with an act(...) warning caused by the asynchronous settings fetch during component rendering

### In Progress
- UserSettingsModal frontend test coverage

## 2026-09-24

### Done
- completed UserSettingsModal frontend rendering and interaction tests
- added frontend validation tests for empty and partially configured nutrition targets
- added validation error toast test
- verified that invalid settings are not sent to the API

### In Progress
- remaining UserSettingsModal frontend validation tests

## 2026-09-29

### Done
- completed UserSettingsModal frontend test coverage
- added validation tests for valid and invalid nutrition targets
- added API error handling test
- verified frontend test suite: 80 tests passing

### Notes
- User Settings test coverage is complete
- existing React test warnings in MonthView and ProductManager remain to be addressed separately