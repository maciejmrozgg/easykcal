import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Register from "../register/Register";
import * as authApi from "../api/authApi";
import ToastProvider from "../../ui/toast/context/ToastProvider";

vi.mock("../api/authApi");

describe("Register component", () => {
  const mockClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders register form", () => {
    render(
      <ToastProvider>
        <Register onClose={mockClose} />
      </ToastProvider>
    );


    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Hasło")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Zarejestruj" })
    ).toBeInTheDocument();
  });

  it("calls registerUser on submit", async () => {
    authApi.registerUser.mockResolvedValueOnce({});

    render(
      <ToastProvider>
        <Register onClose={mockClose} />
      </ToastProvider>
    );

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
  });

  it("handles failed registration attempt", async () => {
    authApi.registerUser.mockRejectedValueOnce(
      new Error("Email już istnieje")
    );

    render(
      <ToastProvider>
        <Register onClose={mockClose} />
      </ToastProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "taken@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Hasło"), {
      target: { value: "Test1234!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Zarejestruj" })
    );

    await waitFor(() => {
      expect(authApi.registerUser).toHaveBeenCalledWith(
        "taken@test.com",
        "Test1234!"
      )
    })

  });
});