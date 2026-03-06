import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import App from "../../src/App";

describe("App localization", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the main tracker surface in french with champion visuals", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Suivi des champions", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Rechercher un champion")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Visuel de Aatrox" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Valider" }).length).toBeGreaterThan(0);
    expect(screen.queryByText("LUXURY MASTER LIST")).not.toBeInTheDocument();
  });
});
