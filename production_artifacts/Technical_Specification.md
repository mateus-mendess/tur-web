# Technical Specification: Code Review Ciclo 2 — Correções Críticas e Consistência de Padrões

## 1. Executive Summary
Esta especificação detalha o segundo ciclo de refatoração do frontend. O foco principal é a correção de bugs reais de UX (como reload da página desnecessário), violações arquiteturais e a padronização do código. Não haverá NENHUMA alteração de design, layout, textos ou comportamento visual.

> **REGRA CRÍTICA**: Nenhuma classe Tailwind, texto de UI, layout ou comportamento visual pode ser alterado. O objetivo é apenas corrigir a estrutura interna e a consistência do código.

---

## 2. Requirements

### 2.1 Correções Críticas (Prioridade Alta)
1. **`useUploadPhotos.ts` (Remoção de Reload):**
   - **Problema:** A linha que executa `window.location.reload()` após o upload de fotos destrói o estado da SPA de forma desnecessária, causando uma má experiência.
   - **Solução:** Remover a linha `setTimeout(() => window.location.reload(), 1000)`. A atualização da UI ocorrerá naturalmente por meio do React Query (`queryClient.invalidateQueries`) já presente no código.

2. **`EditSpotModal.tsx` (Violação Arquitetural):**
   - **Problema:** O modal importa e utiliza o `api` (`import { api } from '#/lib/axios'`) diretamente. Isso quebra a separação de responsabilidades.
   - **Solução:** Substituir a chamada direta ao axios pelas funções apropriadas dentro da pasta `services/` (por exemplo, `spotsService`, `categoriesService`, etc.), mantendo a lógica HTTP isolada dos componentes.

### 2.2 Consistência de Padrões (Prioridade Média)
3. **`useFavorites.ts` (Centralização de Query Keys):**
   - **Problema:** A constante `FAVORITES_QUERY_KEY = 'favorites'` está hardcoded.
   - **Solução:** Mapear e adicionar essa chave ao arquivo central `#/lib/queryKeys` e utilizá-la em `useFavorites.ts`, mantendo a consistência com o restante do projeto.

4. **`SpotCard.tsx` (Limpeza de Código):**
   - **Problema 1:** A prop `layout?: 'grid' | 'list'` está declarada na interface `SpotCardProps` mas nunca é utilizada.
   - **Solução 1:** Remover a prop `layout` da interface e de suas chamadas (onde aplicável sem quebrar).
   - **Problema 2:** Ícones SVG de navegação inline.
   - **Solução 2:** Substituir os SVGs inline por `<ChevronLeftIcon />` e `<ChevronRightIcon />` importados de `#/components/UI/Icons`.

5. **`FeaturedSpotsSection.tsx` (Otimização de Render):**
   - **Problema:** O método `.map(toSpot)` é chamado diretamente no render, causando re-processamento em cada atualização.
   - **Solução:** Envolver a transformação dos dados (`spots.map(toSpot)`) com `useMemo`.

6. **`types/spot.ts` (Campo Morto):**
   - **Problema:** O campo `number: string` está presente na interface, mas nunca é exibido ou utilizado.
   - **Solução:** Remover `number` da interface `Spot` e sua respectiva lógica de transformação em `toSpot()`.

### 2.3 Qualidade de Código (Prioridade Baixa)
7. **`SpotFilterBar.tsx` (Refatoração de Handlers):**
   - **Problema:** Existem 3 funções idênticas para controle dos dropdowns (`handleCategoryToggle`, `handleRegionToggle`, `handleAccessToggle`).
   - **Solução:** Criar uma função fábrica `makeToggleHandler(menuToToggle, ...menusToClose)` que retorna o manipulador de clique adequado, reduzindo a duplicação.

---

## 3. Escopo Negativo (O que NÃO será feito)
- **Não** refatorar `LoginModal.tsx` neste ciclo (fluxo incompleto).
- **Não** migrar `ReviewModal` para `react-hook-form` (baixo risco atual).
- **Não** extrair lógica de scroll da `NavBar` para um hook separado (melhoria de baixo impacto).

---

## 4. Verification Plan
- **Testes de Tipo:** Rodar `npx tsc --noEmit` para garantir zero erros de TypeScript.
- **Teste Manual:**
  - Fazer upload de uma imagem e validar que a página **não** recarrega (reload), mas as imagens atualizam.
  - Editar um spot via `EditSpotModal` garantindo que os dados salvam corretamente via service.
  - Testar os modais da `SpotFilterBar` para garantir que apenas um fica aberto por vez.
  - Verificar a renderização de `FeaturedSpotsSection` e `SpotCard`.
