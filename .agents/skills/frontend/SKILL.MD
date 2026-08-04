# 🎯 Skill & Guidelines de Arquitetura Front-End — Projeto "Tur."

Esta diretriz define as boas práticas de arquitetura, organização de código, design patterns e estratégia de integração para o desenvolvimento do Front-End da plataforma **tur.**.

O objetivo principal é garantir um código modular, escalável, legível e preparado para integrar perfeitamente com a API REST do Back-End.

### 🎨 Estratégia de Estilização (CSS)

- **Padrão do projeto: Tailwind CSS.** Todo componente novo deve ser estilizado
  primariamente com classes utilitárias do Tailwind.
- **CSS Modules (`*.module.css`) só é permitido em casos excepcionais**, quando
  o layout exige controle muito fino que o Tailwind não cobre bem (ex:
  posicionamento complexo de vídeo de fundo, split de texto customizado).
  Nesses casos, documentar o motivo em comentário no topo do arquivo `.module.css`.
- **Design tokens do Tailwind:** as variáveis de cor/fonte (`--color-primary`,
  `--color-bg`, `--color-text`, `--color-white`, fontes DM Sans/Inter) devem ser
  registradas no `tailwind.config` (ou `@theme` no CSS, se Tailwind 4) como tokens
  reutilizáveis — não hardcoded em `style={{ }}` inline.
- **Animações:** usar utilitários do Tailwind para transições simples
  (`transition`, `duration-*`, `hover:*`). Para animações de entrada/saída de
  componentes (modais, menus) ou animações mais elaboradas, usar **Framer Motion**.
- **Proibido:** `style={{ }}` inline para estilos reutilizáveis (resets de botão,
  cores, espaçamento) — sempre extrair para classe Tailwind ou token.

---

## 🏛️ 1. Arquitetura de Pastas (Feature-Driven / Modular Structure)

Organize a aplicação de forma que a lógica de negócios e os componentes sejam desacoplados e de fácil manutenção:

```text
src/
├── assets/          # Imagens, ícones (SVG), fontes e arquivos estáticos
├── components/      # Componentes UI reutilizáveis e globais (Atoms/Molecules)
│   ├── ui/          # Botões, Inputs, Cards, Modais, Badges
│   └── layout/      # Header, Footer, Container, Grid System
├── features/        # Módulos organizados por funcionalidade (Domain-driven)
│   ├── auth/        # Login, Cadastro, Gestão de Token
│   ├── spots/       # Pontos turísticos, Destaques, Filtros
│   ├── community/   # Cards de métricas/tickets, Colaboradores
│   └── map/         # Integração com Mapa 3D / Regiões
├── hooks/           # Custom Hooks reutilizáveis
├── services/        # Camada de comunicação com API (Axios / Fetch)
├── types/           # Interfaces e DTOs (TypeScript)
├── utils/           # Funções utilitárias e formatadores
└── pages/           # Camada de Roteamento (Views principais)
```

---

## 🔌 2. Camada de Integração de API (Back-End Ready)

Como o Front-End e o Back-End serão completamente desacoplados via API REST:

1. **Service Layer Centralizada:**
   - NUNCA faça requisições HTTP (`fetch` ou `axios`) diretamente dentro dos componentes visuais.
   - Crie uma instância centralizada (`api.js` / `api.ts`) com interceptores para gerenciar tokens de autenticação (JWT) e tratamento global de erros.
   - Defina funções de serviço dedicadas para cada domínio (ex: `spotsService.getFeatured()`, `authService.login()`).

2. **Gerenciamento de Estado de Requisições:**
   - Trate rigorosamente os 4 estados visuais de qualquer chamada assíncrona: **Idle (Inicial), Loading (Carregando/Skeleton), Success (Sucesso) e Error (Tratamento de Falhas)**.
   - Utilize bibliotecas de gerenciamento de dados assíncronos (como _React Query / TanStack Query_) para lidar com cache, revalidação e sincronização de dados.

3. **Mapeamento de Contratos de Dados (DTOs):**
   - Isolar os modelos da API da renderização utilizando interfaces ou adaptadores (adapters), garantindo que alterações de nomes de atributos no JSON da API não quebrem múltiplos componentes da interface.

---

## 🧩 3. Padrões de Reutilização de Componentes (Clean Code & UI Patterns)

1. **Princípio da Responsabilidade Única (SRP):**
   - Separar componentes de **Apresentação (Presentational / Dumb Components)** dos componentes de **Lógica (Container / Smart Components)**.
   - Componentes de UI (ex: `Button`, `Card`, `Badge`) devem ser puros, recebendo dados e callbacks apenas via `props`.

2. **Design Tokens & Variáveis CSS:**
   - Consumir as variáveis globais de design configuradas no projeto (`--color-primary: #DF4927`, `--color-bg: #F3F1EB`, `--color-text: #111111`, `--color-white: #FFFFFF`).
   - **Tipografia:** Aplicar `font-family` dinamicamente conforme a hierarquia (DM Sans para headings e Inter para body).

3. **Composição ao invés de Prop Drilling:**
   - Priorizar padrões de composição de componentes (ex: `Card.Header`, `Card.Image`, `Card.Footer`) para dar flexibilidade ao uso sem poluir a lista de propriedades (`props`).

---

## 🚀 4. Qualidade de Código & Boas Práticas (Sênior Level)

- **Design Responsivo & Mobile First:** O layout e o grid devem se adaptar fluidamente de telas mobile a ultra-wide.
- **Acessibilidade (a11y):** Utilizar tags HTML5 semânticas (`<header>`, `<main>`, `<section>`, `<footer>`), propriedades `aria-*` quando necessário e garantir boa navegabilidade por teclado.
- **Clean Code:** Nomes claros e explicativos para funções e variáveis em inglês ou português coerente; evite abbreviações obscuras.
- **Performance:** Utilizar _Lazy Loading_ em imagens pesadas, memoização (`useMemo`, `useCallback`) apenas quando estritamente necessário e code splitting por rota.
