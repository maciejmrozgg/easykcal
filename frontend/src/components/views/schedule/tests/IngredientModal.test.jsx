import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import IngredientModal from "../components/modals/IngredientModal";
import * as productsModule from "../../../products/hooks/useProducts";

vi.spyOn(productsModule, "useProducts");

beforeEach(() => {
  vi.clearAllMocks();

  productsModule.useProducts.mockReturnValue({
    products: [],
  });
});

const riceProduct = {
  id: 1,
  name: "Ryż",
  kcalPer100g: 350,
  proteinPer100g: 8,
  fatPer100g: 1,
  carbsPer100g: 75,
};

const riceScheduleIngredient = {
  name: "Ryż",
  weight: 100,
  kcal: 350,
  protein: 8,
  fat: 1,
  carbs: 75,
  productId: "1",
};

const editedIngredient = {
  name: "Ryż",
  weight: 200,
  kcal: 260,
  protein: 10,
  fat: 2,
  carbs: 70,
};

const manualIngredient = {
  name: "Owsianka",
  weight: 100,
  kcal: 350,
  protein: 5,
  fat: 3,
  carbs: 15,
  productId: null,
};

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

  it("shows manual source badge by default", () => {
    render(
      <IngredientModal
        open={true}
        initialData={null}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("📝 Ręczny składnik")).toBeInTheDocument();
  });

  it("shows product source badge for ingredient from database", () => {
    productsModule.useProducts.mockReturnValue({
      products: [riceProduct],
    });

    render(
      <IngredientModal
        open={true}
        initialData={riceScheduleIngredient}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("📦 Produkt z bazy")).toBeInTheDocument();
  });

  it("fills kcal and macros after selecting product from database", () => {
    productsModule.useProducts.mockReturnValue({
      products: [riceProduct],
    });

    render(
      <IngredientModal
        open={true}
        initialData={null}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/Produkt z bazy/i), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByLabelText(/Waga/i), {
      target: { value: "200" },
    });

    expect(screen.getByLabelText(/Nazwa/i)).toHaveValue("Ryż");
    expect(screen.getByLabelText(/Kalorie/i)).toHaveValue(700);
    expect(screen.getByLabelText(/Białko/i)).toHaveValue(16);
    expect(screen.getByLabelText(/Tłuszcz/i)).toHaveValue(2);
    expect(screen.getByLabelText(/Węglowodany/i)).toHaveValue(150);

  });

  it("renders edit ingredient mode when initialData is provided", () => {
    render(
      <IngredientModal
        open={true}
        initialData={editedIngredient}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Edytuj składnik")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nazwa/i)).toHaveValue("Ryż");
    expect(screen.getByLabelText(/Waga/i)).toHaveValue(200);
    expect(screen.getByLabelText(/Kalorie/i)).toHaveValue(260);
    expect(screen.getByLabelText(/Białko/i)).toHaveValue(10);
    expect(screen.getByLabelText(/Tłuszcz/i)).toHaveValue(2);
    expect(screen.getByLabelText(/Węglowodany/i)).toHaveValue(70);
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
    fireEvent.change(screen.getByLabelText(/Białko/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/Tłuszcz/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/Węglowodany/i), {
      target: { value: "15" },
    });

    fireEvent.click(screen.getByText("Zapisz"));

    expect(onSave).toHaveBeenCalledWith(manualIngredient);
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();

    render(
      <IngredientModal
        open={true}
        initialData={editedIngredient}
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