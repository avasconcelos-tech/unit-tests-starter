# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: clientes.spec.js >> Listar os clientes iniciais
- Location: e2e\clientes.spec.js:9:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Ana Souza' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Ana Souza' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Ana Souza' })

```

```yaml
- main:
  - heading "Lanchonete" [level=1]
  - navigation:
    - button "Produtos" [disabled]
    - button "Clientes"
    - button "Pedidos"
  - heading "Produtos" [level=2]
  - textbox "Nome"
  - spinbutton "Preco"
  - button "Cadastrar"
  - table:
    - rowgroup:
      - row "Nome Preco":
        - columnheader "Nome"
        - columnheader "Preco"
        - columnheader
    - rowgroup:
      - row "Coxinha R$ 5,00 Remover":
        - cell "Coxinha"
        - cell "R$ 5,00"
        - cell "Remover":
          - button "Remover"
      - row "Pastel R$ 8,00 Remover":
        - cell "Pastel"
        - cell "R$ 8,00"
        - cell "Remover":
          - button "Remover"
      - row "Empada R$ 6,00 Remover":
        - cell "Empada"
        - cell "R$ 6,00"
        - cell "Remover":
          - button "Remover"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.beforeEach(async ({ page, request }) => {
  4  |   const resposta = await request.post("http://localhost:3000/__reset");
  5  |   expect(resposta.status()).toBe(204);
  6  |   await page.goto("/");
  7  | });
  8  | // Atividade C1: Listar os clientes iniciais
  9  | test("Listar os clientes iniciais", async ({ page }) => {
> 10 |   await expect(page.getByRole("heading", { name: "Ana Souza" })).toBeVisible();
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  11 |   await expect(page.getByRole("row")).toHaveCount(4);
  12 |   await expect(page.getByRole("cell", { name: "Bruno Lima" })).toBeVisible();
  13 | });
  14 | // Atividade C2: Cadastrar um cliente novo
  15 | test("cadastra um novo cliente", async ({ page }) => {
  16 |   await page.getByLabel("Nome").fill("Carla Dias");
  17 |   await page.getByLabel("Email").fill("carla@email.com");
  18 |   await page.getByRole("button", { name: "Cadastrar" }).click();
  19 | 
  20 |   const Linha = page.getByRole("row", { name: /Carla Dias/ });
  21 |   await expect(Linha).toBeVisible();
  22 |   await expect(Linha).toContainText("carla@email.com");
  23 | });
  24 | // Atividade C3: Validar campos obrigatórios
  25 | test("mostra erro ao cadastrar sem preenchimento", async ({ page }) => {
  26 |   await page.getByRole("button", { name: "Cadastrar" }).click();
  27 |   await expect(page.getByText("Nome e email sao obrigatorios")).toBeVisible();
  28 | });
  29 | 
  30 | // Atividade C4: Impedir email duplicado
  31 | test("mostra erro de novo email ja pertencente a outro cliente", async ({
  32 |   page,
  33 | }) => {
  34 |   await page.getByLabel("Nome").fill("Ana Laura");
  35 |   await page.getByLabel("Email").fill("ana@email.com");
  36 |   await page.getByRole("button", { name: "Cadastrar" }).click();
  37 | 
  38 |   await expect(page.getByText("Email ja cadastrado")).toBeVisible();
  39 | });
  40 | 
  41 | // Atividade C5: Editar um cliente
  42 | test("edita um cliente", async ({ page }) => {
  43 |  const Linha = page.getByRole("row", { name: /Bruno Lima/ });
  44 |   await Linha.getByRole("button", { name: "Editar" }).click();
  45 |   await page.getByLabel("Nome").fill("Bruno Lima Silva");
  46 |   await Linha.getByRole("button", { name: "Salvar" }).click();
  47 |   await expect(Linha).toContainText("Bruno Lima Silva");
  48 |   await Linha.getByRole("button", { name: "Cancelar" }).click();
  49 |   await expect(page.getByText("Bruno Lima")).toBeVisible();
  50 | });
  51 | 
  52 | // Atividade C6: Cancelar edição
  53 | test("cancela a edicao de um cliente", async ({ page }) => {
  54 |   const Linha = page.getByRole("row", { name: /Ana Souza/ });
  55 |   await Linha.getByRole("button", { name: "Editar" }).click();
  56 |   await page.getByLabel("Nome").fill("Ana Souza Silva");
  57 |   await Linha.getByRole("button", { name: "Cancelar" }).click();
  58 |   await expect(page.getByText("Ana Souza")).toBeVisible();
  59 | });
  60 | 
  61 | // Atividade C7: Editar para um email já usado
  62 | test("mostra erro ao editar para um email ja cadastrado", async ({ page }) => {
  63 |   const Linha = page.getByRole("row", { name: /Bruno Lima/ });
  64 |   await Linha.getByRole("button", { name: "Editar" }).click();
  65 |   await page.getByLabel("Email").fill("ana@email.com");
  66 |   await page.getByRole("button", { name: "Salvar" }).click();
  67 |   await expect(page.getByText("Email ja cadastrado")).toBeVisible();
  68 | });
  69 | 
  70 | // Atividade C8: Remover um cliente
  71 | test("remove um cliente", async ({ page }) => {
  72 |   const Linha = page.getByRole("row", { name: /Bruno Lima/ });
  73 |   await Linha.getByRole("button", { name: "Remover" }).click();
  74 |   await expect(Linha).toHaveCount(0);
  75 | });
  76 | 
  77 | // Atividade C9 (desafio): Fluxo completo
  78 | test("fluxo completo de cadastro, edicao e remocao", async ({ page }) => {
  79 |   await page.getByLabel("Nome").fill("Diego");
  80 |   await page.getByRole("button", { name: "Cadastrar" }).click();
  81 |   await expect(page.getByText("Cadastro realizado com sucesso!")).toBeVisible();
  82 | 
  83 |   const Linha = page.getByRole("row", { name: /Diego/ });
  84 |   await Linha.getByRole("button", { name: "Editar" }).click();
  85 |   await page.getByLabel("Nome").fill("Diego Matos");
  86 |   
  87 |   await page.getByLabel("Email").fill("carla@email.com");
  88 |   await page.getByRole("button", { name: "Cadastrar" }).click();
  89 |   await expect(page.getByText("Email ja cadastrado")).toBeVisible();
  90 |   
  91 |   await page.getByRole("row", { name: /Diego Matos/ });
  92 |   await Linha.getByRole("button", { name: "Remover" }).click();
  93 |   await expect(Linha).toHaveCount(0);
  94 | });
```