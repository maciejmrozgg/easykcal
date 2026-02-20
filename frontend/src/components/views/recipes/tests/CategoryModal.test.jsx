import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CategoryModal from "../components/modals/CategoryModal";

// ==================
// TESTS
// ==================
describe("CategoryModal", () => {
  it("does not render when open is false", () => {
    const { container } = render(
      <CategoryModal open={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders add mode correctly", () => {
    render(
      <CategoryModal
        open={true}
        category={null}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Dodaj kategorię")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("renders edit mode with initial data", () => {
    render(
      <CategoryModal
        open={true}
        category={{ id: 1, name: "Obiady" }}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Edytuj kategorię")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Obiady")).toBeInTheDocument();
  });

  it("calls onSave with trimmed name", () => {
    const onSave = vi.fn();

    render(
      <CategoryModal
        open={true}
        category={null}
        onSave={onSave}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  Nowa  " },
    });

    fireEvent.click(screen.getByText("Zapisz"));

    expect(onSave).toHaveBeenCalledWith("Nowa");
  });

  it("calls onDelete when confirmed", () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <CategoryModal
        open={true}
        category={{ id: 1, name: "Obiady" }}
        onSave={vi.fn()}
        onDelete={onDelete}
        onClose={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("Usuń"));

    expect(onDelete).toHaveBeenCalled();
  });
});