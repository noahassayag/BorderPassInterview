import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Footer from "../Footer";

describe("Footer Component", () => {
  test("renders footer with correct text and class names", () => {
    render(<Footer />);

    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass("footer mt-auto py-3 bg-dark text-white");

    const textElement = screen.getByText(
      "© 2024 Border Pass Questionnaire App. All rights reserved."
    );
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass("text-white");
  });
});
