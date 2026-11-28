'use client';

import { useState } from 'react';
import { contact } from '@/lib/contact';
import WhatsAppIcon from '@/components/whatsapp-icon';

export default function ContactForm() {
  const [messageUrl, setMessageUrl] = useState('');

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? '').trim();
    const message = [
      'Hello TEJ / Shivasakti Etta Udyog,',
      '',
      value('message'),
      '',
      `Name: ${value('name')}`,
      ...(value('phone') ? [`Phone: ${value('phone')}`] : []),
      '',
      'Sent via the TEJ website',
    ].join('\n');
    const url = `${contact.whatsappUrl}?text=${encodeURIComponent(message)}`;
    setMessageUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return <form className="contact-message-form enquiry-form" onSubmit={sendMessage} onChange={() => setMessageUrl('')} aria-labelledby="contact-message-heading">
    <h3 id="contact-message-heading">Send us a message.</h3>
    <p>Questions about our bricks, availability or delivery? Tell us how we can help.</p>
    <div className="form-row">
      <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100} pattern=".*\S.*" placeholder="Full name"/></label>
      <label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" pattern="[+0-9 ()-]{7,20}" placeholder="+977"/></label>
    </div>
    <label>Your message<textarea name="message" required minLength={5} maxLength={2000} rows={5} placeholder="What would you like to know?"/></label>
    <button className="button wide enquiry-whatsapp" type="submit"><WhatsAppIcon/>Continue to WhatsApp</button>
    <p className="enquiry-send-hint">Review your message in WhatsApp, then tap Send.</p>
    <div className="enquiry-status" role="status">{messageUrl && <>Your message is ready to send.<a href={messageUrl} target="_blank" rel="noopener noreferrer">Open your WhatsApp message</a></>}</div>
  </form>;
}
