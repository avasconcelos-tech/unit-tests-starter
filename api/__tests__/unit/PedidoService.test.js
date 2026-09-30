const PedidoService = require("../../services/PedidoService");

// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()), assim testamos so a
// logica do service, sem depender de dados reais.
//
// Abaixo ha 1 teste pronto (listar) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-03-PEDIDOS.md.

describe("PedidoService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    service = new PedidoService(mockRepository);
  });

  describe("listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const pedidos = [
        {
          id: 1,
          cliente: "Ana Souza",
          itens: [],
          status: "pendente",
          total: 0,
        },
      ];
      mockRepository.findAll.mockReturnValue(pedidos);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(pedidos);
    });
  });

  describe("buscarPorId", () => {
<<<<<<< HEAD:api/__tests__/PedidoService.test.js
    test("repassa o id ao repository e retorna o pedido encontrado", () => {
      const pedidos = {
        id: 1,
        cliente: "Ana Souza",
        itens: [],
        status: "pendente",
        total: 0,
      };
      mockRepository.findById.mockReturnValue(pedidos);

      const resultado = service.buscarPorId(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(pedidos);
    });
    test("lanca erro 'Pedido nao encontrado' quando o repository retorna null", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.buscarPorId(6)).toThrow("Pedido nao encontrado");
      expect(mockRepository.findById).toHaveBeenCalledWith(6);
    });
  });

  describe("criar", () => {
    test("repassa os dados ao repository e retorna o pedido criado com o total calculado", () => {
      const pedidos = {
        id: 1,
        cliente: "Ana Souza",
        itens: [],
        status: "pendente",
        total: 0,
      };
      mockRepository.create.mockReturnValue(pedidos);

      const resultado = service.criar(pedidos);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(pedidos);
    });
    test("propaga o erro quando o cliente estiver faltando", () => {
      const pedidos = {
        id: 1,
        cliente: "",
        itens: [],
        status: "pendente",
        total: 0,
      };
      mockRepository.create.mockImplementation(() => {
        throw new Error("Cliente e obrigatorio");
      });

      expect(() => service.criar(pedidos)).toThrow("Cliente e obrigatorio");
    });
    test("propaga o erro quando a lista de itens estiver vazia", () => {
      const pedidos = {
        id: 1,
        cliente: "Ana Souza",
        itens: [],
        status: "pendente",
        total: 0,
      };
      mockRepository.create.mockImplementation(() => {
        throw new Error("Pedido deve ter ao menos um item");
      });

      expect(() => service.criar(pedidos)).toThrow("Pedido deve ter ao menos um item");
    });
    test("propaga o erro quando algum item tiver preco ou quantidade invalidos", () => {
      const pedidos = {
        id: 1,
        cliente: "Ana Souza",
        itens: [
          {
            nome: "Produto 1",
            preco: -10,
            quantidade: 2,
          },
        ],
        status: "pendente",
        total: 0,
      };
      mockRepository.create.mockImplementation(() => {
        throw new Error("Itens devem ter nome, preco e quantidade validos");
      });

      expect(() => service.criar(pedidos)).toThrow(
        "Itens devem ter nome, preco e quantidade validos",
      );
    });
  });

  describe("atualizarStatus", () => {
    test("chama repository.findById e repository.updateStatus quando o pedido existe", () => {
      const pedidos = {
        id: 1,
        cliente: "Ana Souza",
        itens: [],
        status: "pendente",
        total: 0,
      };
      mockRepository.findById.mockReturnValue(pedidos);

      service.atualizarStatus(1, "em andamento");

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(1, "em andamento");
    });
    test("lanca erro 'Pedido nao encontrado' sem chamar repository.updateStatus quando o pedido nao existe", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.atualizarStatus(6, "em andamento")).toThrow("Pedido nao encontrado");
      expect(mockRepository.findById).toHaveBeenCalledWith(6);
    });
    test("propaga o erro quando o novo status for invalido", () => {
      const pedidos = {
        id: 1,
        cliente: "Ana Souza",
        itens: [],
        status: "pendente",
        total: 0,
      };
      mockRepository.findById.mockReturnValue(pedidos);
      mockRepository.updateStatus.mockImplementation(() => {
        throw new Error("Status invalido");
      });

      expect(() => service.atualizarStatus(1, "status invalido")).toThrow("Status invalido");
    });
    test("propaga o erro quando o pedido ja estiver cancelado", () => {
      const pedidos = {
        id: 1,
        cliente: "Ana Souza",
        itens: [],
        status: "cancelado",
        total: 0,
      };
      mockRepository.findById.mockReturnValue(pedidos);
      mockRepository.updateStatus.mockImplementation(() => {
        throw new Error("Pedido cancelado nao pode ser alterado");
      });

      expect(() => service.atualizarStatus(1, "pago")).toThrow(
        "Pedido cancelado nao pode ser alterado",
      );
    });
  });

  describe("remover", () => {
    test("chama repository.delete com o id correto quando o pedido existe", () => {
      const pedidos = {
        id: 1,
        cliente: "Ana Souza",
        itens: [],
        status: "pendente",
        total: 0,
      };
      mockRepository.delete.mockReturnValue(true);

      service.remover(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
    test("lanca erro 'Pedido nao encontrado' quando o repository retorna false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(6)).toThrow("Pedido nao encontrado");
      expect(mockRepository.delete).toHaveBeenCalledWith(6);
    });
=======
    test.todo("repassa o id ao repository e retorna o pedido encontrado");
    test.todo(
      "lanca erro 'Pedido nao encontrado' quando o repository retorna null",
    );
  });

  describe("criar", () => {
    test.todo(
      "repassa os dados ao repository e retorna o pedido criado com o total calculado",
    );
    test.todo("propaga o erro quando o cliente estiver faltando");
    test.todo("propaga o erro quando a lista de itens estiver vazia");
    test.todo(
      "propaga o erro quando algum item tiver preco ou quantidade invalidos",
    );
  });

  describe("atualizarStatus", () => {
    test.todo(
      "chama repository.findById e repository.updateStatus quando o pedido existe",
    );
    test.todo(
      "lanca erro 'Pedido nao encontrado' sem chamar repository.updateStatus quando o pedido nao existe",
    );
    test.todo("propaga o erro quando o novo status for invalido");
    test.todo("propaga o erro quando o pedido ja estiver cancelado");
  });

  describe("remover", () => {
    test.todo(
      "chama repository.delete com o id correto quando o pedido existe",
    );
    test.todo(
      "lanca erro 'Pedido nao encontrado' quando o repository retorna false",
    );
>>>>>>> 89b994eaa8ff6cdadda91e4ededefcbc83b682c5:api/__tests__/unit/PedidoService.test.js
  });
});
