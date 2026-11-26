'use client';

import { useRef, useState } from 'react';
import WhatsAppIcon from '@/components/whatsapp-icon';
import { buildWhatsAppEnquiry } from '@/lib/enquiry-message';
import type { Product } from '@/lib/catalogue';

export default function EnquiryForm({ products, initialGrade, initialQuantity, enabled }: {
  products: Product[]; initialGrade?: string; initialQuantity?: string; enabled: boolean;
}) {
  const nextItemId = useRef(1);
  const [items, setItems] = useState(() => {
    const product = products.find(p => p.id === initialGrade) || products[0];
    return [{ id: 0, grade: product.id, quantity: initialQuantity && /^\d+$/.test(initialQuantity) ? initialQuantity : product.unit === 'tractor' ? '1' : '1000' }];
  });
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  function clearStatus() {
    setStatus('');
    setWhatsappUrl('');
  }

  function addProduct() {
    const product = products.find(p => !items.some(item => item.grade === p.id));
    if (!product) return;
    setItems([...items, { id: nextItemId.current++, grade: product.id, quantity: product.unit === 'tractor' ? '1' : '1000' }]);
    clearStatus();
  }

  function openWhatsApp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('website')) return;
    const url = buildWhatsAppEnquiry(data, items.map(item => ({ product: products.find(p => p.id === item.grade)!, quantity: Number(item.quantity) })));
    setWhatsappUrl(url);
    setStatus('Your message is ready. Tap Send in WhatsApp to share your enquiry.');
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function sendOnline(form: HTMLFormElement) {
    if (!form.reportValidity()) return;
    setBusy(true);
    setStatus('');
    setWhatsappUrl('');
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, items: items.map(({ grade, quantity }) => ({ grade, quantity: Number(quantity) })), consent: data.consent === 'on' }),
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error || 'Unable to send your enquiry. Please try again.');
      setStatus('Your enquiry has been received. Our team will review your details and get in touch.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send. Please try WhatsApp.');
    } finally { setBusy(false); }
  }

  return <form className="enquiry-form" onSubmit={openWhatsApp} onChange={() => { setStatus(''); setWhatsappUrl(''); }}>
    <div className="enquiry-form-heading"><h2>Your enquiry</h2><p>A few details to help us quote accurately.</p></div>
    <div className="form-row">
      <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Full name"/></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" pattern="[+0-9 ()-]{7,20}" required placeholder="+977"/></label>
    </div>
    <div className="enquiry-products" role="group" aria-label="Products for your enquiry">
      {items.map((item, index) => {
        const product = products.find(p => p.id === item.grade)!;
        return <div className="enquiry-product" key={item.id}>
          <div className="enquiry-product-heading"><span>Product {index + 1}</span>{items.length > 1 && <button type="button" aria-label={`Remove product ${index + 1}`} onClick={() => { setItems(items.filter(row => row.id !== item.id)); clearStatus(); }}>Remove</button>}</div>
          <div className="form-row">
            <label>Brick grade<select name={`grade-${item.id}`} value={item.grade} onChange={event => {
              const selected = products.find(p => p.id === event.target.value)!;
              setItems(items.map(row => row.id === item.id ? { ...row, grade: selected.id, quantity: selected.unit === 'tractor' ? '1' : '1000' } : row));
            }}>{products.map(p => <option key={p.id} value={p.id} disabled={items.some(row => row.id !== item.id && row.grade === p.id)}>{p.name} · {p.grade}</option>)}</select></label>
            <label>Quantity ({product.unit === 'tractor' ? 'full tractors' : 'pieces'})<input name={`quantity-${item.id}`} type="number" inputMode="numeric" min="1" max="10000000" step="1" required value={item.quantity} onChange={event => setItems(items.map(row => row.id === item.id ? { ...row, quantity: event.target.value } : row))}/></label>
          </div>
        </div>;
      })}
      <button className="enquiry-add-product" type="button" onClick={addProduct} disabled={items.length >= products.length}><span aria-hidden="true">+</span> Add product</button>
    </div>
    <label>Delivery location<input name="location" required minLength={3} maxLength={250} placeholder="Town, district or site address" autoComplete="street-address"/></label>
    <label>Email <span>(optional)</span><input name="email" type="email" autoComplete="email" maxLength={200} placeholder="you@example.com"/></label>
    <label>Project notes <span>(optional)</span><textarea name="message" rows={3} maxLength={2000} placeholder="Delivery date, site access or anything else…"/></label>
    <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <label className="consent"><input name="consent" type="checkbox" required/><span>I agree to share these details with Shivasakti Etta Udyog for a quotation.</span></label>
    <button disabled={busy} className="button wide enquiry-whatsapp" type="submit"><WhatsAppIcon/>Continue to WhatsApp</button>
    <p className="enquiry-send-hint">Review your message in WhatsApp, then tap Send.</p>
    {enabled && <button disabled={busy} className="enquiry-online" type="button" onClick={event => void sendOnline(event.currentTarget.form!)}>{busy ? 'Sending…' : 'Send directly through the website instead'}</button>}
    <div role="status" className="enquiry-status">{status}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Open your WhatsApp message</a>}</div>
  </form>;
}
