'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import JourneyRoad from '@/components/journey-road';

export function KilnJourney() {
  const root = useRef<HTMLElement>(null);
  const stories = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const stories = gsap.utils.toArray<HTMLElement>('.journey-story');
        stories.forEach((story) => {
          gsap.fromTo(story.querySelector('.journey-story-image'),
            { autoAlpha: 0, y: 38, scale: 0.98 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out',
              scrollTrigger: { trigger: story, start: 'top 82%', once: true } });
          gsap.fromTo(story.querySelector('.journey-story-copy'),
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.65, delay: 0.12, ease: 'power2.out',
              scrollTrigger: { trigger: story, start: 'top 80%', once: true } });
        });
        const progressFill = root.current?.querySelector('.journey-progress-fill');
        if (progressFill && root.current) {
          gsap.fromTo(progressFill, { scaleX: 0 }, {
            scaleX: 1, ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 65%', end: 'bottom 65%', scrub: 0.4 },
          });
        }
      },root);
      return () => ctx.revert();
    });
    return () => media.revert();
  },[]);
  const steps = [
    { title: 'Molding', image: '/Bricks/Molding.jpeg', alt: 'Freshly molded TEJ bricks being handled at the brickworks.', description: 'Local clay is shaped into bricks, giving each one its form and purpose.' },
    { title: 'Stacking before firing', image: '/Bricks/beforefire.jpeg', alt: 'Rows of unfired bricks carefully stacked before entering the kiln.', description: 'The green bricks are arranged in careful rows so heat can move through the kiln.' },
    { title: 'Firing', image: '/Bricks/firing.png', alt: 'Glowing fire inside the brick kiln during firing.', description: 'Kiln heat transforms the shaped clay into strong, durable bricks.' },
    { title: 'Unloading', image: '/Bricks/unloading.jpeg', alt: 'Workers unloading fired bricks from the kiln.', description: 'After cooling, each batch is brought out by hand and prepared for sorting.' },
    { title: 'Storage', image: '/Bricks/storage.jpeg', alt: 'Finished bricks stacked in the TEJ brickworks yard.', description: 'Fired bricks are stacked safely in the yard while they await selection.' },
    { title: 'No. 1 bricks', image: '/Bricks/no1.jpeg', alt: 'Selected No. 1 TEJ bricks stacked in the yard.', description: 'Our first grade is selected for consistent shape and reliable everyday building.' },
    { title: 'No. 2 bricks', image: '/Bricks/no2.jpeg', alt: 'No. 2 bricks stacked at the brickworks.', description: 'A practical choice for projects where a second grade suits the work.' },
    { title: 'Tukra bricks', image: '/Bricks/tukra.jpeg', alt: 'Tukra bricks available at the TEJ brickworks.', description: 'Tukra bricks offer a useful option for the right site and application.' },
    { title: 'Godiya bricks', image: '/Bricks/Godiya.jpeg', alt: 'Godiya bricks stacked at the TEJ brickworks.', description: 'Godiya bricks complete the range, ready to be chosen for your build.' },
    { title: 'Delivery', image: '/Bricks/Delivery.jpeg', alt: 'TEJ bricks being transported from the brickworks for delivery.', description: 'Your order is loaded with care and delivered to your doorstep or building site.' },
  ];
  return <section ref={root} id="factory" className="factory-section section brick-journey">
    <div className="section-heading"><div><span className="eyebrow">FROM CLAY TO CONSTRUCTION</span><h2>MADE HERE.<br/>DELIVERED TO YOU.</h2></div><p>Follow every step<br/>from molding to your doorstep.</p></div>
    <div className="journey-progress" aria-label="Journey progress">
      <span>10 STEPS</span><div className="journey-progress-track"><div className="journey-progress-fill"/></div><span>FROM MOLDING TO DELIVERY</span>
    </div>
    <div ref={stories} className="journey-stories">{steps.map((step, index) => <article id={step.title === 'Delivery' ? 'delivery' : undefined} className="journey-story" key={step.title}>
      <div className="journey-story-image"><Image src={step.image} alt={step.alt} fill unoptimized sizes="(max-width: 700px) 88vw, (max-width: 1000px) 42vw, 50vw" /></div>
      <div className="journey-story-copy"><span className="eyebrow">{String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.description}</p></div>
    </article>)}<JourneyRoad stories={stories}/><p className="journey-road-caption">Delivered & stacked. Ready to build.</p></div>
  </section>;
}

