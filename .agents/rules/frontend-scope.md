---
trigger: always_on
---

# Regras para o desenvolvimento do front-end

- Este é um projeto front-end. Nunca gerar, sugerir ou modificar código de 
  backend (API, banco, autenticação hospedada) — isso é mantido manualmente, 
  em repositório separado (Spring Boot).
- Nenhum dado real ou fixo dentro de componentes. Dados chegam via 
  props/hooks; onde a API real ainda não está conectada, usar dado de 
  exemplo passado de fora do componente, nunca hardcoded no JSX.
- Componentes visuais reutilizáveis entre telas semelhantes — extrair peça 
  reaproveitável (ex: header, card, container de mídia) em vez de duplicar 
  markup.
- Seguir a arquitetura feature-based já estabelecida (ver AGENTS.md).