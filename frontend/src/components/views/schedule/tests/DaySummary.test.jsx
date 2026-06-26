import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DaySummary from "../components/DaySummary/DaySummary";

const defaultProps = {
    deficitLimit: 2000,
    zeroLimit: 2500,
    dayTotals: {
        weight: 500,
        kcal: 1800,
        protein: 160,
        fat: 70,
        carbs: 400,
    },
};

describe("DaySummary", () => {
    it("renders day summary", () => {
        render(<DaySummary {...defaultProps} />);

        expect(screen.getByText(/Suma dnia:/i)).toBeInTheDocument();
        expect(screen.getByText(/500g \/ 1800 kcal/i)).toBeInTheDocument();
    });

    it("renders all macro rows", () => {
        render(<DaySummary {...defaultProps} />);

        expect(screen.getByText(/B:/)).toBeInTheDocument();
        expect(screen.getByText(/T:/)).toBeInTheDocument();
        expect(screen.getByText(/W:/)).toBeInTheDocument();
    });

    it("shows success status for completed protein target", () => {
        render(<DaySummary {...defaultProps} />);

        const proteinRow = screen.getByText(/B:/);

        expect(proteinRow).toHaveClass("macro-success");
    });

    it("shows zero status when macro equals zero", () => {
        render(
            <DaySummary
                {...defaultProps}
                dayTotals={{
                    ...defaultProps.dayTotals,
                    protein: 0,
                }}
            />
        );

        const proteinRow = screen.getByText(/B:/);

        expect(proteinRow).toHaveClass("macro-zero");
    });

    it("limits progress bar width to 100%", () => {
        render(
            <DaySummary
                {...defaultProps}
                dayTotals={{
                    ...defaultProps.dayTotals,
                    protein: 500,
                }}
            />
        );

        const proteinBar = screen.getByTestId("B-progress");

        expect(proteinBar).toHaveStyle({
            width: "100%",
        });
    });

    it("shows warning status for medium progress", () => {
        render(
            <DaySummary
                {...defaultProps}
                dayTotals={{
                    ...defaultProps.dayTotals,
                    protein: 100,
                }}
            />
        );

        expect(screen.getByText(/B:/)).toHaveClass("macro-warning");
    });

    it("shows danger status for low progress", () => {
        render(
            <DaySummary
                {...defaultProps}
                dayTotals={{
                    ...defaultProps.dayTotals,
                    protein: 40,
                }}
            />
        );

        expect(screen.getByText(/B:/)).toHaveClass("macro-danger");
    });
});