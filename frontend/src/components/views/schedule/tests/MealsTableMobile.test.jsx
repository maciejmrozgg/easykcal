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
  {
    date: "2026-01-06",
    meals: {
      "1": [],
      "2": [{ name: "Ryż", weight: 200, kcal: 260 }],
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

  it("renders meals and initial day", () => {
    render(<MealsTableMobile {...baseProps} />);

    expect(screen.getByText("Śniadanie")).toBeInTheDocument();
    expect(screen.getByText("Obiad")).toBeInTheDocument();
    expect(screen.getByText("2026-01-05")).toBeInTheDocument();
  });

  it("changes day using select", () => {
    render(<MealsTableMobile {...baseProps} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "1" } });

    expect(screen.getByText("2026-01-06")).toBeInTheDocument();
    expect(screen.getByText(/Ryż/)).toBeInTheDocument();
  });

  it("toggles meal content visibility", () => {
    render(<MealsTableMobile {...baseProps} />);

    expect(screen.getByText(/Owsianka/)).toBeInTheDocument();

    const toggle = screen.getAllByText("▲")[0];
    fireEvent.click(toggle);

    expect(screen.queryByText(/Owsianka/)).not.toBeInTheDocument();
  });

  it("opens ingredient modal on add ingredient click", () => {
    render(<MealsTableMobile {...baseProps} />);

    const addIngredientBtn = screen.getAllByText("+ Dodaj składnik")[0];
    fireEvent.click(addIngredientBtn);

    expect(screen.getByText("MODAL OPEN")).toBeInTheDocument();
  });

  it("calls onDeleteMeal after confirmation", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<MealsTableMobile {...baseProps} />);

    const deleteButtons = screen.getAllByTitle("Usuń posiłek");
    fireEvent.click(deleteButtons[0]);

    expect(baseProps.onDeleteMeal).toHaveBeenCalledWith("1");

    window.confirm.mockRestore();
  });

  it("renders day summary", () => {
    render(<MealsTableMobile {...baseProps} />);

    expect(
      screen.getByText(/Suma dnia:/i)
    ).toBeInTheDocument();
  });

  it("renders add meal button", () => {
    render(<MealsTableMobile {...baseProps} />);

    expect(
      screen.getByText("+ Dodaj posiłek")
    ).toBeInTheDocument();
  });
});