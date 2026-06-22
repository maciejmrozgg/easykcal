import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MealsTableMobile from "../components/MealsTable/mobile/MealsTableMobile";

// ==================
// MOCK MODAL
// ==================
vi.mock("../components/modals/IngredientModal", () => ({
  default: ({ open }) => (open ? <div>MODAL OPEN</div> : null),
}));

// ==================
// MOCK DATA
// ==================
const meals = [
  { id: "1", name: "Posiłek 1" },
  { id: "2", name: "Posiłek 2" },
];

const oatMealIngredient = {
  name: "Owsianka",
  weight: 100,
  kcal: 350,
  protein: 5,
  fat: 3,
  carbs: 55,
};

const riceMealIngredient = {
  name: "Ryż",
  weight: 200,
  kcal: 260,
  protein: 5,
  fat: 1,
  carbs: 55,
};

const days = [
  {
    date: "2026-01-05",
    meals: {
      "1": [oatMealIngredient],
      "2": [],
    },
  },
  {
    date: "2026-01-06",
    meals: {
      "1": [],
      "2": [riceMealIngredient],
    },
  },
];

// ==================
// TESTS
// ==================
describe("MealsTableMobile tests", () => {
  const baseProps = {
    meals,
    days,
    zeroLimit: 2500,
    deficitLimit: 2000,
    onAddMeal: vi.fn(),
    onDeleteMeal: vi.fn(),
    onUpdateIngredient: vi.fn(),
    maxMeals: 6,
  };

  it("renders meals and first day", () => {
    render(<MealsTableMobile {...baseProps} />);

    expect(screen.getByText("Posiłek 1")).toBeInTheDocument();
    expect(screen.getByText("Posiłek 2")).toBeInTheDocument();
    expect(screen.getByText("2026-01-05")).toBeInTheDocument();
  });

  it("changes selected day", () => {
    render(<MealsTableMobile {...baseProps} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "1" },
    });

    expect(screen.getByText("2026-01-06")).toBeInTheDocument();
    expect(screen.getByText(/Ryż/)).toBeInTheDocument();
  });

  it("toggles meal visibility", () => {
    render(<MealsTableMobile {...baseProps} />);

    expect(screen.getByText(/Owsianka/)).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("▲")[0]);

    expect(screen.queryByText(/Owsianka/)).not.toBeInTheDocument();
  });

  it("renders day summary", () => {
    render(<MealsTableMobile {...baseProps} />);

    expect(screen.getByText(/Suma dnia:/i)).toBeInTheDocument();
  });

  it("calls onAddMeal", () => {
    render(<MealsTableMobile {...baseProps} />);

    fireEvent.click(screen.getByText("+ Dodaj posiłek"));

    expect(baseProps.onAddMeal).toHaveBeenCalled();
  });

  it("opens ingredient modal", () => {
    render(<MealsTableMobile {...baseProps} />);

    fireEvent.click(screen.getAllByText("+ Dodaj składnik")[0]);

    expect(screen.getByText("MODAL OPEN")).toBeInTheDocument();
  });

  it("calls onDeleteMeal after confirmation", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<MealsTableMobile {...baseProps} />);

    fireEvent.click(screen.getAllByTitle("Usuń posiłek")[0]);

    expect(baseProps.onDeleteMeal).toHaveBeenCalledWith("1");

    window.confirm.mockRestore();
  });
});