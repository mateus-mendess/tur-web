# Technical Specification: Hero Section Navigation & Image Placeholder

## 1. Executive Summary
This cycle will address two usability and aesthetic improvements:
1. **Interactive Hero Section**: Transform the static destination cards in the Hero Section into clickable elements that navigate directly to their respective detail pages.
2. **Refined Image Placeholder**: Replace the basic missing-image state with a sophisticated, CSS-based geometric placeholder inspired by the default LinkedIn cover photo, eliminating any reliance on broken image tags or plain gray boxes.

## 2. Requirements & UI/UX Design

### 2.1 Hero Section Navigation
- **Component**: `src/components/Spots/FeaturedSpotsSection.tsx`
- **Action**: Enhance the `article` tags representing the destination cards.
- **Implementation**: The cards currently have an `onClick` handler, but to ensure proper web semantics, accessibility, and robust routing, we will wrap them in a `<Link>` component from `@tanstack/react-router` pointing to `/pontos/$spotId`.

### 2.2 Sophisticated Image Placeholder (Empty State)
- **Components Affected**: `FeaturedSpotsSection.tsx` and `SpotCard.tsx`.
- **Design Reference**: The placeholder will strictly follow the provided LinkedIn default cover pattern.
- **Visual Structure**: 
  - A container with a light gray background (e.g., `#E3E4E5`).
  - A large, slightly darker geometric circle/ellipse (`#D0D3D6`) positioned absolutely (e.g., overflowing from the top-left or center-left) to create the signature abstract aesthetic.
- **Behavior**: This placeholder will conditionally render whenever a spot lacks a valid `imageUrl` or `gallery`, completely replacing the `<img>` tag to prevent browser broken-image icons.
- **Reusable Component**: We will abstract this into a small reusable component (e.g., `ImagePlaceholder`) to maintain DRY principles across the `SpotCard` and the `FeaturedSpotsSection`.

## 3. Architecture & State Management
- No new state or API modifications are required.
- The routing will utilize the existing `@tanstack/react-router` configuration.

## 4. Next Steps
- Await user approval of this technical specification.
- Proceed to implementation as the Front-End Engineer.
