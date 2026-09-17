# Technical Specification: Spot Detail Title Typography & Layout

## 1. Executive Summary
This cycle addresses layout and typography issues in the Spot Detail page (`pontos.$spotId.tsx`). Currently, long spot names are wrapping into multiple lines awkwardly because the font size is exceptionally large (`text-[130px]`), and the container does not perfectly align with the global Header's max-width. We will implement responsive typography and structural alignment using Tailwind CSS.

## 2. Requirements & UI/UX Design

### 2.1 Layout Alignment
- **Current Behavior**: The title container uses a centered flex layout with a generic `px-6` padding and `max-w-6xl` on the `h1`.
- **New Requisite**: The text bounding box should align with the site's global header limits. 
- **Implementation**: We will wrap the title block's content within the reusable `<PageContainer>` component (or apply its exact `max-w-7xl mx-auto w-full` wrapper logic) to ensure horizontal alignment perfectly mirrors the navigation bar.

### 2.2 Responsive Typography & Line Clamping
- **Current Behavior**: The `h1` uses extreme fixed sizes (`text-[80px] md:text-[130px]`).
- **New Requisite**: Reduce the font size to allow the text to flow smoothly into 1 or 2 lines maximum within the new expanded container.
- **Implementation**:
  - Update the `h1` font sizes to responsive Tailwind classes (e.g., `text-5xl md:text-7xl lg:text-[90px]`).
  - Add `line-clamp-2` to the `h1` to guarantee it never exceeds two lines of text on smaller viewports, protecting the page structure from exceptionally long spot names.

## 3. Architecture & State Management
- **File to Edit**: `src/routes/pontos.$spotId.tsx`
- No state management or API changes are required. All updates are purely structural (Tailwind CSS classes).

## 4. Next Steps
- Await user approval of this technical specification.
- Proceed to implementation as the Front-End Engineer.
