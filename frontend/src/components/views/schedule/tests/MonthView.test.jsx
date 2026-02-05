import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MonthView from "../components/MonthView/MonthView"

// ==================
// MOCK API
// ==================
vi.mock("../api/scheduleApi", () => ({
    default: {
        getMonth: vi.fn(),
        updateLimits: vi.fn(),
        addMeal: vi.fn(),
        updateMealName: vi.fn(),
        deleteMeal: vi.fn(),
        addIngredient: vi.fn(),
        updateIngredient: vi.fn(),
        deleteIngredient: vi.fn(),
    },
}));

import scheduleApi from "../api/scheduleApi";

const mockSchedule = {
    year: 2026,
    month: 0,
    deficitLimit: 2200,
    zeroKcalLimit: 1800,
    meals: [
        { id: "1", name: "Śniadanie" },
        { id: "2", name: "Obiad" },
    ],
    days: [
        {
            date: "2026-01-05",
            meals: {
                "1": [
                    { name: "Owsianka", weight: 100, kcal: 350 },
                ],
                "2": [],
            },
        },
    ],
};

// ==================
// SETUP
// ==================
beforeEach(() => {
    vi.clearAllMocks();
    scheduleApi.getMonth.mockResolvedValue(mockSchedule);
});

// ==================
// TESTS
// ==================
describe("Schedule tests MonthView", () => {
    it("fetches and renders month schedule", async () => {
        render(<MonthView year={2026} month={0} />);

        expect(scheduleApi.getMonth).toHaveBeenCalledWith(2026, 0);

        expect(await screen.findByDisplayValue("Śniadanie")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Obiad")).toBeInTheDocument();
    });

    it("shows add ingredient action for meals", async () => {
        render(<MonthView year={2026} month={0} />);

        const buttons = await screen.findAllByText("+ Dodaj składnik");
        expect(buttons.length).toBeGreaterThan(0);
    });

    it("shows loading state before data loads", async () => {
        scheduleApi.getMonth.mockReturnValue(new Promise(() => { }));

        render(<MonthView year={2026} month={0} />);

        expect(await screen.findByText(/Ładowanie harmonogramu…/i)).toBeInTheDocument();
    });

    it("renders month without meals", async () => {
        scheduleApi.getMonth.mockResolvedValueOnce({
            ...mockSchedule,
            meals: [],
            days: [],
        });

        render(<MonthView year={2026} month={0} />);

        expect(screen.queryByDisplayValue("Śniadanie")).not.toBeInTheDocument();
        expect(await screen.findByText("+ Dodaj posiłek")).toBeInTheDocument();
    });
});