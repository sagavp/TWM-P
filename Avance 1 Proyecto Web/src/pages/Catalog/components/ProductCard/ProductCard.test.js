import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { expect, test } from 'vitest';
import theme from '../../../../theme/theme';
import ProductCard from './ProductCard';

test('muestra el nombre y el precio del producto', () => {
  render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(ProductCard, {
        product: {
          id: 'cafe',
          name: 'Café En Grano 1 Kg',
          price: 12990,
          image: '/catalog/cafe.jpg',
        },
      }),
    ),
  );

  expect(screen.getByRole('img', { name: 'Café En Grano 1 Kg' })).toBeTruthy();
  expect(screen.getByText('Café En Grano 1 Kg')).toBeTruthy();
  expect(screen.getByText(/\$\s*12[.,]990/)).toBeTruthy();
});
