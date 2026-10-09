import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, request }) => {
  const resposta = await request.post("http://localhost:3000/__reset");
  expect(resposta.status()).toBe(204);
  await page.goto("/");
});
// Atividade C1: Listar os clientes iniciais
test("Listar os clientes iniciais", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Ana Souza" })).toBeVisible();
  await expect(page.getByRole("row")).toHaveCount(4);
  await expect(page.getByRole("cell", { name: "Bruno Lima" })).toBeVisible();
});
// Atividade C2: Cadastrar um cliente novo
test("cadastra um novo cliente", async ({ page }) => {
  await page.getByLabel("Nome").fill("Carla Dias");
  await page.getByLabel("Email").fill("carla@email.com");
  await page.getByRole("button", { name: "Cadastrar" }).click();

  const Linha = page.getByRole("row", { name: /Carla Dias/ });
  await expect(Linha).toBeVisible();
  await expect(Linha).toContainText("carla@email.com");
});
// Atividade C3: Validar campos obrigatórios
test("mostra erro ao cadastrar sem preenchimento", async ({ page }) => {
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await expect(page.getByText("Nome e email sao obrigatorios")).toBeVisible();
});

// Atividade C4: Impedir email duplicado
test("mostra erro de novo email ja pertencente a outro cliente", async ({
  page,
}) => {
  await page.getByLabel("Nome").fill("Ana Laura");
  await page.getByLabel("Email").fill("ana@email.com");
  await page.getByRole("button", { name: "Cadastrar" }).click();

  await expect(page.getByText("Email ja cadastrado")).toBeVisible();
});

// Atividade C5: Editar um cliente
test("edita um cliente", async ({ page }) => {
 const Linha = page.getByRole("row", { name: /Bruno Lima/ });
  await Linha.getByRole("button", { name: "Editar" }).click();
  await page.getByLabel("Nome").fill("Bruno Lima Silva");
  await Linha.getByRole("button", { name: "Salvar" }).click();
  await expect(Linha).toContainText("Bruno Lima Silva");
  await Linha.getByRole("button", { name: "Cancelar" }).click();
  await expect(page.getByText("Bruno Lima")).toBeVisible();
});

// Atividade C6: Cancelar edição
test("cancela a edicao de um cliente", async ({ page }) => {
  const Linha = page.getByRole("row", { name: /Ana Souza/ });
  await Linha.getByRole("button", { name: "Editar" }).click();
  await page.getByLabel("Nome").fill("Ana Souza Silva");
  await Linha.getByRole("button", { name: "Cancelar" }).click();
  await expect(page.getByText("Ana Souza")).toBeVisible();
});

// Atividade C7: Editar para um email já usado
test("mostra erro ao editar para um email ja cadastrado", async ({ page }) => {
  const Linha = page.getByRole("row", { name: /Bruno Lima/ });
  await Linha.getByRole("button", { name: "Editar" }).click();
  await page.getByLabel("Email").fill("ana@email.com");
  await page.getByRole("button", { name: "Salvar" }).click();
  await expect(page.getByText("Email ja cadastrado")).toBeVisible();
});

// Atividade C8: Remover um cliente
test("remove um cliente", async ({ page }) => {
  const Linha = page.getByRole("row", { name: /Bruno Lima/ });
  await Linha.getByRole("button", { name: "Remover" }).click();
  await expect(Linha).toHaveCount(0);
});

// Atividade C9 (desafio): Fluxo completo
test("fluxo completo de cadastro, edicao e remocao", async ({ page }) => {
  await page.getByLabel("Nome").fill("Diego");
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await expect(page.getByText("Cadastro realizado com sucesso!")).toBeVisible();

  const Linha = page.getByRole("row", { name: /Diego/ });
  await Linha.getByRole("button", { name: "Editar" }).click();
  await page.getByLabel("Nome").fill("Diego Matos");
  
  await page.getByLabel("Email").fill("carla@email.com");
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await expect(page.getByText("Email ja cadastrado")).toBeVisible();
  
  await page.getByRole("row", { name: /Diego Matos/ });
  await Linha.getByRole("button", { name: "Remover" }).click();
  await expect(Linha).toHaveCount(0);
});