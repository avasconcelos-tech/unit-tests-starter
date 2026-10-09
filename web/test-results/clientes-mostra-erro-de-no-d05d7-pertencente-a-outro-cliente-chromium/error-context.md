# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: clientes.spec.js >> mostra erro de novo email ja pertencente a outro cliente
- Location: e2e\clientes.spec.js:31:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel('Email')

```

# Page snapshot

```yaml
- main [ref=e3]:
  - heading "Lanchonete" [level=1] [ref=e4]
  - navigation [ref=e5]:
    - button "Produtos" [disabled] [ref=e6]
    - button "Clientes" [ref=e7]
    - button "Pedidos" [ref=e8]
  - generic [ref=e9]:
    - heading "Produtos" [level=2] [ref=e10]
    - generic [ref=e11]:
      - textbox "Nome" [active] [ref=e12]: Ana Laura
      - spinbutton "Preco" [ref=e13]
      - button "Cadastrar" [ref=e14]
    - table [ref=e15]:
      - rowgroup [ref=e16]:
        - row [ref=e17]:
          - columnheader "Nome" [ref=e18]
          - columnheader "Preco" [ref=e19]
          - columnheader [ref=e20]
      - rowgroup [ref=e21]:
        - row [ref=e22]:
          - cell "Coxinha" [ref=e23]
          - cell "R$ 5,00" [ref=e24]
          - cell [ref=e25]:
            - button "Remover" [ref=e26]
        - row [ref=e27]:
          - cell "Pastel" [ref=e28]
          - cell "R$ 8,00" [ref=e29]
          - cell [ref=e30]:
            - button "Remover" [ref=e31]
        - row [ref=e32]:
          - cell "Empada" [ref=e33]
          - cell "R$ 6,00" [ref=e34]
          - cell [ref=e35]:
            - button "Remover" [ref=e36]
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
  10 |   await expect(page.getByRole("heading", { name: "Ana Souza" })).toBeVisible();
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
> 35 |   await page.getByLabel("Email").fill("ana@email.com");
     |                                  ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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