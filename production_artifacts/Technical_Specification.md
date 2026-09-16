# Technical Specification: Change Password Modal

## 1. Executive Summary
The objective of this cycle is to implement a new "Change Password" functionality for authenticated users. This includes adding a new option in the user's dropdown menu and creating a dedicated modal for the password update process. The modal will strictly follow the established two-column layout of the `SignUpModal` for visual consistency.

## 2. Requirements & UI/UX Design

### 2.1 Navigation Update
- **Component**: `src/components/NavBar/UserMenu.tsx`
- **Action**: Add a new menu item labeled "Alterar Senha".
- **Position**: It must be placed after "Meus Favoritos" and before "Sair".
- **Trigger**: Clicking this option will open the new `ChangePasswordModal`.

### 2.2 Modal Structure & Layout
- **Component**: `src/components/Auth/ChangePasswordModal.tsx`
- **Layout**: It will reuse the two-column structure (split layout) present in the authentication modals.
  - **Left Column**: Informational text guiding the user (e.g., "Segurança", "Atualize sua senha para manter sua conta protegida.").
  - **Right Column (Form)**: The form area containing only the required fields.

### 2.3 Form Specifications
The form will exclusively contain the following fields:
1. **Senha Atual**: Password input for the current password.
2. **Nova Senha**: Password input for the new password.
3. **Confirme nova senha**: Password input to confirm the new password.
4. **CTA Button**: A submission button labeled "Salvar Senha".

## 3. Architecture & State Management

- **Form Management**: The form will be managed using `react-hook-form` integrated with `zod` for validation.
- **Validation Rules**:
  - `senhaAtual`: Must not be empty.
  - `novaSenha`: Must have a minimum of 6 characters.
  - `confirmaNovaSenha`: Must match `novaSenha`.
- **API Integration Simulation**: Similar to previous flows, the actual API call for changing the password will be simulated using a `setTimeout` function to reflect loading states (`idle`, `loading`, `success`, `error`) before closing the modal.
- **Modal Control**: The visibility state of the modal (`isOpen`, `onClose`) will be managed either locally in `UserMenu.tsx` or via a global Auth context, depending on the current architecture for user-specific modals.

## 4. Next Steps
- Await user approval of this technical specification.
- Proceed to implementation as the Front-End Engineer.
