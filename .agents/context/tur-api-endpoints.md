# Tur. API — Referência de Endpoints para Integração Front-end

> **Instrução para o agente:** este documento é o contrato oficial da API (extraído do OpenAPI 3.1 gerado pelo backend Spring Boot). Use-o para implementar/atualizar as camadas `services/`, `hooks/api/` e `schemas/` (Zod) do front-end `tur-web`, de forma que:
> - As validações do Zod no front espelhem as validações descritas aqui (mesmos limites, mesmos regex quando fizer sentido no client).
> - Cada `service` trate explicitamente os códigos de erro documentados por endpoint (não apenas o caminho de sucesso).
> - Endpoints marcados como "Requer autenticação" enviem o header `Authorization: Bearer <token>` via interceptor do Axios já existente.
> - A seção **"Inconsistências encontradas no contrato"** no final seja validada manualmente contra o comportamento real da API antes de confiar 100% no spec.

**Base URL (dev):** `http://localhost:8081`
**Autenticação:** Bearer JWT (`Authorization: Bearer <token>`), obtido via `POST /auth/login`.

---

## Índice
1. [Auth](#1-auth)
2. [Users](#2-users)
3. [Tourist Points](#3-tourist-points)
4. [Categories](#4-categories)
5. [Accessibility](#5-accessibility)
6. [Addresses](#6-addresses)
7. [Photos](#7-photos)
8. [Comments](#8-comments)
9. [States](#9-states)
10. [Inconsistências encontradas no contrato](#10-inconsistências-encontradas-no-contrato)

---

## 1. Auth

### `POST /auth/login`
Autentica um usuário e retorna um JWT.

**Autenticação:** não requer.

**Request body** (`AuthenticationRequest`):
| Campo | Tipo | Validação |
|---|---|---|
| `email` | string | formato email, obrigatório |
| `password` | string | obrigatório (sem regex documentado aqui — a validação forte de senha é aplicada no cadastro, não no login) |

**Resposta de sucesso — `200`** (`AuthenticationResponse`):
```json
{ "token": "string (JWT)" }
```

**Erros:**
| Status | Situação |
|---|---|
| `401` | Email ou senha inválidos |

**Notas de integração:** o token deve ser salvo via a abstração `storage` já existente no front (não `localStorage` direto) e injetado no interceptor do Axios para requisições subsequentes.

---

## 2. Users

### `POST /users`
Cria uma nova conta de usuário.

**Autenticação:** não requer.

**Request body** (`UserRequest`):
| Campo | Tipo | Validação |
|---|---|---|
| `name` | string | regex `^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,100}$` — só letras (com acentos) e espaços, 2 a 100 caracteres |
| `email` | string | formato email, obrigatório |
| `password` | string | regex `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$` — mínimo 8 caracteres, exige minúscula, maiúscula, número e caractere especial |
| `confirmPassword` | string | obrigatório |

**Resposta de sucesso — `201`:** objeto genérico (`object`), o schema não detalha o shape retornado — validar na prática o que a API devolve.

**Erros:**
| Status | Situação |
|---|---|
| `400` | Dados inválidos ou email já em uso. Shape retornado é um ProblemDetail com propriedades soltas: `{ "field": "email", "detail": "Email já cadastrado" }` e não um array de erros. |

**Notas de integração:** o front deve replicar os dois regex (`name` e `password`) no `authSchema.ts` (Zod) para dar feedback imediato ao usuário antes de bater na API. O backend **não deixa explícito no schema** que valida `password === confirmPassword` — trate isso como validação client-side obrigatória via Zod `.refine()`, e trate um possível `400` de "senhas não conferem" no catch do service mesmo assim.

---

## 3. Tourist Points

### `GET /tourist-points`
Lista todos os pontos turísticos ativos.

**Autenticação:** não requer.

**Resposta de sucesso — `200`:** array de `TouristPointResponse` (ver shape completo abaixo, em [Users → Categories → shapes compartilhados](#shape-touristpointresponse)).

**Erros:** nenhum documentado além do padrão (endpoint público, sem parâmetros).

---

### `POST /tourist-points`
Cria um novo ponto turístico. Coordenadas são obtidas automaticamente via geocoding a partir do endereço.

**Autenticação:** **requer** (Bearer).

**Request body** (`TouristPointRequest`):
| Campo | Tipo | Validação |
|---|---|---|
| `name` | string | 5 a 100 caracteres, obrigatório |
| `description` | string | mínimo 1 caractere, obrigatório |
| `categoriesIds` | array de UUID (string) | **mínimo 1 item**, itens únicos, obrigatório |
| `accessibilityTypesIds` | array de int64 | itens únicos, obrigatório no schema (mas sem `minItems` — provavelmente aceita array vazio) |
| `addressRequest` | objeto `AddressRequest` | ver campos abaixo — **⚠️ não está marcado como obrigatório no schema, apesar de a descrição do endpoint dizer que o endereço é usado para geocoding.** Trate como obrigatório no front mesmo assim (ver seção 10) |

**`AddressRequest` (aninhado):**
| Campo | Tipo | Validação |
|---|---|---|
| `street` | string | mínimo 1 caractere, obrigatório |
| `complement` | string | opcional |
| `neighborhood` | string | mínimo 1 caractere, obrigatório |
| `city` | string | mínimo 1 caractere, obrigatório |
| `zipcode` | string | regex `^\d{5}-?\d{3}$` (CEP com ou sem hífen), obrigatório |
| `stateId` | integer (int64) | obrigatório — ID vindo de `GET /states` |

**Resposta de sucesso — `201`:** `TouristPointResponse` completo. Header `Location` aponta para o novo recurso.

**Erros:**
| Status | Situação |
|---|---|
| `400` | Dados inválidos |
| `401` | Usuário não autenticado |
| `404` | Estado (`stateId`) não encontrado |
| `503` | Falha ao obter coordenadas do serviço de geocoding |

**Notas de integração:** o `503` é um caso real de UX a tratar — se o CEP/endereço não for geocodificável, o front deve mostrar uma mensagem clara ("não conseguimos localizar esse endereço, verifique e tente novamente") em vez de um erro genérico. Isso substitui o mock atual do `spotsService.ts`; ao integrar de verdade, `categoriesIds` precisa vir de `GET /categories` (são UUIDs reais, não strings livres) — isso muda a lógica atual de "criar categoria nova na hora" no formulário: a criação de categoria vira uma chamada separada (`POST /categories`) antes de poder referenciá-la aqui.

---

### `GET /tourist-points/{id}`
Detalhe completo de um ponto turístico (endereço, categorias, fotos, comentários).

**Autenticação:** não requer.

**Path params:** `id` (UUID).

**Resposta de sucesso — `200`:** `TouristPointResponse`.

**Erros:**
| Status | Situação |
|---|---|
| `404` | Ponto turístico não encontrado |

---

### `PATCH /tourist-points/{id}`
Atualiza parcialmente nome e/ou descrição.

**Autenticação:** **requer** (Bearer). Apenas o dono pode atualizar.

**Path params:** `id` (UUID).

**Request body** (`TouristPointUpdateRequest`):
| Campo | Tipo | Validação |
|---|---|---|
| `name` | string | opcional, sem validação de tamanho documentada |
| `description` | string | opcional, sem validação de tamanho documentada |

**Resposta de sucesso — `200`:** sem shape de retorno documentado explicitamente (verificar na prática).

**Erros:**
| Status | Situação |
|---|---|
| `400` | Dados inválidos |
| `401` | Usuário não autenticado |
| `403` | Usuário não é o dono do ponto |
| `404` | Ponto turístico não encontrado |

**Notas de integração:** este endpoint **não** atualiza endereço, categorias, acessibilidade nem fotos — cada um desses tem endpoint próprio (`PUT /addresses/tourist-point/{id}`, `PATCH /accessibility-types/tourist-point/{id}`, `POST/DELETE /photos/...`). Um formulário de "editar ponto completo" no front precisa orquestrar múltiplas chamadas, não uma só.

---

### `DELETE /tourist-points/{id}`
Remove permanentemente um ponto turístico e todos os dados associados.

**Autenticação:** **requer** (Bearer). Apenas o dono pode remover.

**Path params:** `id` (UUID).

**Resposta de sucesso — `204`:** sem corpo.

**Erros:**
| Status | Situação |
|---|---|
| `401` | Usuário não autenticado |
| `403` | Usuário não é o dono do ponto |
| `404` | Ponto turístico não encontrado |

---

<a id="shape-touristpointresponse"></a>
**`TouristPointResponse` (shape completo, usado em GET list, GET by id e POST):**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "accessibilityTypes": [{ "id": 1, "name": "string" }],
  "address": {
    "street": "string",
    "complement": "string",
    "neighborhood": "string",
    "city": "string",
    "state": "string",
    "zipcode": "string"
  },
  "photos": [{ "id": "uuid", "path": "string" }],
  "categories": [{ "id": "uuid", "name": "string" }]
}
```
Note que `address.state` retorna o **nome do estado** (string), diferente do `stateId` (int64) usado no request — não confundir os dois ao popular um formulário de edição de endereço.

---

## 4. Categories

### `GET /categories`
Lista todas as categorias ativas. Usado para popular o seletor de categorias nos formulários.

**Autenticação:** não requer.

**Resposta de sucesso — `200`:** array de `CategoryResponse`:
```json
[{ "id": "uuid", "name": "string" }]
```

---

### `POST /categories`
Cria uma nova categoria.

**Autenticação:** **requer** (Bearer).

**Request body** (`CategoryRequest`):
| Campo | Tipo | Validação |
|---|---|---|
| `name` | string | regex `[A-Za-zÀ-ÖØ-öø-ÿ ]{2,100}$` (⚠️ sem `^` no início — ver seção 10), máximo 30 caracteres, obrigatório |

**Resposta de sucesso — `201`:** sem shape de retorno documentado.

**Erros:**
| Status | Situação |
|---|---|
| `400` | Dados inválidos ou categoria já existe |
| `404` | Usuário autenticado não encontrado |

**Notas de integração:** o comportamento de "adicionar categoria nova direto no formulário de cadastro de ponto" (existente no `Step2Categories.tsx`) precisa mudar: em vez de só adicionar num array local, deve chamar `POST /categories`, aguardar o `id` retornado, e só então incluir esse UUID em `categoriesIds` do `POST /tourist-points`.

---

## 5. Accessibility

### `GET /accessibility-types`
Lista todos os tipos de acessibilidade disponíveis.

**Autenticação:** não requer.

**Resposta de sucesso — `200`:** array de `AccessibilityTypesResponse`:
```json
[{ "id": 1, "name": "string" }]
```

---

### `PATCH /accessibility-types/tourist-point/{id}`
Substitui (não mescla) os tipos de acessibilidade de um ponto turístico.

**Autenticação:** **requer** (Bearer). Apenas o dono pode atualizar.

**Path params:** `id` (UUID do ponto turístico).

**Request body** (`AccessibilityUpdateRequest`):
| Campo | Tipo | Validação |
|---|---|---|
| `accessibilityTypesIds` | array de int64 | itens únicos, obrigatório |

**Resposta de sucesso — `200`:** sem shape documentado.

**Erros:**
| Status | Situação |
|---|---|
| `401` | Usuário não autenticado |
| `403` | Usuário não é o dono do ponto |
| `404` | Ponto turístico ou tipo de acessibilidade não encontrado |

**Notas de integração:** "substitui" é literal — enviar a lista completa desejada, não um diff. Se o usuário desmarcar uma opção na UI, o array enviado deve refletir o estado final, não a remoção isolada.

---

## 6. Addresses

### `PUT /addresses/tourist-point/{id}`
Atualiza o endereço de um ponto turístico existente. Revalida coordenadas via geocoding.

**Autenticação:** **requer** (Bearer). (Não documenta explicitamente "apenas o dono", mas é razoável assumir a mesma regra dos demais endpoints de edição — validar na prática.)

**Path params:** `id` (UUID do ponto turístico).

**Request body:** mesmo shape de `AddressRequest` descrito na seção 3 (todos os campos, incluindo `stateId`).

**Resposta de sucesso — `200`:** sem corpo detalhado ("Address updated successfully").

**Erros:**
| Status | Situação |
|---|---|
| `404` | Ponto turístico não encontrado ou Estado não encontrado |
| `503` | Falha ao obter coordenadas do serviço de geocoding |

---

## 7. Photos

### `POST /photos/tourist-points/{id}`
Upload de foto para um ponto turístico.

**Autenticação:** **requer** (Bearer). Apenas o dono pode enviar.

**Path params:** `id` (UUID do ponto turístico).

**Request body:** `multipart/form-data` com campo `file` (binário).
| Regra | Valor |
|---|---|
| Formatos aceitos | JPEG, PNG, WebP |
| Tamanho máximo | 2 MB |
| Limite por ponto | 4 fotos |

**⚠️ O OpenAPI declara `content-type: application/json` para este endpoint, o que está incorreto para upload de arquivo — na implementação real, enviar como `multipart/form-data` via `FormData` no Axios (comportamento típico de `MultipartFile` do Spring que o springdoc documenta errado). Confirmar no teste manual antes de codificar o client.**

**Resposta de sucesso — `201`:** sem shape documentado (mas o padrão de outras respostas sugere retornar `PhotoResponse`: `{ "id": "uuid", "path": "string" }` — validar na prática).

**Erros:**
| Status | Situação |
|---|---|
| `400` | Tipo de arquivo inválido, tamanho excedido ou limite de fotos atingido |
| `401` | Usuário não autenticado |
| `403` | Usuário não é o dono do ponto |
| `404` | Ponto turístico não encontrado |
| `500` | Falha ao enviar arquivo para o storage |

---

### `DELETE /photos/{id}`
Remove uma foto.

**Autenticação:** **requer** (Bearer). Apenas o dono pode remover.

**Path params:** `id` (UUID da foto, não do ponto turístico).

**Resposta de sucesso — `201`** *(sim, `201` — não `204` como seria esperado para um DELETE; ver seção 10)*.

**Erros:**
| Status | Situação |
|---|---|
| `401` | Usuário não autenticado |
| `403` | Usuário não é o dono da foto |
| `404` | Ponto turístico ou foto não encontrados |
| `500` | Falha ao deletar arquivo do storage |

---

## 8. Comments

### `GET /tourist-points/{touristPointId}/comments`
Lista todos os comentários de um ponto turístico.

**Autenticação:** não requer.

**Path params:** `touristPointId` (UUID).

**Resposta de sucesso — `200`:** array de `CommentResponse`:
```json
[{ "content": "string", "note": 5, "authorName": "string" }]
```

---

### `POST /tourist-points/{touristPointId}/comments`
Submete um comentário com nota (1-5).

**Autenticação:** ⚠️ **a descrição do endpoint diz "não requer autenticação", mas o schema define `security: [{ bearerAuth: [] }]` — ver seção 10. Trate como se exigisse Bearer até confirmar o comportamento real.**

**Path params:** `touristPointId` (UUID).

**Request body** (`CommentRequest`):
| Campo | Tipo | Validação |
|---|---|---|
| `content` | string | mínimo 1 caractere, obrigatório |
| `note` | integer | 1 a 5, obrigatório |
| `authorName` | string | regex `^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,100}$`, obrigatório |

**Resposta de sucesso — `201`:** sem corpo detalhado.

**Erros:**
| Status | Situação |
|---|---|
| `400` | Dados inválidos |
| `404` | Ponto turístico não encontrado |

---

## 9. States

### `GET /states`
Lista os 27 estados brasileiros. Usado para popular o seletor de estado nos formulários.

**Autenticação:** não requer.

**Resposta de sucesso — `200`:** array de `StateResponse`:
```json
[{ "id": 1, "name": "string", "abbreviation": "string" }]
```

**Notas de integração:** isso substitui a constante local `BRAZILIAN_STATES` usada hoje no `Step3Address.tsx` — ao integrar, o dropdown de estado deve ser populado via `useQuery` neste endpoint (com `staleTime` alto, já que estados não mudam) em vez da lista hardcoded, e o valor enviado no form passa a ser o `stateId` (número), não a sigla (string).

---

## 10. Inconsistências encontradas no contrato

Pontos que valem confirmar manualmente contra o comportamento real da API (via Postman/Insomnia ou testes) antes de codificar o client em cima deles:

1. **`POST /tourist-points` não marca `addressRequest` como obrigatório no schema**, apesar de a descrição do endpoint depender do endereço para geocoding. Trate como obrigatório no front de qualquer forma.
2. **`POST /tourist-points/{id}/comments`**: descrição textual diz "sem autenticação necessária", mas o schema exige `bearerAuth`. Testar sem token primeiro; se retornar `401`, a documentação textual está desatualizada.
3. **Regex de `CategoryRequest.name`** (`[A-Za-zÀ-ÖØ-öø-ÿ ]{2,100}$`) está sem `^` no início, diferente dos regex equivalentes em `UserRequest.name` e `CommentRequest.authorName` (que têm `^...$`). Sem a âncora inicial, a validação de backend pode aceitar valores com caracteres inválidos no começo da string. Não é algo que o front precisa replicar (replique a versão *anchored*, mais restritiva, no Zod), mas pode gerar um `400` inesperado se o back rejeitar algo que o front validou como OK, ou vice-versa.
4. **`POST /photos/tourist-points/{id}`** declara `content-type: application/json` para um campo binário — comportamento típico de spec mal gerada para upload de arquivo no springdoc. Implementar como `multipart/form-data` e validar na prática.
5. **`DELETE /photos/{id}` retorna `201`** em vez do `204` esperado para uma remoção. Tratar esse código como sucesso no service, não como erro.

---

## Resumo rápido — quais endpoints exigem autenticação

| Requer Bearer | Não requer |
|---|---|
| `POST /tourist-points` | `GET /tourist-points`, `GET /tourist-points/{id}` |
| `PATCH /tourist-points/{id}` | `GET /categories` |
| `DELETE /tourist-points/{id}` | `GET /accessibility-types` |
| `POST /categories` | `GET /states` |
| `PATCH /accessibility-types/tourist-point/{id}` | `GET /tourist-points/{id}/comments` |
| `PUT /addresses/tourist-point/{id}` | `POST /users` |
| `POST /photos/tourist-points/{id}` | `POST /auth/login` |
| `DELETE /photos/{id}` | `POST /tourist-points/{id}/comments` (⚠️ ver item 2 acima) |
