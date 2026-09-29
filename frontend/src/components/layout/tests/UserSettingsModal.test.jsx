import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserSettingsModal from "../modals/UserSettingsModal";
import ToastProvider from "../../ui/toast/context/ToastProvider";
import userSettingsApi from "../api/userSettingsApi";

vi.spyOn(userSettingsApi, "getUserSettings");
vi.spyOn(userSettingsApi, "updateUserSettings");

beforeEach(() => {
    vi.clearAllMocks();

    userSettingsApi.getUserSettings.mockResolvedValue({
        goal: "maintenance",
        calorie_target: 2000,
        protein_target: 150,
        fat_target: 70,
        carbs_target: 400,
        copy_targets_to_new_months: true
    });

    userSettingsApi.updateUserSettings.mockResolvedValue({
        goal: "mass",
        calorie_target: 3500,
        protein_target: 170,
        fat_target: 80,
        carbs_target: 430,
        copy_targets_to_new_months: true
    });
});

// Tests
describe("UserSettingsModal rendering and interactions", () => {
    it("renders modal", async () => {
        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={vi.fn()}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        expect(screen.queryByText(/Ustawienia użytkownika/i)).toBeInTheDocument();
    });

    it("does not render when open=false", () => {
        render(
            <ToastProvider>
                <UserSettingsModal
                    open={false}
                    onClose={vi.fn()}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        expect(screen.queryByText(/Ustawienia użytkownika/i)).not.toBeInTheDocument();
    });

    it("calls onClose when clicking cancel button", async () => {
        const onClose = vi.fn();

        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={onClose}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        fireEvent.click(screen.getByText("Anuluj"));

        expect(onClose).toHaveBeenCalled();
    });

    it("calls mockUpdateUserSettings after saving settings", async () => {
        const mockUpdateUserSettings = vi.fn();

        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={vi.fn()}
                    updateUserSettings={mockUpdateUserSettings}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        fireEvent.click(screen.getByText("Zapisz"));

        await waitFor(() => {
            expect(mockUpdateUserSettings).toHaveBeenCalledWith(
                {
                    goal: "mass",
                    calorie_target: 3500,
                    protein_target: 170,
                    fat_target: 80,
                    carbs_target: 430,
                    copy_targets_to_new_months: true
                }
            );
        });
    });
});

describe("UserSettingsModal frontend validation ", () => {
    it("allows all targets to be null", async () => {
        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={vi.fn()}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        fireEvent.change(screen.getByLabelText(/Kalorie/i), {
            target: { value: "" },
        });
        fireEvent.change(screen.getByLabelText(/Białko/i), {
            target: { value: "" },
        });
        fireEvent.change(screen.getByLabelText(/Tłuszcze/i), {
            target: { value: "" },
        });
        fireEvent.change(screen.getByLabelText(/Węglowodany/i), {
            target: { value: "" },
        });

        fireEvent.click(screen.getByText("Zapisz"));
        await waitFor(() => {
            expect(userSettingsApi.updateUserSettings).toHaveBeenCalledWith({
                goal: "maintenance",
                calorie_target: null,
                protein_target: null,
                fat_target: null,
                carbs_target: null,
                copy_targets_to_new_months: true
            });
        });
    });

    it("shows error when only some targets are null", async () => {
        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={vi.fn()}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        fireEvent.change(screen.getByLabelText(/Kalorie/i), {
            target: { value: "" },
        });

        fireEvent.click(screen.getByText("Zapisz"));

        await waitFor(() => {
            expect(screen.getByText("Proszę ustawić wszystkie cele żywieniowe")).toBeInTheDocument();
        });

        expect(userSettingsApi.updateUserSettings).not.toHaveBeenCalled();
    });

    it("allows all targets to be positive integers", async () => {
        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={vi.fn()}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        fireEvent.change(screen.getByLabelText(/Kalorie/i), {
            target: { value: 12 },
        });
        fireEvent.change(screen.getByLabelText(/Białko/i), {
            target: { value: 34 },
        });
        fireEvent.change(screen.getByLabelText(/Tłuszcze/i), {
            target: { value: 56 },
        });
        fireEvent.change(screen.getByLabelText(/Węglowodany/i), {
            target: { value: 78 },
        });

        fireEvent.click(screen.getByText("Zapisz"));
        await waitFor(() => {
            expect(userSettingsApi.updateUserSettings).toHaveBeenCalledWith({
                goal: "maintenance",
                calorie_target: 12,
                protein_target: 34,
                fat_target: 56,
                carbs_target: 78,
                copy_targets_to_new_months: true
            });
        });
    });

    it("shows error when one target is negative", async () => {
        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={vi.fn()}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        fireEvent.change(screen.getByLabelText(/Kalorie/i), {
            target: { value: -12 },
        });

        fireEvent.click(screen.getByText("Zapisz"));

        await waitFor(() => {
            expect(screen.getByText("Wprowadzono niepoprawne wartości dla celów żywieniowych")).toBeInTheDocument();
        });

        expect(userSettingsApi.updateUserSettings).not.toHaveBeenCalled();
    });

    it("shows error when one target is 0", async () => {
        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={vi.fn()}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        fireEvent.change(screen.getByLabelText(/Kalorie/i), {
            target: { value: 0 },
        });

        fireEvent.click(screen.getByText("Zapisz"));

        await waitFor(() => {
            expect(screen.getByText("Wprowadzono niepoprawne wartości dla celów żywieniowych")).toBeInTheDocument();
        });

        expect(userSettingsApi.updateUserSettings).not.toHaveBeenCalled();
    });

    it("shows error when one target is a decimal", async () => {
        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={vi.fn()}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        fireEvent.change(screen.getByLabelText(/Kalorie/i), {
            target: { value: 1.2 },
        });

        fireEvent.click(screen.getByText("Zapisz"));

        await waitFor(() => {
            expect(screen.getByText("Wprowadzono niepoprawne wartości dla celów żywieniowych")).toBeInTheDocument();
        });

        expect(userSettingsApi.updateUserSettings).not.toHaveBeenCalled();
    });

    it("shows error when one target is not a number", async () => {
        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={vi.fn()}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        fireEvent.change(screen.getByLabelText(/Kalorie/i), {
            target: { value: "1.2" },
        });

        fireEvent.click(screen.getByText("Zapisz"));

        await waitFor(() => {
            expect(screen.getByText("Wprowadzono niepoprawne wartości dla celów żywieniowych")).toBeInTheDocument();
        });

        expect(userSettingsApi.updateUserSettings).not.toHaveBeenCalled();
    });

    it("shows error when API update fails", async () => {
        userSettingsApi.updateUserSettings.mockRejectedValue(
            new Error("Failed to update user settings")
        );

        render(
            <ToastProvider>
                <UserSettingsModal
                    open={true}
                    onClose={vi.fn()}
                    updateUserSettings={vi.fn()}
                />
            </ToastProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Utrzymanie")).toBeChecked();
        });

        fireEvent.change(screen.getByLabelText(/Kalorie/i), {
            target: { value: 12 },
        });
        fireEvent.change(screen.getByLabelText(/Białko/i), {
            target: { value: 34 },
        });
        fireEvent.change(screen.getByLabelText(/Tłuszcze/i), {
            target: { value: 56 },
        });
        fireEvent.change(screen.getByLabelText(/Węglowodany/i), {
            target: { value: 78 },
        });

        fireEvent.click(screen.getByText("Zapisz"));

        await waitFor(() => {
            expect(screen.getByText("Failed to update user settings")).toBeInTheDocument();
        });
    });
})