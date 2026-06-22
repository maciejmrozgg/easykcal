import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MealsTableDesktop from "../components/MealsTable/desktop/MealsTableDesktop";

// ==================
// MOCK MODAL
// ==================
vi.mock("../components/modals/IngredientModal", () => ({
  default: ({ open }) => (open ? <div>MODAL OPEN</div> : null),
}));

const meals = [
  { id: "1", name: "Posiłek 1" },
  { id: "2", name: "Posiłek 2" },
];

const oatmealIngredient = {
  name: "Owsianka",
  weight: 100,
  kcal: 350,
  protein: 5,
  fat: 3,
  carbs: 55,
};

const days = [
  {
    date: "2026-01-05",
    meals: {
      "1": [oatmealIngredient],
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

    expect(screen.getByDisplayValue("Posiłek 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Posiłek 2")).toBeInTheDocument();
  });

  it("renders day", () => {
    render(<MealsTableDesktop {...baseProps} />);

    expect(screen.getByText("2026-01-05")).toBeInTheDocument();
  });

  it("calls onAddMeal", () => {
    render(<MealsTableDesktop {...baseProps} />);

    fireEvent.click(screen.getByText("+ Dodaj posiłek"));

    expect(baseProps.onAddMeal).toHaveBeenCalled();
  });

  it("calls onRenameMeal on blur", () => {
    render(<MealsTableDesktop {...baseProps} />);

    const input = screen.getByDisplayValue("Posiłek 1");

    fireEvent.change(input, {
      target: { value: "Nowy posiłek" },
    });

    fireEvent.blur(input);

    expect(baseProps.onRenameMeal).toHaveBeenCalledWith(
      "1",
      "Nowy posiłek"
    );
  });

  it("renders add ingredient action", () => {
    render(<MealsTableDesktop {...baseProps} />);

    expect(screen.getAllByText("+ Dodaj składnik")).toHaveLength(2);
  });

  it("opens ingredient modal", () => {
    render(<MealsTableDesktop {...baseProps} />);

    fireEvent.click(screen.getAllByText("+ Dodaj składnik")[0]);

    expect(screen.getByText("MODAL OPEN")).toBeInTheDocument();
  });

  it("calls onDeleteMeal after confirmation", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<MealsTableDesktop {...baseProps} />);

    fireEvent.click(screen.getAllByTitle("Usuń posiłek")[0]);

    expect(baseProps.onDeleteMeal).toHaveBeenCalledWith("1");

    window.confirm.mockRestore();
  });
});