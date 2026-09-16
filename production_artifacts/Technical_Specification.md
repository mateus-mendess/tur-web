# Technical Specification: Bug Fix - Category Creation & Selection State

## 1. Executive Summary
This cycle addresses a bug in the spot creation form (`Step2Categories`), specifically regarding the state management and rendering logic when creating a new category. The current implementation mistakenly auto-selects a newly created category, leading to synchronization issues ("ghost selection" items) because the frontend cache has not yet refreshed with the new category data.

## 2. Requirements & UI/UX Design

### 2.1 Decouple Creation and Selection (No Auto-Selection)
- **Current Behavior**: When the user clicks the `+` button or presses Enter, `handleAddCategory` calls the API and immediately forces the new category's ID into the `categoriasWatch` array (the selected form state).
- **New Requisite**: Creating a new category and selecting a category must be two strictly independent actions. 
- **Implementation**: The `handleAddCategory` function in `useSpotCategories.ts` will be updated to only create the category and clear the input field. It will **no longer** execute `setValue('categorias', ...)` to auto-select the item. The user will have to explicitly select the category from the dropdown once it appears.

### 2.2 Ghost Item Prevention (Empty State Blocking)
- **Current Behavior**: If an ID is present in the form state but missing from the local `categoriesData` cache (e.g., due to race conditions), it renders a blank or malformed badge.
- **New Requisite**: Ensure the UI is resilient against phantom or unresolved category IDs.
- **Implementation**: In `Step2Categories.tsx`, the rendering loop for selected categories will be fortified. We will ensure that only valid, truthy category names are rendered. If a category ID cannot be resolved to a proper name (or returns an empty string/null), it will not be rendered as an empty badge.

## 3. Architecture & State Management
- **`useSpotCategories.ts`**: Remove the auto-selection logic (`setValue`) from `handleAddCategory`.
- **`Step2Categories.tsx`**: Add conditional rendering/filtering before mapping over `categoriasWatch` to guarantee no empty `<span>` tags are created for unresolved items.

## 4. Next Steps
- Await user approval of this technical specification.
- Proceed to implementation as the Front-End Engineer.
