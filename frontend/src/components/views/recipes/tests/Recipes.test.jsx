import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Recipes from "../Recipes";

// ==================
// MOCK API
// ==================
const mockRecipes = [
  {
    id: 1,
    title: "Jajecznica",
    description: "Pyszna",
    ingredients: ["jajka", "masło"],
    instructions: ["wbij jajka", "smaż"],
    user_id: 1,
  },
];

vi.mock("../api/recipesRoutes", () => ({
  getRecipes: vi.fn(),
  createRecipe: vi.fn(),
  updateRecipe: vi.fn(),
  deleteRecipe: vi.fn(),
}));

import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../api/recipesRoutes";

// ==================
// SETUP
// ==================
const adminUser = { id: 1, role: "admin" };

beforeEach(() => {
  vi.clearAllMocks();
  getRecipes.mockResolvedValue(mockRecipes);
});

// ==================
// TESTS
// ==================
describe("Recipes view – full flow", () => {
  it("renders recipe titles", async () => {
    render(<Recipes user={adminUser} />);

    expect(await screen.findByText("Jajecznica")).toBeInTheDocument();
  });

  it("expands recipe details after clicking title", async () => {
    render(<Recipes user={adminUser} />);

    const title = await screen.findByText("Jajecznica");
    fireEvent.click(title);

    expect(await screen.findByText("Pyszna")).toBeInTheDocument();
    expect(screen.getByText("jajka")).toBeInTheDocument();
    expect(screen.getByText("smaż")).toBeInTheDocument();
  });

  it("filters recipes by title", async () => {
    render(<Recipes user={adminUser} />);

    const input = screen.getByPlaceholderText("Szukaj przepisu po nazwie...");
    fireEvent.change(input, { target: { value: "xyz" } });

    await waitFor(() => {
      expect(screen.queryByText("Jajecznica")).not.toBeInTheDocument();
    });
  });

  it("creates a new recipe", async () => {
    createRecipe.mockResolvedValueOnce({
      id: 2,
      title: "Nowy przepis",
      description: "",
      ingredients: ["test"],
      instructions: ["test"],
      user_id: 1,
    });

    render(<Recipes user={adminUser} />);

    // Otwórz formularz
    fireEvent.click(await screen.findByText("Dodaj przepis"));

    // Wypełnij tytuł i opis
    fireEvent.change(screen.getByPlaceholderText("Tytuł"), { target: { value: "Nowy przepis" } });
    fireEvent.change(screen.getByPlaceholderText("Opis"), { target: { value: "" } });

    // Wypełnij pierwszy składnik
    const ingredientInput = screen.getByPlaceholderText("Tytuł").closest('form')
      .querySelector(".ingredient input");
    fireEvent.change(ingredientInput, { target: { value: "test" } });

    // Wypełnij pierwszą instrukcję
    const instructionInput = screen.getByPlaceholderText("Tytuł").closest('form')
      .querySelector(".instruction input");
    fireEvent.change(instructionInput, { target: { value: "test" } });

    // Kliknij submit
    fireEvent.click(screen.getByTestId("submit-recipe"));

    // Sprawdź, czy createRecipe zostało wywołane
    await waitFor(() => {
      expect(createRecipe).toHaveBeenCalledWith({
        title: "Nowy przepis",
        description: "",
        ingredients: ["test"],
        instructions: ["test"],
      });
    });
  });

  it("updates a recipe", async () => {
    updateRecipe.mockResolvedValueOnce({
      ...mockRecipes[0],
      title: "Jajecznica deluxe",
    });

    render(<Recipes user={adminUser} />);

    fireEvent.click(await screen.findByText("Jajecznica"));
    fireEvent.click(screen.getByText(/edytuj/i));

    fireEvent.change(screen.getByPlaceholderText("Tytuł"), {
      target: { value: "Jajecznica deluxe" },
    });

    fireEvent.click(screen.getByText("Zapisz zmiany"));

    await waitFor(() => {
      expect(updateRecipe).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ title: "Jajecznica deluxe" })
      );
    });
  });

  it("deletes recipe as admin", async () => {
    deleteRecipe.mockResolvedValueOnce({ message: "Recipe deleted" });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<Recipes user={adminUser} />);

    fireEvent.click(await screen.findByText("Jajecznica"));
    fireEvent.click(screen.getByText(/usuń/i));

    await waitFor(() => {
      expect(deleteRecipe).toHaveBeenCalledWith(1);
    });
  });

  it("shows empty message when no recipes", async () => {
    getRecipes.mockResolvedValueOnce([]);

    render(<Recipes user={adminUser} />);

    expect(
      await screen.findByText("Brak przepisów.")
    ).toBeInTheDocument();
  });
});