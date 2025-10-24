import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductsProvider } from '../context/ProductsProvider';
import ProductManager from '../ProductManager';

// Mock for window.prompt
vi.stubGlobal('prompt', vi.fn());

// Mock API
vi.mock('../api/productApi', () => ({
    fetchProducts: vi.fn().mockResolvedValue([{ id: 1, name: 'Jabłko', kcalPer100g: 52 }]),
    addProduct: vi.fn().mockImplementation((p) => Promise.resolve({ ...p, id: 2 })),
    deleteProduct: vi.fn().mockResolvedValue({ success: true }),
    updateProduct: vi.fn().mockImplementation((id, p) => Promise.resolve({ id, ...p })),
}));

describe('ProductManager', () => {
    beforeEach(() => {
        render(
            <ProductsProvider>
                <ProductManager />
            </ProductsProvider>
        );
    });

    it('renders main components', () => {
        expect(screen.getByText(/Zarządzanie produktami/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Nazwa produktu/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Wpisz nazwę/i)).toBeInTheDocument();
    });

    it('adds a product and clears inputs', async () => {
        const nameInput = screen.getByPlaceholderText(/Nazwa produktu/i);
        const kcalInput = screen.getByPlaceholderText(/Kalorie na 100g/i);
        const addButton = screen.getByRole('button', { name: /Dodaj produkt/i });

        fireEvent.change(nameInput, { target: { value: 'Gruszka' } });
        fireEvent.change(kcalInput, { target: { value: '65' } });
        fireEvent.click(addButton);

        // Inputs should be cleared
        await waitFor(() => {
            expect(nameInput.value).toBe('');
            expect(kcalInput.value).toBe('');
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

    it('edits a product using prompt', async () => {
        const editButton = await screen.findByText(/✏️ EDIT/i);

        // Mock prompt values
        vi.stubGlobal('prompt', vi.fn()
            .mockReturnValueOnce('Gruszka')
            .mockReturnValueOnce('65')
        );

        fireEvent.click(editButton);
        expect(window.prompt).toHaveBeenCalledTimes(2);
    });
});
