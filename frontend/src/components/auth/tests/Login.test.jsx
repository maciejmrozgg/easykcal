import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Login from "../login/Login";
import * as authApi from "../api/authApi";

vi.mock("../api/authApi");

describe("Login component", () => {
  const mockClose = vi.fn();
  const mockLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    render(
      <Login onLoginSuccess={mockLoginSuccess} onClose={mockClose} />
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Hasło")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Zaloguj" })
    ).toBeInTheDocument();
  });

  it("calls onClose when cancel clicked", () => {
    render(
      <Login onLoginSuccess={mockLoginSuccess} onClose={mockClose} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Anuluj" })
    );

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("logs in successfully", async () => {
    authApi.loginUser.mockResolvedValueOnce({
      user: { id: 1, email: "test@test.com" },
    });

    render(
      <Login onLoginSuccess={mockLoginSuccess} onClose={mockClose} />
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Hasło"), {
      target: { value: "Test1234!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Zaloguj" })
    );

    await waitFor(() => {
      expect(authApi.loginUser).toHaveBeenCalledWith(
        "test@test.com",
        "Test1234!"
      );

      expect(mockLoginSuccess).toHaveBeenCalledWith({
        id: 1,
        email: "test@test.com",
      });
    });

    expect(
      screen.getByText("Zalogowano pomyślnie")
    ).toBeInTheDocument();
  });

  it("shows error message on failed login", async () => {
    authApi.loginUser.mockRejectedValueOnce(
      new Error("Błędne dane logowania")
    );

    render(
      <Login onLoginSuccess={mockLoginSuccess} onClose={mockClose} />
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "wrong@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Hasło"), {
      target: { value: "Wrong123!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Zaloguj" })
    );

    expect(
      await screen.findByText("Błędne dane logowania")
    ).toBeInTheDocument();
  });
});