import { contact } from './contact';

export function buildWhatsAppEnquiry(data: FormData, product: { name: string; grade: string; unit: 'piece' | 'tractor' }) {
  const value = (key: string) => String(data.get(key) ?? '').trim();
  const quantity = Number(value('quantity')).toLocaleString('en-US');
  const message = [
    '*TEJ BRICKS | Quotation Request*',
    '',
    'Hello Shivasakti Etta Udyog,',
    '',
    'I would like to request a quotation for the following requirement.',
    '',
    '*Order Details*',
    `• Product: ${product.name} (${product.grade})`,
    `• Quantity: ${quantity} ${product.unit === 'tractor' ? 'full loaded tractors' : 'pcs'}`,
    `• Delivery Location: ${value('location')}`,
    `• Project Details: ${value('message') || 'Not provided'}`,
    '',
    '*Customer Details*',
    `• Name: ${value('name')}`,
    `• Phone: ${value('phone')}`,
    `• Email: ${value('email') || 'Not provided'}`,
    '',
    'Please confirm the unit price, transportation charges, stock availability and estimated delivery time.',
    '',
    'Thank you.',
    '',
    '_Sent via TEJ Bricks Website_',
  ].join('\n');
  return `${contact.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
