import { expect, test } from 'vitest';
import {
  addDays,
  displayedUnitPrice,
  expirationIso,
  shouldDeleteQuote,
} from './quoteRules';

test('mantiene el precio 15 días, lo ajusta después y elimina la cotización a los 45', () => {
  const fecha = '2026-09-01';

  expect(expirationIso(fecha)).toBe('2026-09-16');
  expect(displayedUnitPrice(20000, 25000, fecha, '2026-09-16')).toBe(20000);
  expect(displayedUnitPrice(20000, 25000, fecha, addDays(fecha, 16))).toBe(25000);
  expect(shouldDeleteQuote(fecha, addDays(fecha, 45))).toBe(false);
  expect(shouldDeleteQuote(fecha, addDays(fecha, 46))).toBe(true);
});
