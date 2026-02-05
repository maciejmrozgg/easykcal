import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MealsTableDesktop from "../components/MealsTable/desktop/MealsTableDesktop";

// ==================
// MOCK MODAL
// ==================
vi.mock("../components/modals/IngredientModal", () => ({
  default: ({ open }) => open ? <div>MODAL OPEN</div> : null
}));

const meals = [
  { id: "1", name: "Śniadanie" },
  { id: "2", name: "Obiad" },
];

const days = [
  {
    date: "2026-01-05",
    meals: {
      "1": [{ name: "Owsianka", weight: 100, kcal: 350 }],
      "2": [],
    },
  },
];

// ==================
// TESTS
// ==================
describe("MealsTableDesktop tests", () => {
  const baseProps = {
    meals,
    days,
    deficitLimit: 2000,
    zeroLimit: 2500,
    onAddMeal: vi.fn(),
    onRenameMeal: vi.fn(),
    onDeleteMeal: vi.fn(),
    onUpdateIngredient: vi.fn(),
    maxMeals: 6,
  };

  it("renders meal headers", () => {
    render(<MealsTableDesktop {...baseProps} />);

    expect(screen.getByDisplayValue("Śniadanie")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Obiad")).toBeInTheDocument();
  });

  it("renders days", () => {
    render(<MealsTableDesktop {...baseProps} />);

    expect(screen.getByText(days[0].date)).toBeInTheDocument();
  });

  it("renders add meal button", () => {
    render(<MealsTableDesktop {...baseProps} />);

    expect(screen.getByText("+ Dodaj posiłek")).toBeInTheDocument();
  });

  it("renders add ingredient action", () => {
    render(<MealsTableDesktop {...baseProps} />);

    expect(screen.getAllByText("+ Dodaj składnik").length).toBeGreaterThan(0);
  });

  it("opens ingredient modal on add ingredient click", () => {
    render(<MealsTableDesktop {...baseProps} />);

    const addIngredientBtn = screen.getAllByText("+ Dodaj składnik")[0];
    fireEvent.click(addIngredientBtn);

    expect(screen.getByText("MODAL OPEN")).toBeInTheDocument();
  });

  it("calls onDeleteMeal after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<MealsTableDesktop {...baseProps} />);

    const deleteButtons = screen.getAllByTitle("Usuń posiłek");
    fireEvent.click(deleteButtons[0]);

    expect(baseProps.onDeleteMeal).toHaveBeenCalledWith("1");

    window.confirm.mockRestore();
  });
});