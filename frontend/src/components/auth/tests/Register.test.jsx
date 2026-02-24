import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Register from "../register/Register";
import * as authApi from "../api/authApi";

vi.mock("../api/authApi");

describe("Register component", () => {
  const mockClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders register form", () => {
    render(<Register onClose={mockClose} />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Hasło")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Zarejestruj" })
    ).toBeInTheDocument();
  });

  it("calls registerUser on submit", async () => {
    authApi.registerUser.mockResolvedValueOnce({});

    render(<Register onClose={mockClose} />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Hasło"), {
      target: { value: "Test1234!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Zarejestruj" })
    );

    await waitFor(() => {
      expect(authApi.registerUser).toHaveBeenCalledWith(
        "test@test.com",
        "Test1234!"
      );
    });

    expect(
      screen.getByText("Konto zostało utworzone")
    ).toBeInTheDocument();
  });

  it("shows error message when register fails", async () => {
    authApi.registerUser.mockRejectedValueOnce(
      new Error("Email już istnieje")
    );

    render(<Register onClose={mockClose} />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "taken@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Hasło"), {
      target: { value: "Test1234!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Zarejestruj" })
    );

    expect(
      await screen.findByText("Email już istnieje")
    ).toBeInTheDocument();
  });
});