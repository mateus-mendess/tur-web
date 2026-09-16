# Technical Specification: Unified Image Management Interface

## 1. Executive Summary
The goal of this cycle is to refactor the `UploadPhotosModal` to provide a unified visual experience for image management. Currently, the modal segregates previously saved images ("Fotos atuais") from newly selected images ("Uploads") using distinct layouts. This update will remove the segregation, displaying all images—both saved and staged—within a single, consistent list layout.

## 2. Requirements & UI/UX Design

### 2.1 Removal of Segregated Layout
- **Target Component**: `src/components/Spots/UploadPhotosModal.tsx`
- **Action**: Completely remove the "Fotos Atuais" title (currently around line 151) and its `grid grid-cols-2` container.

### 2.2 Visual Unification
- **Layout Reference**: All images will use the row-based layout currently implemented for the "Uploads" section (thumbnail on the left, file name and size in the center, and a trash icon button on the right).
- **Existing Photos Integration**:
  - The `spot.photos` array will be mapped into this unified list structure.
  - Since existing photos only have a URL (and no local `File` object with size/name), a placeholder name (e.g., "Imagem salva") and a placeholder/empty size will be displayed to maintain structural consistency with the design reference.
  - The delete action (trash icon) for existing photos will trigger the existing `handleDeletePhoto` logic (calling the deletion API).
- **Staged Photos**:
  - Newly selected files (`selectedFiles`) will continue to render in the same list, visually indistinguishable in structure from the existing photos.
  - Their delete action will trigger `handleRemoveSelectedFile` (removing them from the upload queue).

### 2.3 Single Gallery Flow
- The UI will present a unified section (e.g., under a single title "Uploads" or similar) listing all images.
- The drag-and-drop / file selector box will remain available as long as the total number of images (existing + staged) is below the maximum limit (4).

## 3. Architecture & Implementation Plan
- **State Management**: No changes to the underlying state logic. `selectedFiles` and `spot.photos` remain separate in state but are merged visually during rendering.
- **Render Logic**: Create a single `<ul>` element. First, map over `spot.photos` and render the list items. Then, map over `progress` (or `selectedFiles` if progress is empty) and render their respective list items.
- **Delete Logic Mapping**: The delete button's `onClick` handler will intelligently call either the API delete mutation (for existing photos) or the state removal function (for staged files) based on the item type being rendered.

## 4. Next Steps
- Await user approval of this technical specification.
- Proceed to implementation as the Front-End Engineer.
