'use client';
import Link from 'next/link';
import { contact } from '@/lib/contact';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, Mail, Phone } from 'lucide-react';
import WhatsAppIcon from '@/components/whatsapp-icon';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export function SmoothScroll() { const pathname=usePathname(); useEffect(() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; gsap.registerPlugin(ScrollTrigger); const lenis = new Lenis({ autoRaf: true, anchors: true }); lenis.on('scroll', ScrollTrigger.update); const ctx = gsap.context(() => { gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => gsap.fromTo(el, { y: 28, opacity: 0.5 }, { y: 0, opacity: 1, duration: .85, scrollTrigger: { trigger: el, start: 'top 94%', once: true } })); }); return () => { lenis.destroy(); ctx.revert(); }; }, [pathname]); return null; }
const navigation = [
  { id: 'main', label: 'Home', href: '/#main' },
  { id: 'factory', label: 'Process', href: '/#factory' },
  { id: 'collection', label: 'Our Bricks', href: '/#collection' },
  { id: 'contact', label: 'Contact', href: '/#contact' },
];

export function Header() {
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

  return <header ref={header} className={`header ${pathname === '/' ? 'header-home' : ''} ${pathname === '/' && !scrolled ? 'header-transparent' : 'header-solid'}`}>
    <Link className="logo" href="/" aria-label="Shivasakti Etta Udyog — TEJ bricks home"><span>TEJ<span className="logo-dot">▪</span></span><small className="brand-maker">BRICKS BY<strong>Shivasakti<br/>Etta Udyog</strong></small></Link>
    <nav id="main-navigation" aria-label="Main navigation" className={open ? 'nav open' : 'nav'} onClick={() => setOpen(false)} onKeyDown={event => {
      if (event.key === 'Escape') {
        setOpen(false);
        header.current?.querySelector<HTMLButtonElement>('.menu')?.focus();
      }
    }}>
      {navigation.map(item => <Link key={item.id} href={item.href} aria-current={active === item.id ? 'location' : undefined}>{item.label}</Link>)}
    </nav>
    <Link className="button small" href="/enquiry">Get Quote</Link>
    <button className="menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
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
