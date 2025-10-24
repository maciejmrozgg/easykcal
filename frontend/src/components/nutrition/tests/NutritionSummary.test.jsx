import { render, screen } from "@testing-library/react";
import { describe, it, expect } from 'vitest';
import NutritionSummary from "../NutritionSummary";

describe("NutritionSummary", () => {
  const sampleProducts = [
    { name: "Jabłko", weight: 150, result: 80 },
    { name: "Banana", weight: 120, result: 100 },
  ];

  it("renders header", () => {
    render(<NutritionSummary selectedProducts={sampleProducts} />);
    expect(screen.getByText(/Podsumowanie kalorii/i)).toBeInTheDocument();
  });

  it("renders all products", () => {
    render(<NutritionSummary selectedProducts={sampleProducts} />);
    expect(screen.getByText(/Jabłko/i)).toBeInTheDocument();
    expect(screen.getByText(/Banana/i)).toBeInTheDocument();
    expect(screen.getByText(/150 g - 80.00 kcal/i)).toBeInTheDocument();
    expect(screen.getByText(/120 g - 100.00 kcal/i)).toBeInTheDocument();
  });

  it("renders plus sign between products", () => {
    render(<NutritionSummary selectedProducts={sampleProducts} />);
    expect(screen.getAllByText("+")).toHaveLength(1);
  });

  it("calculates and renders total calories", () => {
    render(<NutritionSummary selectedProducts={sampleProducts} />);
    expect(screen.getByText(/Razem/i)).toBeInTheDocument();
    expect(screen.getByText(/180 kcal/i)).toBeInTheDocument();
  });

  it("renders nothing if no products", () => {
    render(<NutritionSummary selectedProducts={[]} />);
    expect(screen.queryByText(/Razem/i)).not.toBeInTheDocument();
    expect(screen.queryByText("+")).not.toBeInTheDocument();
  });
});