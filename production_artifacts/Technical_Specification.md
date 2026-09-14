# Technical Specification: Action Buttons Loading State with Backend Request

## Executive Summary
This document outlines the technical specification for implementing a reusable loading state on action buttons that trigger backend requests. The goal is to provide visual feedback (loading, success, error) to the user and prevent double submissions.

## Requirements
1. **Reusable Component**: Create a wrapper or a new `Button` component that accepts a `status: 'idle' | 'loading' | 'success' | 'error'` or integrates with a hook/React Query.
2. **Visual Feedback**:
   - Loading: Spinner replacing text/icon, or beside it (without width changes).
   - Success: Check icon briefly (800ms-1s).
   - Error: X icon briefly, followed by error message display (using Sonner toast or existing error handling).
3. **Behavior**:
   - Button disables on click.
   - Remains disabled until the request resolves (success or error).
   - Prevents multiple clicks/requests.
   - No artificial latency (no fake `setTimeout`).
4. **Scope of Application**:
   - User Registration
   - Authentication (Login)
   - Tourist Spot Registration ("Cadastrar" step 3)
   - Category Registration ("+" button)
   - Update Tourist Spot Info ("Salvar")
   - Update Location ("Salvar")
   - Image Upload
   - Image Removal
   - Delete Tourist Spot (confirmation)

## Architecture & Tech Stack
- **Framework**: React 19, Vite.
- **Styling**: Tailwind CSS v4.
- **State Management / Data Fetching**: `@tanstack/react-query` mutations (`isPending`, `isSuccess`, `isError`).
- **Icons**: Standard SVG/Icon library used in the project (e.g. Radix Icons or Lucide, to be verified).
- **Notifications**: `sonner` for error toasts.

## State Management
- Utilize the native states provided by `@tanstack/react-query`'s `useMutation` hook:
  - `isPending` maps to the `loading` status.
  - `isSuccess` maps to the `success` status (which triggers a brief UI change, then cleanup).
  - `isError` maps to the `error` status.
- **Implementation Strategy**:
  - We can create an `AsyncButton` component that accepts a `mutation` object or boolean flags (`isPending`, `isSuccess`, `isError`).
  - Example Prop Signature:
    ```tsx
    interface AsyncButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
      isPending?: boolean;
      isSuccess?: boolean;
      isError?: boolean;
    }
    ```
  - For the temporary success/error icon display, the `AsyncButton` will manage an internal state (e.g. `showSuccessIcon`, `showErrorIcon`) with a `useEffect` that sets a timeout to revert to idle after 1s.

## User Review Required
> [!IMPORTANT]
> - Do you approve of this tech stack and specification?
