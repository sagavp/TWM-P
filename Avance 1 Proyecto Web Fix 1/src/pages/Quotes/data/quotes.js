import { addDays, formatIso } from '../quoteRules/quoteRules';

export function buildSeedQuotes(today = new Date()) {
  const fecha = formatIso(today);
  return [
    {
      id: 1,
      fecha,
      estado: 'Solicitada',
      items: [
        {
          key: 'seed-1',
          tipo: 'producto',
          productId: 'notebook',
          observacion: 'Entrega en el colegio',
          cantidad: 1,
          precioUnitario: 549990,
        },
      ],
      descuento: 0,
      solicitudDescuento: '',
      notas: '',
    },
    {
      id: 2,
      fecha: addDays(fecha, -20),
      estado: 'Respondida',
      items: [
        {
          key: 'seed-2',
          tipo: 'servicio',
          productId: 'aseo',
          observacion: 'Aseo semanal',
          cantidad: 2,
          precioUnitario: 20000,
        },
      ],
      descuento: 0,
      solicitudDescuento: '',
      notas: '',
    },
  ];
}
