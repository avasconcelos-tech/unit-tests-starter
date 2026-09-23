const request = require('supertest');
const createApp = require('../app');

// Teste de integracao: testa a API de ponta a ponta via HTTP real.
// Cada teste recebe uma app nova (factory), garantindo estado isolado.
//
// Abaixo ha 1 teste pronto (GET /pedidos) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-03-PEDIDOS.md.

describe('API /pedidos (integracao com supertest)', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /pedidos', () => {
    test('retorna 200 e um array com os pedidos iniciais', async () => {
      const res = await request(app).get('/pedidos');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /pedidos/:id', () => {
    test('retorna 200 e o pedido quando o id existe', async () => {
      const res = await request(app).get('/pedidos/1');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });
    test('retorna 404 com mensagem de erro quando o pedido nao existe', async () => {
      const res = await request(app).get('/pedidos/6');

      expect(res.status).toBe(404);
      expect(res.body.erro).toBe('Pedido nao encontrado');
    });
  });

  describe('POST /pedidos', () => {
    test('retorna 201 e o pedido criado com o total calculado corretamente', async () => {
      const novoPedido = {
        cliente: "Ana Souza",
        itens: [
          {
            nome: "Produto 1",
            precoUnitario: 10,
            quantidade: 2
          }
        ]
      };

      const res = await request(app).post('/pedidos').send(novoPedido);

      expect(res.status).toBe(201);
      expect(res.body.cliente).toBe("Ana Souza");
      expect(res.body.total).toBe(20);
    });
    test('retorna 400 quando o cliente esta faltando', async () => {
      const novoPedido = {
        cliente: "",
        itens: [
          {
            nome: "Produto 1",
            precoUnitario: 10,
            quantidade: 2
          }
        ]
      };

      const res = await request(app).post('/pedidos').send(novoPedido);

      expect(res.status).toBe(400);
      expect(res.body.erro).toBe('Cliente e obrigatorio');
    });
    test('retorna 400 quando a lista de itens esta vazia', async () => {
      const novoPedido = {
        cliente: "Ana Souza",
        itens: []
      };

      const res = await request(app).post('/pedidos').send(novoPedido);

      expect(res.status).toBe(400);
      expect(res.body.erro).toBe('Pedido deve ter ao menos um item');
    });
    test('retorna 400 quando algum item tem preco ou quantidade invalidos', async () => {
      const novoPedido = {
        cliente: "Ana Souza",
        itens: [
          {
            nome: "Produto 1",
            precoUnitario: -10,
            quantidade: 2
          }
        ]
      };

      const res = await request(app).post('/pedidos').send(novoPedido);

      expect(res.status).toBe(400);
      expect(res.body.erro).toBe('Itens devem ter nome, preco e quantidade validos');
    });
  });

  describe('PATCH /pedidos/:id/status', () => {
    test('retorna 200 e o pedido com o novo status quando o id existe', async () => {
      const res = await request(app).patch('/pedidos/1/status').send({ status: 'pago' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('pago');
    });
    test('retorna 404 quando o pedido nao existe', async () => {
      const res = await request(app).patch('/pedidos/6/status').send({ status: 'pago' });

      expect(res.status).toBe(404);
      expect(res.body.erro).toBe('Pedido nao encontrado');
    });
    test('retorna 400 quando o status enviado e invalido', async () => {
      const res = await request(app).patch('/pedidos/1/status').send({ status: 'status invalido' });

      expect(res.status).toBe(400);
      expect(res.body.erro).toBe('Status invalido');
    });
    test('retorna 400 ao tentar alterar o status de um pedido ja cancelado', async () => {
      await request(app).patch('/pedidos/1/status').send({ status: 'cancelado' });
      const res = await request(app).patch('/pedidos/1/status').send({ status: 'pago' });

      expect(res.status).toBe(400);
      expect(res.body.erro).toBe('Pedido cancelado nao pode ser alterado');
    });
  });

  describe('DELETE /pedidos/:id', () => {
    test('retorna 204 quando o pedido e removido com sucesso', async () => {
      const res = await request(app).delete('/pedidos/1');

      expect(res.status).toBe(204);
    });
    test('retorna 404 quando o pedido nao existe', async () => {
      const res = await request(app).delete('/pedidos/6');

      expect(res.status).toBe(404);
      expect(res.body.erro).toBe('Pedido nao encontrado');
    });
  });
});
