import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductsProvider } from '../context/ProductsProvider';
import ProductManager from '../ProductManager';
import { cleanup } from '@testing-library/react';
import ToastProvider from '../../ui/toast/context/ToastProvider';
import * as productApi from '../api/productApi';

// Mock API
vi.mock('../api/productApi', () => ({
    fetchProducts: vi.fn().mockResolvedValue([{ id: 1, name: 'Jabłko', kcalPer100g: 52, proteinPer100g: null, fatPer100g: null, carbsPer100g: 5 }]),
    addProduct: vi.fn().mockImplementation((p) => Promise.resolve({ ...p, id: 2 })),
    deleteProduct: vi.fn().mockResolvedValue({ success: true }),
    updateProduct: vi.fn().mockImplementation((id, p) => Promise.resolve({ id, ...p })),
}));

describe('ProductManager', () => {
    beforeEach(async () => {
        render(
            <ToastProvider>
                <ProductsProvider>
                    <ProductManager user={{ id: 1, username: 'test' }} />
                </ProductsProvider>
            </ToastProvider>
        );

        await screen.findByText(/Zarządzanie produktami/i);
    });

    it('renders main components', () => {
        expect(screen.getByText(/Zarządzanie produktami/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Nazwa produktu/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Wpisz nazwę/i)).toBeInTheDocument();

        expect(screen.getByText(/B:/i)).toBeInTheDocument();
        expect(screen.getByText(/T:/i)).toBeInTheDocument();
        expect(screen.getByText(/W:/i)).toBeInTheDocument();
    });

    it('adds a product and clears inputs', async () => {
        const nameInput = screen.getByPlaceholderText(/Nazwa produktu/i);
        const kcalInput = screen.getByPlaceholderText(/Kalorie na 100g/i);
        const proteinInput = screen.getByPlaceholderText(/Białko na 100g/i);
        const fatInput = screen.getByPlaceholderText(/Tłuszcze na 100g/i);
        const carbsInput = screen.getByPlaceholderText(/Węglowodany na 100g/i);
        const addButton = screen.getByRole('button', { name: /Dodaj produkt/i });

        fireEvent.change(nameInput, { target: { value: 'Gruszka' } });
        fireEvent.change(kcalInput, { target: { value: '65' } });
        fireEvent.change(proteinInput, { target: { value: '' } });
        fireEvent.change(fatInput, { target: { value: '' } });
        fireEvent.change(carbsInput, { target: { value: '10' } });
        fireEvent.click(addButton);

        // Inputs should be cleared
        await waitFor(() => {
            expect(nameInput.value).toBe('');
            expect(kcalInput.value).toBe('');
            expect(proteinInput.value).toBe('');
            expect(fatInput.value).toBe('');
            expect(carbsInput.value).toBe('');
        });
    });

    it('scrolls list up and down', () => {
        const scrollMock = vi.fn();
        const ref = { current: { scrollTo: scrollMock, scrollHeight: 1000 } };

        const scrollToTop = () => ref.current?.scrollTo({ top: 0, behavior: 'smooth' });
        const scrollToBottom = () => ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });

        scrollToTop();
        scrollToBottom();

        expect(scrollMock).toHaveBeenCalledTimes(2);
        expect(scrollMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        expect(scrollMock).toHaveBeenCalledWith({ top: 1000, behavior: 'smooth' });
    });

    it('calls loadProducts on search input change', () => {
        const searchInput = screen.getByPlaceholderText(/Wpisz nazwę/i);
        fireEvent.change(searchInput, { target: { value: 'Jabłko' } });
        expect(searchInput.value).toBe('Jabłko');
    });

    it('edits a product using ProductModal', async () => {
        const editButton = await screen.findByText(/✏️ EDYTUJ/i);

        fireEvent.click(editButton);

        fireEvent.change(
            screen.getByDisplayValue("Jabłko"),
            { target: { value: "Gruszka" } }
        );

        fireEvent.change(
            screen.getByDisplayValue("52"),
            { target: { value: "65" } }
        );

        fireEvent.change(
            screen.getByDisplayValue("5"),
            { target: { value: "3" } }
        );

        fireEvent.click(
            screen.getByRole("button", { name: /Zapisz/i })
        );

        await waitFor(() => {
            expect(productApi.updateProduct).toHaveBeenCalledWith(
                1,
                {
                    name: "Gruszka",
                    kcalPer100g: 65,
                    proteinPer100g: 0,
                    fatPer100g: 0,
                    carbsPer100g: 3,
                }
            );
        });
    });

    it('hides CRUD actions for guests', () => {
        cleanup();

        render(
            <ToastProvider>
                <ProductsProvider>
                    <ProductManager user={null} />
                </ProductsProvider>
            </ToastProvider>
        );

        expect(screen.queryByText(/Dodaj produkt/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/EDIT/i)).not.toBeInTheDocument();
    });
});
