import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MonthView from "../components/MonthView/MonthView"
import scheduleApi from "../api/scheduleApi";
import ToastProvider from "../../../ui/toast/context/ToastProvider";
import * as productsModule from "../../../products/hooks/useProducts";

vi.spyOn(productsModule, "useProducts");

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

const mockSchedule = {
    year: 2026,
    month: 0,
    deficitLimit: 2200,
    zeroKcalLimit: 1800,
    meals: [
        { id: "1", name: "Posiłek 1" },
        { id: "2", name: "Posiłek 2" },
    ],
    days: [
        {
            date: "2026-01-05",
            meals: {
                "1": [
                    {
                        name: "Owsianka",
                        weight: 100,
                        kcal: 350,
                        protein: 5,
                        fat: 3,
                        carbs: 55,
                    },
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

    productsModule.useProducts.mockReturnValue({
        products: [],
    });

    scheduleApi.getMonth.mockResolvedValue(mockSchedule);
});

// ==================
// TESTS
// ==================
describe("MonthView component", () => {
    it("shows loading state before data loads", async () => {
        scheduleApi.getMonth.mockReturnValue(new Promise(() => { }));

        render(
            <ToastProvider>
                <MonthView year={2026} month={0} />
            </ToastProvider>
        );

        expect(await screen.findByText(/Ładowanie harmonogramu…/i)).toBeInTheDocument();
    });

    it("renders meals returned from API", async () => {
        render(
            <ToastProvider>
                <MonthView year={2026} month={0} />
            </ToastProvider>
        );

        expect(scheduleApi.getMonth).toHaveBeenCalledWith(2026, 0);

        expect(await screen.findByDisplayValue("Posiłek 1")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Posiłek 2")).toBeInTheDocument();
    });

    it("renders empty month", async () => {
        scheduleApi.getMonth.mockResolvedValueOnce({
            ...mockSchedule,
            meals: [],
            days: [],
        });

        render(
            <ToastProvider>
                <MonthView year={2026} month={0} />
            </ToastProvider>
        );

        expect(screen.queryByDisplayValue("Posiłek 1")).not.toBeInTheDocument();
        expect(await screen.findByText("+ Dodaj posiłek")).toBeInTheDocument();
    });

    it("renders add ingredient buttons for each meal", async () => {
        render(
            <ToastProvider>
                <MonthView year={2026} month={0} />
            </ToastProvider>
        );

        const buttons = await screen.findAllByText("+ Dodaj składnik");
        expect(buttons.length).toBeGreaterThan(0);
    });
});