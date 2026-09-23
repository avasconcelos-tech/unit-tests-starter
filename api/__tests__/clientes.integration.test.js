const request = require('supertest');
const createApp = require('../app');

// Teste de integracao: testa a API de ponta a ponta via HTTP real.
// Cada teste recebe uma app nova (factory), garantindo estado isolado.
//
// Abaixo ha 1 teste pronto (GET /clientes) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-02-CLIENTES.md.

describe('API /clientes (integracao com supertest)', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /clientes', () => {
    test('retorna 200 e um array com os clientes iniciais', async () => {
      const res = await request(app).get('/clientes');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /clientes/:id', () => {
    test('retorna 200 e o cliente quando o id existe', async () => {
      const res = await request(app).get('/clientes/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1, nome: "Ana", email: "ana@email.com" });
    });
    test('retorna 404 com mensagem de erro quando o cliente nao existe', async () => {
      const res = await request(app).get('/clientes/4');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Cliente nao encontrado" });
    });
  });

  describe('POST /clientes', () => {
    test('retorna 201 e o cliente criado com id gerado', async () => {
      const res = await request(app).post('/clientes').send({ nome: "Carlos", email: "carlos@email.com" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 3, nome: "Carlos", email: "carlos@email.com" });
    });
    test('retorna 400 quando o nome esta faltando', async () => {
      const res = await request(app).post('/clientes').send({ nome: "", email: "ana@email.com" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Cliente invalido" });
    });
    test('retorna 400 quando o email esta faltando', async () => {
      const res = await request(app).post('/clientes').send({ nome: "Ana", email: "" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Cliente invalido" });
    });
    test('retorna 400 quando o email ja esta cadastrado', async () => {
      const res = await request(app).post('/clientes').send({ nome: "Ana", email: "ana@email.com" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Email ja cadastrado" });
    });

    test('cliente criado aparece em GET /clientes', async () => {
      await request(app).post('/clientes').send({ nome: "Carlos", email: "carlos@email.com" });

      const res = await request(app).get('/clientes');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
      expect(res.body).toContainEqual({ id: 3, nome: "Carlos", email: "carlos@email.com" });
    });
  });

  describe('PUT /clientes/:id', () => {
    test('retorna 200 e o cliente atualizado quando o id existe', async () => {
      const res = await request(app).put('/clientes/1').send({ nome: "Ana Laura", email: "ana.laura@email.com" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1, nome: "Ana Laura", email: "ana.laura@email.com" });
    });
    test('retorna 404 quando o cliente nao existe', async () => {
      const res = await request(app).put('/clientes/4').send({ nome: "Ana Atualizada", email: "ana.atualizada@email.com" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Cliente nao encontrado" });
    });
    test('retorna 400 quando o novo email ja pertence a outro cliente', async () => {
      const res = await request(app).put('/clientes/1').send({ nome: "Ana Laura", email: "ana.laura@email.com" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Email ja cadastrado" });
    });
  });

  describe('DELETE /clientes/:id', () => {
    test('retorna 204 quando o cliente e removido com sucesso', async () => {
      const res = await request(app).delete("/clientes/1");

      expect(res.status).toBe(204);
      expect(res.body).toEqual({ message: "Cliente removido com sucesso" });
    });
    test('cliente removido nao aparece mais na listagem', async () => {
      await request(app).delete("/clientes/1");

      const res = await request(app).get("/clientes");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
    test('retorna 404 quando o cliente nao existe' , async () => {
      const res = await request(app).delete("/clientes/999");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Cliente não encontrado" });
    });
  });
});
