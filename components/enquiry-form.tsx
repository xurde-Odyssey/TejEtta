'use client';

import { useState } from 'react';
import WhatsAppIcon from '@/components/whatsapp-icon';
import { buildWhatsAppEnquiry } from '@/lib/enquiry-message';
import type { Product } from '@/lib/catalogue';

export default function EnquiryForm({ products, initialGrade, initialQuantity, enabled }: {
  products: Product[]; initialGrade?: string; initialQuantity?: string; enabled: boolean;
}) {
  const [grade, setGrade] = useState(products.some(p => p.id === initialGrade) ? initialGrade! : products[0].id);
  const [quantity, setQuantity] = useState(initialQuantity && /^\d+$/.test(initialQuantity) ? initialQuantity : initialGrade === 'tukra' ? '1' : '1000');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const product = products.find(p => p.id === grade)!;

  function openWhatsApp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('website')) return;
    const url = buildWhatsAppEnquiry(data, product);
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
        body: JSON.stringify({ ...data, quantity: Number(data.quantity), consent: data.consent === 'on' }),
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
    <div className="form-row">
      <label>Brick grade<select name="grade" value={grade} onChange={event => { setGrade(event.target.value); setQuantity(event.target.value === 'tukra' ? '1' : '1000'); }}>{products.map(p => <option key={p.id} value={p.id}>{p.name} · {p.grade}</option>)}</select></label>
      <label>Quantity ({product.unit === 'tractor' ? 'full tractors' : 'pieces'})<input name="quantity" type="number" inputMode="numeric" min="1" max="10000000" step="1" required value={quantity} onChange={event => setQuantity(event.target.value)}/></label>
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
