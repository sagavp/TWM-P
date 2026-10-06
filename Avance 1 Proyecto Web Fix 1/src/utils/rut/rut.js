const MAX_DIGITS = 10;

export function rutDigitCount(value) {
  return (String(value).match(/\d/g) || []).length;
}

export function clampRut(value) {
  let digits = 0;
  let result = '';
  let hasCheck = false;

  for (const char of String(value)) {
    if (char >= '0' && char <= '9') {
      if (hasCheck || digits >= MAX_DIGITS) continue;
      digits += 1;
      result += char;
    } else if (char === '.' || char === '-') {
      result += char;
    } else if ((char === 'k' || char === 'K') && !hasCheck) {
      hasCheck = true;
      result += 'K';
    }
  }

  return result;
}

export function rutLimitMessage(value) {
  const text = String(value).trim();
  if (text === '') return '';
  const body = text.replace(/[.\-]/g, '');
  if (rutDigitCount(text) > MAX_DIGITS || !/^\d{1,10}K?$/.test(body)) {
    return 'El RUT admite como máximo 10 dígitos';
  }
  return '';
}
