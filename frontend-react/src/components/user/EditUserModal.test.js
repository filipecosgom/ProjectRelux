import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditUserModal from "./EditUserModal";

describe("EditUserModal", () => {
  const mockUser = {
    username: "testuser",
    firstName: "Test",
    lastName: "User",
    email: "testuser@example.com",
    phone: "123456789",
    imagem: "https://example.com/image.png",
    isAdmin: true,
    isDeleted: false,
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn((e) => e.preventDefault());

  it("não deve renderizar o modal quando `isVisible` for `false`", () => {
    render(
      <EditUserModal
        user={mockUser}
        isVisible={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onChange={jest.fn()}
        error={null}
      />
    );

    expect(screen.queryByText("Editar Utilizador")).not.toBeInTheDocument();
  });

  it("deve renderizar o modal quando `isVisible` for `true`", () => {
    render(
      <EditUserModal
        user={mockUser}
        isVisible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onChange={jest.fn()}
        error={null}
      />
    );

    expect(screen.getByText("Editar Utilizador")).toBeInTheDocument();
    expect(screen.getByLabelText("Username:")).toHaveValue("testuser");
    expect(screen.getByLabelText("First Name:")).toHaveValue("Test");
    expect(screen.getByLabelText("Last Name:")).toHaveValue("User");
    expect(screen.getByLabelText("Email:")).toHaveValue("testuser@example.com");
    expect(screen.getByLabelText("Phone:")).toHaveValue("123456789");
    expect(screen.getByLabelText("Image URL:")).toHaveValue(
      "https://example.com/image.png"
    );
    expect(screen.getByLabelText("Admin:")).toBeChecked();
    expect(screen.getByLabelText("Ativo:")).toBeChecked();
  });

  it("deve chamar `onSave` ao clicar no botão Salvar", () => {
    render(
      <EditUserModal
        user={mockUser}
        isVisible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onChange={jest.fn()}
        error={null}
      />
    );

    const saveButton = screen.getByText("Salvar");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalled();
  });

  it("deve chamar `onClose` ao clicar no botão Cancelar", () => {
    render(
      <EditUserModal
        user={mockUser}
        isVisible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onChange={jest.fn()}
        error={null}
      />
    );

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
