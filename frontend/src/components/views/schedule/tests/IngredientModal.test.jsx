import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import IngredientModal from "../components/modals/IngredientModal";

describe("IngredientModal", () => {
  it("does not render when open=false", () => {
    render(
      <IngredientModal
        open={false}
        initialData={null}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.queryByText(/Dodaj składnik/i)).not.toBeInTheDocument();
  });

  it("renders add ingredient mode when no initialData", () => {
    render(
      <IngredientModal
        open={true}
        initialData={null}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Dodaj składnik")).toBeInTheDocument();
    expect(screen.queryByText("Usuń")).not.toBeInTheDocument();
  });

  it("renders edit ingredient mode when initialData is provided", () => {
    render(
      <IngredientModal
        open={true}
        initialData={{ name: "Ryż", weight: 200, kcal: 260 }}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Edytuj składnik")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Ryż")).toBeInTheDocument();
    expect(screen.getByDisplayValue("200")).toBeInTheDocument();
    expect(screen.getByDisplayValue("260")).toBeInTheDocument();
    expect(screen.getByText("Usuń")).toBeInTheDocument();
  });

  it("calls onSave with correct data", () => {
    const onSave = vi.fn();

    render(
      <IngredientModal
        open={true}
        initialData={null}
        onSave={onSave}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/Nazwa/i), {
      target: { value: "Owsianka" },
    });
    fireEvent.change(screen.getByLabelText(/Waga/i), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText(/Kalorie/i), {
      target: { value: "350" },
    });

    fireEvent.click(screen.getByText("Zapisz"));

    expect(onSave).toHaveBeenCalledWith({
      name: "Owsianka",
      weight: 100,
      kcal: 350,
    });
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();

    render(
      <IngredientModal
        open={true}
        initialData={{ name: "Ryż", weight: 200, kcal: 260 }}
        onSave={vi.fn()}
        onDelete={onDelete}
        onClose={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("Usuń"));

    expect(onDelete).toHaveBeenCalled();
  });

  it("calls onClose when clicking cancel button", () => {
    const onClose = vi.fn();

    render(
      <IngredientModal
        open={true}
        initialData={null}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Anuluj"));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking backdrop", () => {
    const onClose = vi.fn();

    render(
      <IngredientModal
        open={true}
        initialData={null}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={onClose}
      />
    );

    fireEvent.click(document.querySelector(".modal-backdrop"));

    expect(onClose).toHaveBeenCalled();
  });
});