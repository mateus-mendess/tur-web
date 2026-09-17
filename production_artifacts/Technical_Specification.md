# Technical Specification: Modal Buttons Standardization

## 1. Executive Summary
This cycle involves committing the previous Review Modal implementation and standardizing the positioning and design of footer action buttons across all modals in the application.

## 2. Requirements & UI/UX Design

### 2.1 Git Commit
- Create a commit for the Review Modal changes with conventional commits.

### 2.2 Button Standardization Rules
Based on the new Review Modal standard:
1. **Secondary Button (Voltar/Cancelar)**:
   - Must be positioned at the bottom left (using `leftFooter` when `SplitModalLayout` is used).
   - Must follow the new design: Arrow left icon (`<-`) + underlined text (e.g. `border-b-[1.5px] border-primary pb-[1px] hover:text-secondary hover:border-secondary transition-colors`).
2. **Primary Button (Avançar/Cadastrar/Autenticar)**:
   - Must be positioned in the right column footer (`footer` prop).

### 2.3 Files to Modify (Strictly only the footer/button blocks)
1. `src/components/Auth/LoginModal.tsx`
2. `src/components/Auth/SignUpModal.tsx`
3. `src/components/Spots/CreateSpotForm.tsx` (and its nested steps if they control the footer)
4. `src/components/Spots/EditSpotModal.tsx`
5. `src/components/Spots/UploadPhotosModal.tsx`

> [!WARNING]
> **Strict Constraint**: Only the code blocks related to buttons and their wrapper classes will be modified. Inputs, titles, layouts, and logic will remain untouched.

## 3. Open Questions for the User

> [!IMPORTANT]
> **Clarification needed on Primary Button positioning:**
> In the last message, you asked me to move the "Comentar" button to the **center of the right side** (`justify-center`).
> However, in this new request, you mentioned: *"Botão Primário (Avançar/Cadastrar/Autenticar): Deve ficar posicionado no canto inferior direito."*
> 
> Should the primary button in these modals be strictly aligned to the **right** (`justify-end`, hugging the right margin) or **centered** in the right column (`justify-center`, matching what I just did for the Comentar button)?

## 4. Next Steps
- Await user approval and clarification on the primary button position.
- Execute the git commit.
- Implement the standardization across the application.
