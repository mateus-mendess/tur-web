# Technical Specification: Spot Details Page Layout Reorganization

## Executive Summary
This specification outlines the structural and layout adjustments for the Tourist Point Detail Page (`/pontos/$spotId`). The goal is to optimize the visual flow and user experience by repositioning the Information block and the Comments section, adhering to a new structural reference provided by the user. 

## Requirements
1. **Information Block Reorganization (New Position & Layout)**
   - **Position**: Move the information block to appear immediately below the image gallery (`HeroCarousel`).
   - **Layout**: It must feature a horizontal single-line structure containing 5 distinct columns.
   - **Columns**:
     1. Localização (Address/Neighborhood/City)
     2. Nota Média (Stars + numeric rating)
     3. Categoria (Category badges)
     4. Acessibilidade (Accessibility badges)
     5. Autor da publicação (Author avatar + name)
   - **Styling**: Short uppercase labels (weight 600) with a light letter-spacing, followed by regular text (weight 400). Columns must be separated by thin vertical lines. 

2. **Comments Section Reorganization (New Position & Layout)**
   - **Position**: Move the comments section to the location previously occupied by the Information block (alongside the map).
   - **Layout**: Transition from a card grid layout to a vertical list format.
   - **Integration**: The left column will contain the list of comments, and the right column will retain the map placeholder.
   - **Styling**: Maintain the existing visual elements for individual comments (avatar, star rating, author name, truncated text with a "View more" button).

3. **Page Flow Order**
   1. Header (Global, auto-hidden on scroll as already implemented)
   2. Photo Gallery (`HeroCarousel`)
   3. Information Block (5 horizontal columns)
   4. Description Block (About section layout)
   5. Comments List & Map Placeholder (Side-by-side)
   6. Footer (Global)

## Architecture & Tech Stack
- **Framework**: React via TanStack Router (`pontos.$spotId.tsx`).
- **Styling**: Tailwind CSS (Utility classes) heavily utilizing Flexbox and CSS Grid.
  - The 5-column info block will utilize `grid-cols-5` on medium/large screens with `divide-x` utilities for the vertical lines.
  - The Comments & Map section will utilize a `flex-col lg:flex-row` container to balance the list and map.
- **Components**: Reusing existing UI components (`MapPinIcon`, `HeroCarousel`, etc.). No new component files are strictly necessary; modifications will occur entirely within the `SpotDetailPage` component structure.

## State Management
- No new state logic is required.
- Existing React Query hooks (`useSpot`, `useComments`) will continue supplying data to the restructured components.
- Existing local UI state (e.g., modals for editing) remains unaffected.
