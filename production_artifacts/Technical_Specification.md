# Technical Specification: Forgot Password Flow

## 1. Executive Summary
The goal of this cycle is to implement a seamless "Forgot Password" flow directly within the authentication modal (`LoginModal`). Following the continuous state transition architecture established in the registration flow, this process will not close or reload the modal. Instead, it will dynamically update the internal view to guide the user through password recovery.

## 2. Requirements & Steps
- **Modal View States**: The `LoginModal` will introduce an internal state to control the views: `'login' | 'forgot_email' | 'forgot_code' | 'forgot_reset'`.
- **Step 1: Request Email** (`forgot_email`):
  - Triggered by clicking "Esqueceu a senha?" in the login view.
  - Displays a single email input and a submission button ("Enviar código").
- **Step 2: Code Validation** (`forgot_code`):
  - Triggered after successfully submitting the email in Step 1.
  - Reuses the exact same `OtpInput` (6 digits) component used in the sign-up flow.
  - Displays a message indicating the code was sent to the requested email.
- **Step 3: Define New Password** (`forgot_reset`):
  - Triggered after successfully validating the 6-digit code.
  - Displays two fields: "Nova senha" and "Confirmar nova senha".
  - Includes a submission button ("Salvar Nova Senha").
  - On success, transitions back to the `'login'` view and displays a success message, or logs the user in immediately.

## 3. Architecture & Tech Stack
- **Component Modifications (`src/components/Auth/LoginModal.tsx`)**:
  - Introduce new states: `const [view, setView] = useState<'login' | 'forgot_email' | 'forgot_code' | 'forgot_reset'>('login')`
  - Introduce state variables to hold data between steps: `forgotEmail`, `otpValue`, `newPassword`, `confirmNewPassword`.
  - Conditional rendering for the left column (title/instructions) and right column (forms) based on the current `view`.
- **UI Components**:
  - Reuse `<Input>`, `<Label>`, `<Button>`, and `<OtpInput>` from the `src/components/UI` folder to ensure visual consistency.
- **API Simulation**:
  - As the backend endpoints for password reset do not exist yet, API calls for sending the email, verifying the code, and saving the password will be mocked using `setTimeout`.

## 4. State Management & Validation
- **Validation**: Inline validation or manual error states will be used for the new steps, maintaining a clean form submission process without complicating the primary login `react-hook-form` instance.
- **Navigation**: "Voltar ao login" buttons will be present in the new views (in the left column) to allow users to cancel the recovery process.

## 5. Next Steps
- User approval of this technical specification.
- Execution by the Front-End Engineer to update `LoginModal.tsx` and implement the 3 new views.
