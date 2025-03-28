import React from "react";
import { render, screen } from "@testing-library/react";
import CategoryManager from "./CategoryManager";

describe("CategoryManager", () => {
  const mockToken = "mock-token";

  it("deve renderizar o componente corretamente", () => {
    render(<CategoryManager token={mockToken} />);
    expect(screen.getByText("Gerir Categorias")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nova Categoria")).toBeInTheDocument();
    expect(screen.getByText("Criar")).toBeInTheDocument();
  });
});
