'use client';
import Link from 'next/link';
import { contact } from '@/lib/contact';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, Mail, Phone } from 'lucide-react';
import WhatsAppIcon from '@/components/whatsapp-icon';
import { LanguageSwitcher, useLanguage } from '@/components/language-provider';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export function SmoothScroll() { const pathname=usePathname(); useEffect(() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; gsap.registerPlugin(ScrollTrigger); const lenis = new Lenis({ autoRaf: true, anchors: true }); lenis.on('scroll', ScrollTrigger.update); const ctx = gsap.context(() => { gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => gsap.fromTo(el, { y: 28, opacity: 0.5 }, { y: 0, opacity: 1, duration: .85, scrollTrigger: { trigger: el, start: 'top 94%', once: true } })); }); return () => { lenis.destroy(); ctx.revert(); }; }, [pathname]); return null; }
const navigation = [
  { id: 'main', label: 'Home', nepali: 'गृहपृष्ठ', href: '/#main' },
  { id: 'factory', label: 'Process', nepali: 'उत्पादन प्रक्रिया', href: '/#factory' },
  { id: 'collection', label: 'Our Bricks', nepali: 'हाम्रा इट्टाहरू', href: '/#collection' },
  { id: 'contact', label: 'Contact', nepali: 'सम्पर्क', href: '/#contact' },
];

export function Header() {
  const { language } = useLanguage();
  const ne = language === 'ne';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('main');
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = (header.current?.getBoundingClientRect().height ?? 96) + 16;
      document.documentElement.style.setProperty('--header-offset', `${offset}px`);
      setScrolled(window.scrollY > 40);
      let current = pathname === '/' ? 'main' : '';
      const sections = navigation
        .filter(item => pathname === '/' || item.id === 'contact')
        .map(item => document.getElementById(item.id))
        .filter((element): element is HTMLElement => element !== null)
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset + 1) current = section.id;
      }
      // The final section may never reach the header before scrolling ends.
      const contactSection = sections.find(section => section.id === 'contact');
      if (contactSection) {
        const bounds = contactSection.getBoundingClientRect();
        const activationLine = offset + Math.max(0, window.innerHeight - offset) * 0.45;
        const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        if (bounds.top <= activationLine || (atPageEnd && bounds.top < window.innerHeight)) {
          current = 'contact';
        }
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    if (header.current) observer.observe(header.current);
    observer.observe(document.body);
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  return <header lang={language} ref={header} className={`header ${pathname === '/' ? 'header-home' : ''} ${pathname === '/' && !scrolled ? 'header-transparent' : 'header-solid'}`}>
    <Link className="logo" href="/" aria-label={ne ? 'TEJ इट्टा — शिवशक्ति इट्टा उद्योग गृहपृष्ठ' : 'TEJ इट्टा — Shivasakti Etta Udyog home'}><span>TEJ<span className="logo-nepali" lang="ne">इट्टा</span></span><small className="brand-maker">{ne ? 'उत्पादक' : 'BRICKS BY'}<strong>{ne ? 'शिवशक्ति' : 'Shivasakti'}<br/>{ne ? 'इट्टा उद्योग' : 'Etta Udyog'}</strong></small></Link>
    <nav id="main-navigation" aria-label={ne ? 'मुख्य नेभिगेसन' : 'Main navigation'} className={open ? 'nav open' : 'nav'} onClick={() => setOpen(false)} onKeyDown={event => {
      if (event.key === 'Escape') {
        setOpen(false);
        header.current?.querySelector<HTMLButtonElement>('.menu')?.focus();
      }
    }}>
      {navigation.map(item => <Link key={item.id} href={item.href} aria-current={active === item.id ? 'location' : undefined}>{ne ? item.nepali : item.label}</Link>)}
    </nav>
    <div className="header-actions"><LanguageSwitcher/></div>
    <button className="menu" aria-label={ne ? (open ? 'मेनु बन्द गर्नुहोस्' : 'मेनु खोल्नुहोस्') : (open ? 'Close navigation' : 'Open navigation')} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
  </header>;
}
export function Footer() {
  return <>
    <footer className="site-footer">
      <div className="footer-directory">
        <div className="footer-identity">
          <Link className="footer-wordmark" href="/" aria-label="TEJ bricks by Shivasakti Etta Udyog home">TEJ<span>▪</span></Link>
          <span className="footer-product-label">BRICKS BY</span>
          <h3>Shivasakti Etta Udyog</h3>
          <p>Manufacturer of TEJ bricks.<br/>From our factory to your site.</p>
        </div>
        <nav className="footer-navigation" aria-label="Footer navigation"><h3>Explore</h3><Link href="/products">Our bricks</Link><Link href="/#factory">Our factory</Link><Link href="/#delivery">Delivery</Link><Link href="/#pricing">Pricing & estimates</Link><Link href="/#contact">Contact</Link></nav>

      </div>
      <div className="footer-legal"><p>© {new Date().getFullYear()} Shivasakti Etta Udyog. All rights reserved.</p><span>TEJ · Built for strength.</span><a href="#main">Back to top</a></div>
    </footer>
    <nav className="mobile-bar" aria-label="Quick contact">
      <a href={`mailto:${contact.email}`}><Mail size={20} aria-hidden="true"/>Email</a>
      <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>WhatsApp</a>
      <a href={contact.phoneUrl}><Phone size={20} aria-hidden="true"/>Call</a>
    </nav>
  </>;
}
