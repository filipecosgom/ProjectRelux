import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("deve renderizar o logo corretamente", () => {
    render(<Footer />);
    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass("footer-logo");
  });

  it("deve renderizar os links rápidos corretamente", () => {
    render(<Footer />);
    const aboutLink = screen.getByText("About");
    const termsLink = screen.getByText("Terms");
    const privacyLink = screen.getByText("Privacy");

    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");

    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute("href", "/terms");

    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  it("deve renderizar os ícones de redes sociais com links corretos", () => {
    render(<Footer />);
    const facebookLink = screen.getByRole("link", { name: /facebook/i });
    const twitterLink = screen.getByRole("link", { name: /twitter/i });
    const instagramLink = screen.getByRole("link", { name: /instagram/i });

    expect(facebookLink).toBeInTheDocument();
    expect(facebookLink).toHaveAttribute("href", "https://facebook.com");
    expect(facebookLink).toHaveAttribute("target", "_blank");
    expect(facebookLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute("href", "https://twitter.com");
    expect(twitterLink).toHaveAttribute("target", "_blank");
    expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute("href", "https://instagram.com");
    expect(instagramLink).toHaveAttribute("target", "_blank");
    expect(instagramLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("deve renderizar o texto de direitos autorais corretamente", () => {
    render(<Footer />);
    const copyrightText = screen.getByText(
      /© 2025 Your Company Name. All rights reserved./i
    );
    expect(copyrightText).toBeInTheDocument();
  });
});
