# Technical Specification: Refatoração de Código — Organização e Qualidade

## 1. Executive Summary
Esta especificação descreve uma refatoração interna do frontend, sem nenhuma alteração de design, layout, textos ou comportamento de UX. O objetivo é elevar a qualidade do código ao padrão de um desenvolvedor front-end sênior, corrigindo bugs de lógica silenciosos, quebrando "God Components", movendo arquivos para seus locais semânticos corretos e otimizando renders desnecessários.

> **REGRA CRÍTICA**: Nenhuma classe Tailwind, texto de UI, layout ou comportamento visual pode ser alterado. Apenas código interno.

---

## 2. Requirements

### 2.1 Extração de Utilitários (Organização de Arquivos)
| Ação | De | Para |
|------|----|------|
| Mover/criar `ClientOnly` | `routes/pontos.$spotId.tsx` (inline) | `src/components/UI/ClientOnly.tsx` |
| Mover `MapSkeleton` | `routes/pontos.$spotId.tsx` (inline) | `src/components/Spots/SpotMiniMap.tsx` (colocado junto ao mapa) |
| Mover `useSpotDetailModals` | `src/components/Spots/useSpotDetailModals.ts` | `src/hooks/useSpotDetailModals.ts` |

### 2.2 Decomposição do God Component (`pontos.$spotId.tsx`)
A rota atual tem 350 linhas. Extrair seções para componentes dedicados em `src/components/Spots/`:

| Componente a criar | Conteúdo |
|--------------------|----------|
| `SpotHeroSection.tsx` | Título, localização e botões (Favoritar, Editar, Excluir) |
| `SpotInfoBar.tsx` | Barra de 5 colunas (localização, nota, categoria, acessibilidade, autor) |
| `SpotCommentsSection.tsx` | Lista de comentários + botão "Avaliar" + mini mapa |

Após a extração, o arquivo `pontos.$spotId.tsx` deve ter no máximo ~80 linhas, atuando apenas como orquestrador de dados e modais.

### 2.3 Correções de Bugs de Lógica
1. **`SpotMiniMap.tsx`**: Remover o estado `mounted` e o `useEffect` interno — são código morto, pois o componente já é protegido pelo `ClientOnly` externo.
2. **`useSpotFilters.ts`**: Remover `selectedRegion` do array de dependências do `useMemo` de `filteredSpots` (dead dependency — região não é usada no `.filter()`).
3. **`useSpotFilters.ts`**: Converter `isFilterActive` de variável calculada no render para `useMemo`, eliminando o cálculo duplicado já existente em `activeFilterNames`.
4. **`pontos.$spotId.tsx`**: Remover o fallback hardcoded `'4.8'` da nota média. Exibir `'–'` quando `spot.rating` for nulo/ausente.
5. **`AuthContext.tsx`**: Remover o listener de `keydown` para `Escape` — o Radix UI `Dialog` já gerencia isso nativamente, resultando em comportamento duplicado.

### 2.4 Otimizações de Render
1. **`renderDescription`** em `pontos.$spotId.tsx`: Converter de função inline (`const renderDescription = () => ...`) para `useMemo`.
2. **Páginas de listagem** (`meus-pontos.tsx`, `meus-favoritos.tsx`, `search.tsx`): Envolver o `spots.map(toSpot)` em `useMemo` para evitar reconversão a cada re-render.

### 2.5 Higienização de Código
1. **`key={idx}`**: Substituir por IDs estáveis onde disponíveis (ex: `key={cat}` nas categorias, `key={review.authorName + idx}` nos comentários).
2. **Avatar inline**: Substituir o SVG inline de avatar nos comentários pelo `UserIcon` já existente em `components/UI/Icons.tsx`.
3. **Caracteres especiais**: Extrair `★`, `☆` para uma constante ou componente `StarRating` colocado em `components/UI/`.

---

## 3. Architecture & Tech Stack
- Sem novas dependências.
- Toda a refatoração utiliza React, TypeScript e os padrões já estabelecidos no projeto (hooks customizados, `useMemo`, componentes funcionais).

---

## 4. State Management
- Nenhuma mudança de estado global.
- Os novos componentes filhos receberão props estritamente tipadas derivadas do estado já existente na rota pai.
- O `useSpotDetailModals` continuará sendo consumido da mesma forma, apenas importado de um novo caminho.

---

## 5. Verification Plan

### Automated Tests
```bash
npx tsc --noEmit
```
Zero erros de TypeScript após a refatoração.

### Manual Verification
- Navegar pela página de detalhes de um ponto turístico e confirmar que o layout, mapa, comentários e modais funcionam identicamente ao estado anterior.
- Confirmar que o login/logout ainda funciona e que fechar modais via Escape ainda funciona (agora gerenciado exclusivamente pelo Radix).
- Confirmar que as páginas `meus-pontos`, `meus-favoritos` e `search` ainda filtram corretamente.
