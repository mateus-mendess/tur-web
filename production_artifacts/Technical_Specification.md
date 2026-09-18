# Technical Specification: Code Review Ciclo 3 — Desacoplamento e Padronização de Forms

## 1. Executive Summary
Esta especificação detalha o terceiro ciclo de refatoração do frontend. O objetivo principal é quebrar o último "God Component" remanescente, padronizar o uso de formulários e schemas, e extrair lógicas misturadas, tudo para garantir uma base de código robusta e alinhada ao estado-da-arte em React. Não haverá alterações no design ou na interface visual.

> **REGRA CRÍTICA**: Nenhuma classe Tailwind, texto de UI, layout ou comportamento visual será alterado. O foco é exclusivamente estrutural.

---

## 2. Requirements

### 2.1 Refatoração Crítica (Desacoplamento)
1. **Quebra do `LoginModal.tsx`:**
   - **Problema:** O arquivo possui mais de 550 linhas, misturando login, cadastro e um fluxo complexo em 3 etapas de "Esqueci a Senha".
   - **Solução:** Extrair a parte de recuperação de senha (views `forgot_email`, `forgot_code`, `forgot_reset` e seus respectivos estados/handlers) para um novo componente isolado `src/components/Auth/ForgotPasswordFlow.tsx`. O `LoginModal.tsx` apenas importará e chamará esse componente passando as props necessárias quando a `view` corresponder ao fluxo de recuperação.

### 2.2 Padronização (Formulários)
2. **Refatorar `ReviewModal.tsx`:**
   - **Problema:** O modal de avaliação foi construído manualmente utilizando `useState` puro (`authorName`, `content`, `note`), desviando do padrão do projeto.
   - **Solução:** Criar um `reviewSchema` utilizando `zod` em um novo arquivo (ex: `src/schemas/reviewSchema.ts`) ou dentro do arquivo, e refatorar o formulário em `ReviewModal.tsx` para utilizar `react-hook-form` e `@hookform/resolvers/zod`.

3. **Simplificar `spotSchema.ts` (Remoção da Tradução):**
   - **Problema:** O schema atual usa chaves em português (ex: `nome`, `rua`, `cep`), forçando a função `toTouristPointRequest` em `spotsService.ts` a mapear manualmente esses campos para as chaves reais da API.
   - **Solução:** 
     - Renomear as chaves de `spotSchema.ts` para refletirem o contrato da API (`name`, `description`, `categoriesIds`, `accessibilityTypesIds`, `addressRequest.street`, etc).
     - Atualizar os formulários (`CreateSpotForm.tsx` ou similar, e `EditSpotModal.tsx`) para usar esses novos nomes no `register` do hook form.
     - Remover a função `toTouristPointRequest` em `spotsService.ts` e passar a payload diretamente.

### 2.3 Qualidade de Código (Hooks)
4. **Extrair lógica de scroll da `NavBar.tsx`:**
   - **Problema:** O componente visual possui um bloco longo de lógica no `useEffect` lidando diretamente com `window.addEventListener('scroll')` e checando offsets.
   - **Solução:** Criar um custom hook `useScrolled` em `src/hooks/useScrolled.ts` (ex: `useScrolled(threshold: number): boolean`) e aplicar na `NavBar.tsx`, deixando a lógica isolada e reutilizável.

---

## 3. Escopo Negativo (O que NÃO será feito)
- **Não** criar endpoints reais para o fluxo de "Esqueci a Senha" (se a API não suportar, a simulação existente de setTimeout continuará operando dentro do componente extraído).
- **Não** alterar layouts, estilos, textos ou responsividade dos modais/elementos afetados.

---

## 4. Verification Plan
- **Testes de Compilação:** Executar `npx tsc --noEmit` para garantir que as alterações no `spotSchema` e a quebra do Modal não quebraram a tipagem.
- **Teste Manual (Fluxos Críticos):**
  - **Login / Esqueci a Senha:** Abrir o modal de login, navegar pelas telas de "Esqueci a senha", inserir dados mockados e chegar até a tela de confirmação de senha redefinida.
  - **Avaliação:** Adicionar um comentário num Ponto Turístico verificando se a validação (Zod) exige as regras corretas e o formulário limpa corretamente.
  - **Criação / Edição de Pontos:** Criar ou editar um ponto turístico utilizando o formulário para garantir que os novos `name` da API estão capturando os dados e enviando corretamente para o servidor.
  - **Navegação (Scroll):** Rolar a página inicial para verificar se o background da NavBar transiciona normalmente usando o novo hook.
