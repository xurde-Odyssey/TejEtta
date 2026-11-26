'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Box, Check, Copy, Flame, Rotate3D, ShieldCheck, Truck } from 'lucide-react';
import type { Product } from '@/lib/catalogue';
import { contact } from '@/lib/contact';
import ContactDetails from '@/components/contact-details';
import { productImages } from '@/lib/seo';
import BrickViewer from '@/components/brick-viewer';
export const money=(n:number)=>new Intl.NumberFormat('en-NP',{minimumFractionDigits:0,maximumFractionDigits:1}).format(n);
export function Hero({product}:{product?:Product}) {
  const reduce=useReducedMotion();
  return <section className="hero hero-photographic hero-featured">
    <div className="hero-photo" aria-hidden="true"><Image src="/brickstacks.jpeg" alt="" fill priority sizes="100vw"/></div>
    <div className="hero-feature-grid">
      <div className="hero-feature-copy">
        <div className="hero-heading"><motion.h1 initial={reduce?false:{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.8}}>BUILT FOR<br/><span>STRENGTH.</span></motion.h1><noscript><style>{`.hero-heading h1{opacity:1!important;transform:none!important}`}</style></noscript></div>
        <div className="hero-difference">
          <h2>Why choose TEJ?</h2>
          <p>Made in Nepal by Shivasakti Etta Udyog, TEJ red clay bricks bring together kiln-fired clay, a choice of grades for different building needs, and the distinctive TEJ stamp. Our No. 1 brick offers a uniform form and an exposed clay finish for masonry you want to show.</p>
        </div>
        <div className="hero-actions"><Link className="button" href="#collection">Explore Bricks</Link><Link className="text-link" href="/enquiry">Get Quote</Link></div>
      </div>
      {product&&<section className="hero-product-card" aria-labelledby="hero-product-title">
        <div className="hero-product-heading"><div><span className="eyebrow">EXPLORE IN 360°</span><h2 id="hero-product-title">{product.name}</h2></div></div>
        <div className="hero-product-viewer"><BrickViewer color={product.color}/></div>
        <dl className="hero-product-specs">
          <div><dt>Dimensions · L × W × H</dt><dd>10 × 5 × 3 <small>inches</small></dd></div>
          <div><dt>Price per {product.unit}</dt><dd>{product.price!==null?`Rs. ${money(product.price)}`:'On request'}</dd></div>
        </dl>
        <p className="hero-product-note">VAT-inclusive indicative rate. Confirm dimensions and final pricing when ordering. 3D model is illustrative.</p>
        <Link className="text-link" href="/enquiry?grade=first">Enquire about No. 1 Brick</Link>
      </section>}
    </div>
    <div className="hero-bottom"><a className="scroll-cue" href="#factory"><span className="scroll-cue-label">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></span></a></div>
  </section>;
}
export function Collection({products,full=false}:{products:Product[];full?:boolean}) {
  const [active,setActive]=useState(products[0]);
  const reduce=useReducedMotion();
  const Heading = full ? 'h1' : 'h2';
  const ProductHeading = full ? 'h2' : 'h3';
  // Keep every grade in server HTML; tabs enhance the same content for all visitors.
  useEffect(() => {
    const selectHash = () => {
      const product = products.find(p => `#product-${p.id}` === window.location.hash);
      if (product) setActive(product);
    };
    selectHash();
    window.addEventListener('hashchange', selectHash);
    return () => window.removeEventListener('hashchange', selectHash);
  }, [products]);
  return <section className={'collection section '+(full?'collection-full':'')} id="collection">
    <div className="section-heading" data-reveal><div><span className="eyebrow">THE TEJ COLLECTION</span><Heading className="collection-heading">CHOOSE YOUR<br/><em>STRENGTH.</em></Heading></div><p>Red clay brick grades for your project.<br/>Compare TEJ bricks, prices and applications.</p></div>
    <div className="product-tabs" role="tablist" aria-label="Brick grades">{products.map(p=><button key={p.id} role="tab" tabIndex={p.id===active.id?0:-1} onKeyDown={e=>{
      const i=products.findIndex(x=>x.id===active.id);let next=-1;
      if(e.key==='ArrowRight')next=(i+1)%products.length;
      if(e.key==='ArrowLeft')next=(i+products.length-1)%products.length;
      if(e.key==='Home')next=0;if(e.key==='End')next=products.length-1;
      if(next>=0){e.preventDefault();setActive(products[next]);document.getElementById(`tab-${products[next].id}`)?.focus()}
    }} id={`tab-${p.id}`} aria-selected={p.id===active.id} aria-controls={`product-${p.id}`} onClick={()=>setActive(p)}>{p.grade}</button>)}</div>
    {products.map(p=><div key={p.id} className="product-panel" id={`product-${p.id}`} role="tabpanel" tabIndex={0} aria-labelledby={`tab-${p.id}`} data-active={p.id===active.id}>
      <div className="collection-visual"><span className="eyebrow visual-label">FROM FACTORY TO YOUR DESIRED LOCATION</span>
        <motion.div className="grade-brick" initial={false} animate={{opacity:p.id===active.id?1:0,y:reduce||p.id===active.id?0:8}} transition={{duration:.35}}>
          <Image src={productImages[p.id]} alt={`${p.name} — TEJ ${p.grade.toLowerCase()} clay brick${p.id==='tukra'?' material':''}`} fill sizes="(max-width: 700px) 88vw, 50vw" className={`showcase-product-image showcase-${p.id}`}/>
        </motion.div>
        {p.id!=='tukra'&&p.id!=='first'&&p.id!=='picket'&&<span className="rotate-hint"><Rotate3D size={16}/> 360° product exploration</span>}
      </div>
      <motion.div className="product-details" initial={false} animate={{opacity:p.id===active.id?1:0,y:reduce||p.id===active.id?0:10}} transition={{duration:.2}}>
        <ProductHeading className="product-name">{p.name}</ProductHeading><p>{p.description}</p>
        <dl><div><dt>Recommended for</dt><dd>{p.application}</dd></div><div><dt>Sold by</dt><dd>{p.unit==='piece'?'Piece':'Full loaded tractor'}</dd></div><div><dt>Material</dt><dd>Kiln-fired clay</dd></div></dl>
        <div className="product-price">{p.price!==null?<><strong>Rs. {money(p.price)}</strong><span>per {p.unit==='piece'?'brick':'full loaded tractor'}</span></>:<strong>Price on request</strong>}<small>{p.price!==null?'VAT-inclusive indicative rate':'Price on request'}</small></div>
        <Link href={`/enquiry?grade=${p.id}`} className="button">Enquire about {p.name}</Link>
      </motion.div>
    </div>)}
    <noscript><style>{`.product-tabs{display:none!important}.product-panel[data-active="false"]{display:grid!important}.product-panel .product-details,.product-panel .grade-brick{opacity:1!important;transform:none!important}.product-panel{margin-bottom:40px}`}</style></noscript>
    <p className="technical-note">Product render is illustrative. Dimensions are as supplied; confirm tolerances and suitability before ordering. Technical test results are available only when confirmed by the manufacturer.</p>
  </section>;
}
export function Pricing({products}:{products:Product[]}) {
 const [id,setId]=useState(products[0].id); const [qty,setQty]=useState(1000); const [copied,setCopied]=useState(false);
 const selected=products.find(product=>product.id===id)!; const [unitPrice,setUnitPrice]=useState(String(selected.price??0));
 const price=unitPrice.trim()===''?NaN:Number(unitPrice); const valid=Number.isInteger(qty)&&qty>0&&qty<10000001;
 const validPrice=Number.isFinite(price)&&price>=0; const total=valid&&validPrice?price*qty:null;
 function chooseProduct(nextId:string){const next=products.find(product=>product.id===nextId)!;setId(nextId);setQty(next.unit==='tractor'?1:1000);setUnitPrice(String(next.price??0));}
 async function copy(){try{const unit=selected.unit==='tractor'?'full loaded tractor':'piece';const quantityUnit=selected.unit==='tractor'?(qty===1?'full loaded tractor':'full loaded tractors'):(qty===1?'piece':'pieces');await navigator.clipboard.writeText(`**SHIVASAKTI ETTA UDYOG**\nContact: ${contact.phone}\nTEJ Bricks — Price Quotation\n━━━━━━━━━━━━━━━━━━\nProduct: ${selected.name}\nQuantity: ${qty} ${quantityUnit}\nRate: Rs. ${money(price)} / ${unit}\n\n**Total Estimate: Rs. ${money(total??0)}**\n━━━━━━━━━━━━━━━━━━\nInclusive of VAT, loading, unloading and site delivery.\n\nNote: Final pricing is subject to order and delivery location confirmation.\n\nThank you for considering TEJ Bricks.`);setCopied(true);setTimeout(()=>setCopied(false),2500)}catch{setCopied(false);alert('Copy is unavailable. Please select and copy the estimate text.')}}
 return <section className="pricing section" id="pricing"><div className="pricing-intro" data-reveal><span className="eyebrow">PLAN WITH CONFIDENCE</span><h2>BUILD<br/><em>WITH TEJ.</em></h2><p>Know where your project begins.<br/>Explore our rates and get an instant estimate.</p><div className="delivery-list"><span><ShieldCheck size={20}/> VAT-inclusive pricing</span><span><Box size={20}/> Loading & unloading included</span><span><Truck size={20}/> Site delivery, subject to confirmation</span></div><p className="small-note">Final pricing and delivery availability are confirmed against your quantity, location, and site access.</p><section className="pricing-contact" id="contact" aria-labelledby="pricing-contact-heading"><h3 id="pricing-contact-heading">Contact us</h3><ContactDetails/></section></div><div className="calculator"><div className="calculator-heading"><h3>Your project, estimated.</h3><span>NPR</span></div><label className="field-label" htmlFor="brick-category">BRICK CATEGORY</label><select id="brick-category" value={id} onChange={event=>chooseProduct(event.target.value)}>{products.map(product=><option key={product.id} value={product.id}>{product.name} ({product.grade})</option>)}</select><div className="estimate-price-field"><label className="field-label" htmlFor="estimate-unit-price">ESTIMATED PRICE PER {selected.unit==='piece'?'PIECE':'FULL LOADED TRACTOR'}</label><div><span>Rs.</span><input id="estimate-unit-price" type="number" min="0" step="0.1" value={unitPrice} onChange={event=>setUnitPrice(event.target.value)}/></div><small>Editable for estimation; final rate may vary.</small></div><div className="quantity-label"><label className="field-label" htmlFor="quantity">QUANTITY ({selected.unit==='piece'?'PIECES':'FULL TRACTORS'})</label><input id="quantity" type="number" min="1" max="10000000" step="1" value={Number.isNaN(qty)?'':qty} onChange={event=>setQty(event.target.value===''?NaN:Number(event.target.value))}/></div>{selected.unit==='piece'&&<><input aria-label="Quantity slider in pieces" type="range" min="500" max="10000" step="100" value={Number.isFinite(qty)?Math.min(10000,Math.max(500,qty)):500} onChange={event=>setQty(+event.target.value)}/><div className="range-labels"><span>500 pieces</span><span>10,000 pieces</span></div></>}{!valid&&<p className="error">Enter a whole quantity from 1 to 10,000,000.</p>}{!validPrice&&<p className="error">Enter a valid estimated price.</p>}<div className="estimate"><span>Estimated total</span><strong aria-live="polite">{total===null?'Enter a price':`Rs. ${money(total)}`}</strong><p>{selected.unit==='tractor'?'Tukra is estimated per full loaded tractor.':'Includes VAT, loading, unloading and site delivery, subject to order confirmation.'}</p></div><Link className="button wide" aria-disabled={!valid||!validPrice} href={valid&&validPrice?`/enquiry?grade=${id}&quantity=${qty}&rate=${price}`:'#quantity'}>Request a confirmed quote</Link><button className="copy-button" onClick={copy} disabled={!valid||!validPrice}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?'Quotation copied':'Copy quotation details'}</button></div></section>;
}
export function Story(){return <section id="story" className="story section"><div className="story-image" data-reveal><div className="brick-wall" aria-hidden="true">{Array.from({length:42},(_,i)=><span key={i}/>)}</div><div className="image-caption"><Flame size={20}/><span>SHAPED BY EARTH.<br/>STRENGTHENED BY FIRE.</span></div></div><div className="story-copy" data-reveal><span className="eyebrow">THE MATERIAL BEHIND THE MILESTONES</span><h2>Good things<br/>are built <em>from<br/>the ground up.</em></h2><p>A home. A fresh beginning. A place that brings people together. Every project starts with a decision about what it is made of.</p><p>At Shivasakti Etta Udyog, the story of TEJ bricks begins with clay. Shaped, dried, and kiln-fired into the bricks that help bring Nepal’s next chapter to life.</p><div className="process"><div><span>Natural clay</span><small>The starting point</small></div><div><span>Kiln-fired</span><small>Transformed by heat</small></div><div><span>Grade selected</span><small>Matched to your project</small></div></div><Link href="/products" className="text-link">Meet the collection</Link></div></section>}
export function Applications(){return <section id="applications" className="applications section"><div className="section-heading" data-reveal><div><span className="eyebrow">FROM FIRST PLANS TO FINISHED PLACES</span><h2>Made for what<br/><em>you’re building.</em></h2></div><p>The right brick makes a difference.<br/>Start with the purpose of your project.</p></div><div className="application-grid">{[{name:'A place to call home.',type:'RESIDENTIAL BUILDINGS',grade:'First Class',id:'first',cls:'home',desc:'For main masonry and the character of exposed clay.'},{name:'Space for possibility.',type:'PARTITION WALLS',grade:'Second Class',id:'second',cls:'wall',desc:'Practical masonry for interior walls with a plaster finish.'},{name:'Strength from below.',type:'FOUNDATIONS & SOLING',grade:'Picket',id:'picket',cls:'foundation',desc:'Discuss deep-fired brick for your ground preparation.'}].map(x=><Link key={x.id} href={`/enquiry?grade=${x.id}`} className="application-card" data-reveal><div className={`architecture ${x.cls}`} aria-hidden="true"><div/><div/><div/></div><div className="application-text"><span className="eyebrow">{x.type}</span><h3>{x.name}</h3><p>{x.desc}</p><span className="application-grade">Explore {x.grade}</span></div></Link>)}</div><p className="technical-note">Application guidance is indicative. Your project engineer should confirm structural suitability and required specifications.</p></section>}
