import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/categoriesApi";
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

vi.mock("../api/recipesApi", () => ({
  getRecipes: vi.fn(),
  createRecipe: vi.fn(),
  updateRecipe: vi.fn(),
  deleteRecipe: vi.fn(),
}));

vi.mock("../api/categoriesApi", () => ({
  getCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../api/recipesApi";

// ==================
// SETUP
// ==================
const adminUser = { id: 1, role: "admin" };

beforeEach(() => {
  vi.clearAllMocks();
  getRecipes.mockResolvedValue(mockRecipes);

  getCategories.mockResolvedValue([
    {
      id: null,
      name: "Bez kategorii",
      image_url: "/images/categories/default.jpg",
    },
  ]);
});

// ==================
// HELPER
// ==================

const enterRecipesList = async () => {
  const categoryHeadings = await screen.findAllByRole("heading", {
    name: "Bez kategorii",
  });

  fireEvent.click(categoryHeadings[0]);
};


// ==================
// TESTS
// ==================
describe("Recipes view – full flow", () => {
  it("renders recipe titles", async () => {
    render(<Recipes user={adminUser} />);

    await enterRecipesList();

    expect(await screen.findByText("Jajecznica")).toBeInTheDocument();
  });

  it("expands recipe details after clicking title", async () => {
    render(<Recipes user={adminUser} />);

    await enterRecipesList();

    const title = await screen.findByText("Jajecznica");
    fireEvent.click(title);

    expect(await screen.findByText("Pyszna")).toBeInTheDocument();
    expect(screen.getByText("jajka")).toBeInTheDocument();
    expect(screen.getByText("smaż")).toBeInTheDocument();
  });

  it("filters recipes by title", async () => {
    render(<Recipes user={adminUser} />);

    const input = screen.getByPlaceholderText("Wyszukaj przepis po nazwie...");
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
    
    fireEvent.click(await screen.findByText("Dodaj przepis"));

    fireEvent.change(screen.getByPlaceholderText("Tytuł"), { target: { value: "Nowy przepis" } });
    fireEvent.change(screen.getByPlaceholderText("Opis"), { target: { value: "" } });

    const ingredientInput = screen.getByPlaceholderText("Tytuł").closest('form')
      .querySelector(".ingredient input");
    fireEvent.change(ingredientInput, { target: { value: "test" } });

    const instructionInput = screen.getByPlaceholderText("Tytuł").closest('form')
      .querySelector(".instruction input");
    fireEvent.change(instructionInput, { target: { value: "test" } });
    fireEvent.click(screen.getByTestId("submit-recipe"));

    await enterRecipesList();

    await waitFor(() => {
      expect(createRecipe).toHaveBeenCalledWith({
        title: "Nowy przepis",
        description: "",
        ingredients: ["test"],
        instructions: ["test"],
        category_id: null,
      });
    });
  });

  it("updates a recipe", async () => {
    updateRecipe.mockResolvedValueOnce({
      ...mockRecipes[0],
      title: "Jajecznica deluxe",
    });

    render(<Recipes user={adminUser} />);

    await enterRecipesList();

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

    await enterRecipesList();

    fireEvent.click(await screen.findByText("Jajecznica"));
    fireEvent.click(screen.getByText(/usuń/i));

    await waitFor(() => {
      expect(deleteRecipe).toHaveBeenCalledWith(1);
    });
  });

  it("creates a new category", async () => {
    createCategory.mockResolvedValueOnce({
      id: 2,
      name: "Nowa kategoria",
      user_id: 1,
    });

    render(<Recipes user={adminUser} />);

    fireEvent.click(await screen.findByText("Dodaj kategorię"));

    fireEvent.change(screen.getByLabelText("Nazwa:"), {
      target: { value: "Nowa kategoria" },
    });

    fireEvent.click(screen.getByText("Zapisz"));

    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith("Nowa kategoria");
    });
  });

  it("updates category", async () => {
    getCategories.mockResolvedValueOnce([
      { id: 1, name: "Obiady", user_id: 1 },
    ]);

    updateCategory.mockResolvedValueOnce({
      id: 1,
      name: "Kolacje",
      user_id: 1,
    });

    render(<Recipes user={adminUser} />);

    const editButton = await screen.findByText("✏️");
    fireEvent.click(editButton);

    fireEvent.change(screen.getByLabelText("Nazwa:"), {
      target: { value: "Kolacje" },
    });

    fireEvent.click(screen.getByText("Zapisz"));

    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalledWith(1, "Kolacje");
    });
  });

  it("deletes category", async () => {
    getCategories.mockResolvedValueOnce([
      { id: 1, name: "Obiady", user_id: 1 },
    ]);

    deleteCategory.mockResolvedValueOnce({});

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<Recipes user={adminUser} />);

    const editButton = await screen.findByText("✏️");
    fireEvent.click(editButton);

    fireEvent.click(screen.getByText("Usuń"));

    await waitFor(() => {
      expect(deleteCategory).toHaveBeenCalledWith(1);
    });
  });
});