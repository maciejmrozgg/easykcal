import { render, screen } from "@testing-library/react";
import { describe, it, expect } from 'vitest';
import NutritionSummary from "../NutritionSummary";
import ToastProvider from "../../ui/toast/context/ToastProvider";

describe("NutritionSummary", () => {
  const sampleProducts = [
    {
      id: 1,
      name: "Jabłko",
      weight: 150,
      result: 80,
      protein: 0.4,
      fat: 0.2,
      carbs: 21,
      hasMacros: true,
    },
    {
      id: 2,
      name: "Banana",
      weight: 120,
      result: 100,
      protein: 1.3,
      fat: 0.3,
      carbs: 27,
      hasMacros: true,
    },
  ];

  it("renders header", () => {
    render(
      <ToastProvider>
        <NutritionSummary selectedProducts={sampleProducts} />
      </ToastProvider>
    );

    expect(screen.getByText(/Podsumowanie kalorii/i)).toBeInTheDocument();
  });

  it("renders all products", () => {
    render(
      <ToastProvider>
        <NutritionSummary selectedProducts={sampleProducts} />
      </ToastProvider>
    );

    expect(screen.getByText(/Jabłko/i)).toBeInTheDocument();
    expect(screen.getByText(/Banana/i)).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("150") &&
        content.includes("80.00") &&
        content.includes("kcal")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("120") &&
        content.includes("100.00") &&
        content.includes("kcal")
      )
    ).toBeInTheDocument();
  });

  it("renders plus sign between products", () => {
    render(
      <ToastProvider>
        <NutritionSummary selectedProducts={sampleProducts} />
      </ToastProvider>
    );

    expect(screen.getAllByText("+")).toHaveLength(1);
  });

  it("calculates and renders total calories and weight", () => {
    render(
      <ToastProvider>
        <NutritionSummary selectedProducts={sampleProducts} />
      </ToastProvider>
    );
    expect(screen.getByText(/Razem/i)).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("270") &&
        content.includes("180") &&
        content.includes("kcal")
      )
    ).toBeInTheDocument();
  });

  it("does not render macro nutrients for manual entries", () => {
    render(
      <ToastProvider>
        <NutritionSummary
          selectedProducts={[
            {
              id: 1,
              name: "Manual",
              weight: 100,
              result: 250,
              hasMacros: false,
            },
          ]}
        />
      </ToastProvider>
    );

    expect(screen.queryByText(/🥩/)).not.toBeInTheDocument();
    expect(screen.queryByText(/🧈/)).not.toBeInTheDocument();
    expect(screen.queryByText(/🍚/)).not.toBeInTheDocument();
  });

  it("renders nothing if no products", () => {
    render(
      <ToastProvider>
        <NutritionSummary selectedProducts={[]} />
      </ToastProvider>
    );

    expect(screen.queryByText(/Razem/i)).not.toBeInTheDocument();
    expect(screen.queryByText("+")).not.toBeInTheDocument();
  });
});