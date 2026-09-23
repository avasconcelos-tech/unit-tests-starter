const ClienteService = require("../services/ClienteService");

// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()), assim testamos so a
// logica do service, sem depender de dados reais.
//
// Abaixo ha 1 teste pronto (listar) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-02-CLIENTES.md.

describe("ClienteService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new ClienteService(mockRepository);
  });

  describe("listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const clientes = [{ id: 1, nome: "Ana Souza", email: "ana@email.com" }];
      mockRepository.findAll.mockReturnValue(clientes);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(clientes);
    });
  });

  describe("buscarPorId", () => {
    test("repassa o id ao repository e retorna o cliente encontrado", () => {
      const cliente = { id: 1, nome: "Ana", email: "ana@email.com" };
    });
    mockRepository.findById.mockReturnValue(cliente);

    const resultado = service.buscarPorId(1);

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual(cliente);
    test("lanca erro 'Cliente nao encontrado' quando o repository retorna null", () => {
      const clienteNaoEncontrado = service.buscarPorId(999);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      expect(clienteNaoEncontrado).toBeNull("Cliente nao encontrado");
    });
  });

  describe("criar", () => {
    test("repassa os dados ao repository e retorna o cliente criado", () => {
      const cliente = { id: 1, nome: "Ana", email: "ana@email.com" };
      mockRepository.create.mockReturnValue(cliente);

      const resultado = service.criar(cliente);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(cliente);
    });
    test("propaga o erro quando nome ou email estiverem faltando", () => {
      const clienteInvalido = { nome: "", email: "" };
      expect(() => service.criar(clienteInvalido)).toThrow("Cliente invalido");
    });
    test("propaga o erro quando o email ja estiver cadastrado", () => {
      const clienteExiste = { id: 1, nome: "Ana", email: "ana@email.com" };
      mockRepository.findByEmail.mockReturnValue(clienteExiste);
      expect(() => service.criar(clienteExiste)).toThrow("Email ja cadastrado");
    });
  });

  describe("atualizar", () => {
    test.todo(
      "chama repository.findById e repository.update quando o cliente existe",
      () => {
        const clienteExistente = { id: 1, nome: "Ana", email: "ana@email.com" };
        mockRepository.findById.mockReturnValue(clienteExistente);

        const clienteAtualizado = {
          id: 1,
          nome: "Ana Souza",
          email: "ana.souza@email.com",
        };
        mockRepository.update.mockReturnValue(clienteAtualizado);

        const resultado = service.ClienteService.atualizar(
          1,
          clienteAtualizado,
        );

        expect(mockRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockRepository.update).toHaveBeenCalledTimes(1);
        expect(resultado).toEqual(clienteAtualizado);
      },
    );
    test("lanca erro 'Cliente nao encontrado' sem chamar repository.update quando o cliente nao existe", () => {
      const clienteNaoEncontrado = service.ClienteService.atualizar(999, {
        nome: "Novo Nome",
        email: "novo@email.com",
      });
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).not.toHaveBeenCalled();
      expect(clienteNaoEncontrado).toBeNull("Cliente nao encontrado");
    });
    test("propaga o erro quando o novo email ja pertence a outro cliente", () => {
      const clienteExistente = { id: 1, nome: "Ana", email: "ana@email.com" };
      mockRepository.findByEmail.mockReturnValue(clienteExistente);

        expect(() =>
          service.ClienteService.atualizar(1, {
            nome: "Ana",
            email: "ana@email.com",
          }),
        ).toThrow("Email ja cadastrado");
      },
    );
  });

  describe("remover", () => {
    test(
      "chama repository.delete com o id correto quando o cliente existe",
      () => {
        const clienteExistente = { id: 1, nome: "Ana", email: "ana@email.com" };
        mockRepository.delete.mockReturnValue(true);

        expect(() => service.remover(1)).not.toThrow();

        expect(mockRepository.delete).toHaveBeenCalledTimes(1);
        expect(mockRepository.delete).toHaveBeenCalledWith(1);
        expect(clienteExistente).toBeNull("Cliente removido com sucesso");
      },
    );

    test("lanca erro 'Cliente nao encontrado' quando o repository retorna false", () => {
      const clienteNaoEncontrado = { id: 3, nome: "Vitor", email: "vitor@email.com" };
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(3)).toThrow("Cliente nao encontrado");
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(3);

      expect(clienteNaoEncontrado).toBeNull("Cliente nao encontrado");
    });
  });
});
