'use client';

import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const cargoPosition = (index: number) => ({ x: -16 + index % 4 * 8, y: 3 - Math.floor(index / 4) * 6 });

export default function JourneyRoad({ stories }: { stories: RefObject<HTMLDivElement | null> }) {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const container = stories.current;
    const drawing = svg.current;
    if (!container || !drawing) return;
    gsap.registerPlugin(ScrollTrigger);
    const road = drawing.querySelector<SVGPathElement>('.journey-road-line')!;
    const edges = drawing.querySelector<SVGPathElement>('.journey-road-edge')!;
    const dashes = drawing.querySelector<SVGPathElement>('.journey-road-dashes')!;
    const truck = drawing.querySelector<SVGGElement>('.journey-road-truck')!;
    const cargo = Array.from(drawing.querySelectorAll<SVGRectElement>('.journey-road-cargo'));
    const flying = Array.from(drawing.querySelectorAll<SVGRectElement>('.journey-road-flying'));
    const stack = Array.from(drawing.querySelectorAll<SVGRectElement>('.journey-road-stack'));
    const media = gsap.matchMedia();
    let resizeFrame = 0;

    media.add({ animated: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      const reduced = Boolean(context.conditions?.reduced);
      const progress = { value: 0 };
      let height = 1, length = 1, storage = 0, loaded = 1, travelEnd = 1;
      let scale = 1, finishX = 0, finishY = 0, width = 1;

      const render = () => {
        const value = reduced ? 1 : progress.value;
        const travel = clamp(value / travelEnd);
        const distance = travel * length;
        const point = road.getPointAtLength(distance);
        const ahead = road.getPointAtLength(Math.min(length, distance + 2));
        const behind = road.getPointAtLength(Math.max(0, distance - 2));
        const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) - Math.PI / 2;
        truck.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle * 180 / Math.PI}) scale(${scale})`);
        const fill = clamp((point.y - storage) / Math.max(1, loaded - storage));
        const unload = clamp((value - travelEnd) / (1 - travelEnd));
        cargo.forEach((brick, index) => {
          // Fill from the bottom; unload from the top into a bottom-up site stack.
          const order = 23 - index;
          const transfer = clamp((unload * 1.65 - order / 24) / .65);
          const visible = fill * 24 >= index + 1;
          brick.setAttribute('opacity', visible && transfer === 0 ? '1' : '0');
          const local = cargoPosition(index);
          const targetX = width - 66 + order % 6 * 8;
          const targetY = finishY + 20 - Math.floor(order / 6) * 6;
          stack[index].setAttribute('x', String(targetX));
          stack[index].setAttribute('y', String(targetY));
          stack[index].setAttribute('opacity', transfer === 1 ? '1' : '0');
          const startX = finishX + (local.x * Math.cos(angle) - local.y * Math.sin(angle)) * scale;
          const startY = finishY + (local.x * Math.sin(angle) + local.y * Math.cos(angle)) * scale;
          flying[index].setAttribute('x', String(startX + (targetX - startX) * transfer));
          flying[index].setAttribute('y', String(startY + (targetY - startY) * transfer - Math.sin(transfer * Math.PI) * 24));
          flying[index].setAttribute('opacity', transfer > 0 && transfer < 1 ? '1' : '0');
        });
      };

      const measure = () => {
        const rows = Array.from(container.querySelectorAll<HTMLElement>('.journey-story'));
        if (rows.length !== 10) return;
        width = container.clientWidth;
        height = container.clientHeight;
        const mobile = window.matchMedia('(max-width:700px)').matches;
        scale = mobile ? .72 : .9;
        const center = mobile ? 26 : width / 2;
        const swing = mobile ? 4 : 18;
        const points = rows.map((row, index) => ({ x: center + (index % 2 ? swing : -swing), y: row.offsetTop + row.offsetHeight / 2 }));
        const last = rows[9];
        finishX = width - 112;
        finishY = last.offsetTop + last.offsetHeight + 80;
        let path = `M ${center} 0`;
        let previous = { x: center, y: 0 };
        for (const point of points) {
          const middle = (previous.y + point.y) / 2;
          path += ` C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
          previous = point;
        }
        path += ` L ${previous.x} ${finishY - 38} Q ${previous.x} ${finishY}, ${previous.x + 38} ${finishY} L ${finishX} ${finishY}`;
        drawing.setAttribute('viewBox', `0 0 ${width} ${height}`);
        for (const element of [edges, road, dashes]) element.setAttribute('d', path);
        length = road.getTotalLength();
        storage = rows[4].offsetTop;
        loaded = rows[8].offsetTop + rows[8].offsetHeight / 2;
        travelEnd = (height - 140) / height;
        render();
      };
      measure();
      const tween = reduced ? null : gsap.to(progress, {
        value: 1, ease: 'none', onUpdate: render,
        scrollTrigger: { trigger: container, start: 'top 60%', end: 'bottom 60%', scrub: .35, onRefresh: measure },
      });
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => { measure(); tween?.scrollTrigger?.refresh(); });
      });
      observer.observe(container);
      return () => { cancelAnimationFrame(resizeFrame); observer.disconnect(); tween?.scrollTrigger?.kill(); tween?.kill(); };
    });
    return () => media.revert();
  }, [stories]);

  return <svg ref={svg} className="journey-road" aria-hidden="true" focusable="false">
    <path className="journey-road-edge" fill="none"/>
    <path className="journey-road-line" fill="none"/>
    <path className="journey-road-dashes" fill="none"/>
    <g className="journey-road-truck">
      <rect x="-23" y="-28" width="6" height="15" rx="2" fill="#292724"/>
      <rect x="17" y="-28" width="6" height="15" rx="2" fill="#292724"/>
      <rect x="-23" y="20" width="6" height="12" rx="2" fill="#292724"/>
      <rect x="17" y="20" width="6" height="12" rx="2" fill="#292724"/>
      <rect x="-19" y="-36" width="38" height="48" rx="2" fill="#b9aa95" stroke="#756b60" strokeWidth="2"/>
      {Array.from({ length: 24 }, (_, index) => <rect key={index} className="journey-road-cargo" {...cargoPosition(index)} width="7" height="5" rx=".5" opacity="0"/>)}
      <rect x="-20" y="14" width="40" height="27" rx="5" fill="#a9472c" stroke="#743621" strokeWidth="1.5"/>
      <path d="M-15 28H15L13 35H-13Z" fill="#b9d0d7"/>
      <path d="M-15 39H-10M10 39H15" stroke="#f8e2af" strokeWidth="3"/>
      <text x="0" y="24" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="Arial" fontWeight="700">TEJ</text>
    </g>
    {Array.from({ length: 24 }, (_, index) => <rect key={`f-${index}`} className="journey-road-flying" width="7" height="5" rx=".5" opacity="0"/>)}
    {Array.from({ length: 24 }, (_, index) => <rect key={`s-${index}`} className="journey-road-stack" width="7" height="5" rx=".5" opacity="0"/>)}
  </svg>;
}
