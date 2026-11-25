import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { contact } from '@/lib/contact';

export default function ContactDetails() {
  return <address className="contact-details">
    <a href={contact.locationUrl} target="_blank" rel="noopener noreferrer"><MapPin size={20} aria-hidden="true"/><span><small>Visit our office</small>{contact.office}<span className="contact-action">View location</span></span></a>
    <a href={`mailto:${contact.email}`}><Mail size={20} aria-hidden="true"/><span><small>Email us</small>{contact.email}</span></a>
    <a href={contact.phoneUrl}><Phone size={20} aria-hidden="true"/><span><small>Call us</small>{contact.phone}</span></a>
    <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true"/><span><small>Chat with Shivasakti Etta Udyog</small>WhatsApp</span></a>
  </address>;
}
