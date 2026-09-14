# Technical Specification: Padronização Visual dos Modais de Edição

## Executive Summary
O objetivo desta refatoração é extrair o layout base do modal de Cadastro (duas colunas, selo "tur.", botão X externo) e aplicá-lo uniformemente nos modais de edição: "Editar Informações", "Editar Localização" e "Editar Imagens". O intuito é garantir total coerência visual em todos os formulários e evitar duplicação de CSS.

## Solução Arquitetural: `SplitModalLayout`

Vamos criar um novo componente reutilizável `SplitModalLayout.tsx` (dentro de `src/components/UI/`) que encapsulará a marcação HTML de 2 colunas e o CSS do "Wizard". 

### Assinatura do `SplitModalLayout`
```tsx
interface SplitModalLayoutProps {
  leftNumberOrIcon?: React.ReactNode;
  title: string;
  description: string;
  subDescription?: string;
  children: React.ReactNode; // Conteúdo do form (coluna direita)
  footer: React.ReactNode;   // Botões (Cancelar/Salvar, etc)
}
```

### O que o componente encapsulará:
- O contêiner pai `w-full bg-white rounded-none ... grid grid-cols-[1fr_1.15fr]`
- Coluna da esquerda com a estilização padronizada de título (`font-dm-sans text-[26px]`), descrição e o número/ícone gigante (`text-[72px]`).
- Coluna da direita com o posicionamento absoluto do selo (`selo-img.png`).
- O rodapé com flexbox para alinhar os botões.
- Como ele renderizará dentro de `BaseModal`, ele herdará o botão (X) de fechamento automático fora do card e o `maxWidthClass`.

## Modificações por Arquivo

### 1. Extracão do `CreateSpotForm`
- Atualizar o `CreateSpotForm.tsx` para passar a renderizar seu formulário utilizando o `SplitModalLayout`, repassando dinamicamente os títulos (`step === 1`, etc.) para o componente. 

### 2. `EditSpotModal.tsx` (Editar Informações)
- Passará a usar o `SplitModalLayout`.
- **leftNumberOrIcon**: Um ícone de documento ou lápis (grande) em vez de números.
- **title**: "Editar Informações".
- **description**: "Atualize o nome e uma breve descrição detalhando as principais atrações do local."
- **footer**: Botões de `Cancelar` (variante secundária/outline) e `Salvar` (variante default/preto).

### 3. `EditAddressModal.tsx` (Editar Localização)
- Passará a usar o `SplitModalLayout`.
- **leftNumberOrIcon**: Ícone de mapa (MapPinIcon grande).
- **title**: "Editar Localização".
- **description**: "Atualize o endereço completo para que os visitantes encontrem o ponto turístico."
- **footer**: Botões `Cancelar` e `Salvar`.

### 4. `UploadPhotosModal.tsx` (Editar Imagens)
- Passará a usar o `SplitModalLayout`.
- **leftNumberOrIcon**: Ícone de Galeria (ImageIcon grande).
- **title**: "Editar Imagens".
- **description**: "Adicione ou remova fotos do ponto turístico para manter a galeria atualizada."
- **footer**: Botões `Cancelar` e `Salvar/Concluir`.

A base visual será estritamente idêntica à do cadastro, cumprindo integralmente as exigências visuais reportadas.

---
Do you approve of this tech stack and specification?
