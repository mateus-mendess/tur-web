# Technical Specification: Correção do Bug de SSR no Mapa (Leaflet)

## 1. Executive Summary
Esta especificação aborda um erro de "ReferenceError: window is not defined" que ocorre devido ao comportamento de renderização SSR do TanStack Start e do comportamento da biblioteca Leaflet (que tenta acessar a propriedade `window` em tempo de importação). O objetivo é isolar a importação e renderização do `SpotMiniMap` para que ocorra estritamente do lado do cliente, sem comprometer o SSR global da rota de detalhes do ponto turístico.

## 2. Requirements
- **Manutenção do SSR Global**: A rota `pontos.$spotId.tsx` deve continuar sendo processada e renderizada via SSR em todas as seções (cabeçalho, descrição, comentários).
- **Isolamento Client-Side (Client-Only)**: Apenas o componente responsável por renderizar o Leaflet (`SpotMiniMap.tsx`) deve ser executado no navegador.
- **Carregamento Assíncrono (Lazy Loading)**: O import do `SpotMiniMap.tsx` na rota principal deve utilizar `React.lazy()` para impedir que a instrução de importação do Leaflet seja resolvida no servidor Node.js.
- **Prevenção de Quebras no Fallback**: Durante o carregamento/hidratação inicial, o mapa deve ser ocultado por meio de um `ClientOnly` wrapper que aguarda o mount do React e, através de um bloco `Suspense`, substitui a lacuna na UI por um *Skeleton* de mapa sutil (ex: div com um spinner suave) antes do mapa real ser carregado.
- **Fallback de Coordenadas Ausentes**: A mensagem atual "Localização exata não disponível no momento." deve ser usada *exclusivamente* quando a latitude ou longitude não existirem, não durante as transições de carregamento.

## 3. Architecture & Tech Stack
- **Componentização Estratégica**:
  - `SpotMiniMap.tsx`: Já existe e deve ser exportado com `export default` (requisito do `React.lazy()` sem gambiarras extras).
  - `ClientOnly`: Criação de um utilitário wrapper na rota que controla o ciclo de vida via `useEffect` limitando a renderização apenas ao navegador.
- **Tratamento de Assincronicidade**: Utilização das APIs padrão do React:
  - `React.lazy` (Importação Dinâmica Client-Side).
  - `React.Suspense` (Gerenciador do estado pendente do módulo).

## 4. State Management
- **Lifecycle Control**: Utilizar a variável de estado `mounted` no `ClientOnly` hook, configurando para `true` estritamente na chamada do `useEffect()`. A renderização de `children` só avança caso `mounted === true`. Caso contrário, renderiza-se o componente de *fallback* (Skeleton). O componente original de mapa já cuida sozinho do ciclo de vida Leaflet sem alterações severas.
