/* global vi, test, expect */
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from '../Calculator';
import * as useProductsModule from '../../../features/products/useProducts';
import * as apiModule from '../api/calculatorApi'; 

vi.spyOn(useProductsModule, 'useProducts').mockReturnValue({ products: [] });

// mockujemy calculateCalories
vi.spyOn(apiModule, 'calculateCalories').mockImplementation(async (kcalPer100g, weight) => {
  return (kcalPer100g * weight) / 100; 
});

const addProductMock = vi.fn();

test('manual input: calculates calories', async () => {
  render(<Calculator addProduct={addProductMock} />);

  fireEvent.click(screen.getByText('Wpisz kalorie ręcznie'));
  fireEvent.change(screen.getByPlaceholderText('Wpisz kalorie na 100g...'), { target: { value: '200' } });
  fireEvent.change(screen.getByPlaceholderText('Wprowadź wagę...'), { target: { value: '50' } });
  fireEvent.click(screen.getByText('Oblicz'));

  const result = await screen.findByText('100 kcal');
  expect(result).toBeInTheDocument();
  expect(addProductMock).toHaveBeenCalledWith(expect.objectContaining({ result: 100 }));
});
