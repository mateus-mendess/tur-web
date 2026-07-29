# 📄 Especificação de Design e Estrutura — Landing Page de Turismo

## 1. Identidade Visual e Paleta de Cores

A paleta foi definida para transmitir energia, autenticidade e um toque moderno/retrô, combinando tons terrosos quentes com neutros de alto contraste.

* **Cor Primária (`#DF4927` - Terracota / Laranja Vibrante):** Utilizada em botões de ação (CTAs), destaques de links, estados ativos e elementos interativos.
* **Cor de Fundo (`#F3F1EB` - Off-White Calmo):** Proporciona um visual mais aconchegante e elegante do que o branco puro, reduzindo o cansaço visual.
* **Cores Secundárias e Contraste:**
  * **Preto Profundo (`#111111`):** Usado para tipografia, ícones e linhas de borda.
  * **Branco Puro (`#FFFFFF`):** Reservado para backgrounds de cards, modais e fundos de botões invertidos.

---

## 2. Tipografia e Fontes do Sistema

Para garantir uma interface moderna, elegante e de excelente legibilidade tanto em telas desktop quanto mobile, a escolha das fontes do projeto segue os padrões visuais e de UI/UX utilizados por referências globais de design web (como o *Awwwards*).

### **2.1. Fontes Principais de Interface (UI)**

* **DM Sans** *(Colophon Foundry / Google Fonts)*  
  * **Aplicação:** Títulos principais ($H1, H2, H3$), elementos de destaque e logomarca/branding.  
  * **Estilo:** Sans-Serif Geometric / Humanista Grotesca.  
  * **Função:** Fornecer personalidade visual marcante, clareza e apelo estético moderno para os cabeçalhos.

* **Inter** *(Rasmus Andersson)*  
  * **Aplicação:** Textos de corpo (*body*), botões, menus de navegação, formulários, métricas e cartões de conteúdo.  
  * **Estilo:** Sans-Serif Neogrotesca.  
  * **Função:** Garantir alta legibilidade e clareza visual em diferentes densidades de tela e tamanhos de fonte reduzidos.

### **2.2. Pilha de Suporte / Fallback (CSS)**

```css
font-family: 'Inter', 'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;