import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import CategoryManager from "./CategoryManager";

jest.mock("axios");

describe("CategoryManager", () => {
  const mockToken = "mock-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o componente corretamente", () => {
    render(<CategoryManager token={mockToken} />);
    expect(screen.getByText("Gerir Categorias")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nova Categoria")).toBeInTheDocument();
    expect(screen.getByText("Criar")).toBeInTheDocument();
  });

  it("deve buscar e exibir categorias ao carregar", async () => {
    const mockCategories = [
      { id: "1", nome: "Categoria 1" },
      { id: "2", nome: "Categoria 2" },
    ];
    axios.get.mockResolvedValueOnce({ data: mockCategories });

    render(<CategoryManager token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText("Categoria 1")).toBeInTheDocument();
      expect(screen.getByText("Categoria 2")).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8080/filipe-proj4/rest/categories/all"
    );
  });

  it("deve criar uma nova categoria", async () => {
    axios.post.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: [] }); // Simula o fetch após criação

    render(<CategoryManager token={mockToken} />);

    const input = screen.getByPlaceholderText("Nova Categoria");
    const createButton = screen.getByText("Criar");

    fireEvent.change(input, { target: { value: "Nova Categoria" } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/filipe-proj4/rest/categories/new",
        { name: "Nova Categoria" },
        { headers: { Authorization: mockToken } }
      );
    });
  });

  it("deve editar uma categoria existente", async () => {
    const mockCategories = [{ id: "1", nome: "Categoria 1" }];
    axios.get.mockResolvedValueOnce({ data: mockCategories });
    axios.put.mockResolvedValueOnce({});

    render(<CategoryManager token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText("Categoria 1")).toBeInTheDocument();
    });

    const editButton = screen.getByText("Editar");
    fireEvent.click(editButton);

    const input = screen.getByDisplayValue("Categoria 1");
    fireEvent.change(input, { target: { value: "Categoria Editada" } });

    const saveButton = screen.getByText("Salvar");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:8080/filipe-proj4/rest/categories/1",
        { name: "Categoria Editada" },
        { headers: { Authorization: mockToken } }
      );
    });
  });

  it("deve apagar uma categoria", async () => {
    const mockCategories = [{ id: "1", nome: "Categoria 1" }];
    axios.get.mockResolvedValueOnce({ data: mockCategories });
    axios.delete.mockResolvedValueOnce({});

    render(<CategoryManager token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText("Categoria 1")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Apagar");
    window.confirm = jest.fn(() => true); // Simula confirmação do usuário
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:8080/filipe-proj4/rest/categories/1",
        { headers: { Authorization: mockToken } }
      );
    });
  });

  it("deve exibir uma mensagem de erro ao falhar na criação de uma categoria", async () => {
    axios.post.mockRejectedValueOnce(new Error("Erro ao criar categoria"));

    render(<CategoryManager token={mockToken} />);

    const input = screen.getByPlaceholderText("Nova Categoria");
    const createButton = screen.getByText("Criar");

    fireEvent.change(input, { target: { value: "Nova Categoria" } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao criar categoria. Tente novamente.")
      ).toBeInTheDocument();
    });
  });
});
