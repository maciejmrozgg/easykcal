import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from 'vitest';
import Recipes from "../Recipes";

// Mock API
vi.mock("../api/recipesRoutes", () => ({
  getRecipes: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Jajecznica",
      description: "Pyszna",
      ingredients: ["jajka", "masło"],
      instructions: ["wbij jajka", "smaż"],
    },
  ]),
  createRecipe: vi.fn().mockResolvedValue({
    id: 2,
    title: "Nowy przepis",
    description: "Opis",
    ingredients: [],
    instructions: [],
  }),
  deleteRecipe: vi.fn().mockResolvedValue({ success: true }),
  updateRecipe: vi.fn().mockResolvedValue({ success: true }),
}));

describe("Recipes view", () => {
  it("renders recipes from mocked API", async () => {
    render(<Recipes />);

    // findByText czeka na element w DOM po fetchu
    expect(await screen.findByText("Jajecznica")).toBeInTheDocument();
    expect(await screen.findByText("Pyszna")).toBeInTheDocument();
  });

  it("renders ingredients and instructions if available", async () => {
    render(<Recipes />);
    
    expect(await screen.findByText("Składniki:")).toBeInTheDocument();
    expect(screen.getByText("jajka")).toBeInTheDocument();
    expect(screen.getByText("masło")).toBeInTheDocument();

    expect(await screen.findByText("Instrukcje:")).toBeInTheDocument();
    expect(screen.getByText("wbij jajka")).toBeInTheDocument();
    expect(screen.getByText("smaż")).toBeInTheDocument();
  });

  // Możesz też dodać test "Brak przepisów" dla pustego fetchu
  it("shows empty message when no recipes", async () => {
    const { getRecipes } = await import("../api/recipesRoutes");
    getRecipes.mockResolvedValueOnce([]); // tym razem zwraca pustą tablicę

    render(<Recipes />);
    expect(await screen.findByText("Brak przepisów do wyświetlenia.")).toBeInTheDocument();
  });
});