import { expect, test } from 'vitest';
import { clampRut, rutLimitMessage } from './rut';

test('acepta un RUT de hasta 10 dígitos y recorta el resto', () => {
  expect(rutLimitMessage('12.345.678-9')).toBe('');
  expect(rutLimitMessage('76.123.456-7')).toBe('');
  expect(rutLimitMessage('12345678-K')).toBe('');
  expect(rutLimitMessage('12345678901')).toBe('El RUT admite como máximo 10 dígitos');
  expect(clampRut('12.345.678-9')).toBe('12.345.678-9');
  expect(clampRut('12345678901')).toBe('1234567890');
  expect(clampRut('12.345.678-k')).toBe('12.345.678-K');
});
