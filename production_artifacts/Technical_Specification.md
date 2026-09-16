# Technical Specification: Email Verification in Sign Up Flow

## 1. Executive Summary
The goal of this cycle is to introduce a seamless e-mail verification step into the user registration process. Instead of reloading the page or closing the modal immediately upon successful registration, the existing `SignUpModal` will transition to a new verification view. This guarantees a fluid user experience while encouraging immediate validation of the created account.

## 2. Requirements
- **Modal View State**: The `SignUpModal` will implement an internal view state (`'signup' | 'verification'`). After a successful registration, it transitions to the `'verification'` state.
- **Background Action Simulation**: Upon transitioning to the verification view, the application will simulate the dispatch of a 6-digit verification code to the registered e-mail address.
- **Verification UI**: 
  - A clear instruction message will prompt the user to check their e-mail.
  - A 6-digit code input will be presented using a split-input design (6 individual text boxes) that automatically focus-advances upon typing.
- **Mocked Verification Submission**: Since the API endpoint for this validation does not exist yet, the "Verify" button will simply simulate a successful check and then close the modal, optionally logging the user in or navigating them to the success state.

## 3. Architecture & Tech Stack
- **Component Modifications (`src/components/Auth/SignUpModal.tsx`)**:
  - Add a state variable: `const [view, setView] = useState<'signup' | 'verification'>('signup')`
  - Modify `onSubmit` to switch to the `verification` view instead of closing the modal.
  - Render conditionally: If `view === 'signup'`, show the existing form. If `view === 'verification'`, render the new OTP verification UI.
- **New Component (`src/components/UI/OtpInput.tsx`) (Optional/Inline)**:
  - We can build the 6-digit OTP input directly inside the `SignUpModal` or as a reusable component. Given the design guidelines, it will use an array of 6 refs attached to standard unstyled inputs styled to match the Design System (square borders, minimalist).
  - The logic will handle `onChange` to move focus to the next input, and `onKeyDown` (Backspace) to move to the previous input.
- **Design Tokens**: The new view will strictly follow the `.agents/context/design_global.md` guidelines, utilizing `--color-primary` for text and borders, with no border-radius for the input squares to match the "card" style.

## 4. State Management
- **Local State**: `view` will toggle between screens.
- **Verification Code State**: A `code` state variable (`string[]` of length 6) will hold the typed digits.
- **Simulated Action**: A `setTimeout` will mock the validation delay. Once successful, the flow will mimic the prior behavior (closing the modal and invoking `onSwitchToLogin`).

## 5. Next Steps
- Approval of this technical specification.
- Execution by the Front-End Engineer to update `SignUpModal.tsx` and implement the 6-digit input view.
