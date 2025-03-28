import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditProductModal from "./EditProductModal";

describe("EditProductModal", () => {
  const mockProduct = {
    title: "Produto Teste",
    category: { id: "1" },
    price: "10.00",
    imagem: "http://example.com/image.jpg",
    local: "Lisboa",
    description: "Descrição do produto",
    state: "DISPONIVEL",
  };

  const mockCategories = [
    { id: "1", nome: "Categoria 1" },
    { id: "2", nome: "Categoria 2" },
  ];

  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnChange = jest.fn();

  it("deve renderizar o modal corretamente quando visível", () => {
    render(
      <EditProductModal
        product={mockProduct}
        categories={mockCategories}
        isVisible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onChange={mockOnChange}
        error={null}
      />
    );

    expect(screen.getByText("Editar Produto")).toBeInTheDocument();
    expect(screen.getByLabelText("Título:")).toHaveValue(mockProduct.title);
    expect(screen.getByLabelText("Preço:")).toHaveValue(mockProduct.price);
    expect(screen.getByLabelText("Descrição:")).toHaveValue(
      mockProduct.description
    );
  });

  it("não deve renderizar o modal quando não está visível", () => {
    const { container } = render(
      <EditProductModal
        product={mockProduct}
        categories={mockCategories}
        isVisible={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onChange={mockOnChange}
        error={null}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("deve chamar onChange ao alterar o título", () => {
    render(
      <EditProductModal
        product={mockProduct}
        categories={mockCategories}
        isVisible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onChange={mockOnChange}
        error={null}
      />
    );

    const titleInput = screen.getByLabelText("Título:");
    fireEvent.change(titleInput, { target: { value: "Novo Título" } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockProduct,
      title: "Novo Título",
    });
  });

  it("deve exibir uma mensagem de erro ao inserir um preço inválido", () => {
    render(
      <EditProductModal
        product={mockProduct}
        categories={mockCategories}
        isVisible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onChange={mockOnChange}
        error={null}
      />
    );

    const priceInput = screen.getByLabelText("Preço:");
    fireEvent.change(priceInput, { target: { value: "abc" } });

    expect(
      screen.getByText(
        "O preço deve ser um número válido com até 2 casas decimais."
      )
    ).toBeInTheDocument();
  });

  it("deve chamar onSave ao salvar o produto", () => {
    render(
      <EditProductModal
        product={mockProduct}
        categories={mockCategories}
        isVisible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onChange={mockOnChange}
        error={null}
      />
    );

    const saveButton = screen.getByText("Salvar");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalled();
  });

  it("deve chamar onClose ao clicar no botão cancelar", () => {
    render(
      <EditProductModal
        product={mockProduct}
        categories={mockCategories}
        isVisible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onChange={mockOnChange}
        error={null}
      />
    );

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
