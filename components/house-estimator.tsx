'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/catalogue';
import { estimateHouse, sampleHouse, type HouseAssumptions } from '@/lib/brick-estimate';
import { contact } from '@/lib/contact';

const number = (value:number) => new Intl.NumberFormat('en-NP',{maximumFractionDigits:0}).format(value);
export default function HouseEstimator({products}:{products:Product[]}) {
  const [inputs,setInputs]=useState<HouseAssumptions>({...sampleHouse});
  const [mode,setMode]=useState<'dimensions'|'area'>('dimensions');
  const [area,setArea]=useState(648);
  const options=products.filter(p=>p.unit==='piece'&&p.price!==null);
  const [grade,setGrade]=useState(options[0]?.id ?? '');
  const product=options.find(p=>p.id===grade);
  const assumptions=mode==='area'?{...inputs,width:Math.sqrt(area),depth:Math.sqrt(area)}:inputs;
  const result=estimateHouse(assumptions);
  function field(key:keyof HouseAssumptions,label:string,min:number,max:number,step=1) {
    return <label>{label}<input type="number" min={min} max={max} step={step} value={Number.isNaN(inputs[key])?'':inputs[key]} onChange={e=>setInputs({...inputs,[key]:e.target.value===''?NaN:Number(e.target.value)})}/></label>;
  }
  const message=result?`Hello Shivasakti Etta Udyog, please review my approximate house-wall estimate for TEJ bricks: ${number(result.area)} sq ft per floor, ${inputs.floors} floor(s), ${inputs.height} ft walls, ${inputs.internalLength} ft internal walls per floor, ${inputs.externalThickness}/${inputs.internalThickness} inch external/internal walls, ${inputs.openings}% openings, ${inputs.waste}% waste. Planning range: ${number(result.low)}–${number(result.high)} bricks. Selected grade: ${product?.name}. Please confirm quantities against my plan.`:'';
  return <section className="house-estimator section" id="house-estimator">
    <div className="section-heading"><div><span className="eyebrow">FROM YOUR FLOOR PLAN TO A FIRST ESTIMATE</span><h2>HOW MANY<br/><em>BRICKS?</em></h2></div><p>Start with your house area.<br/>Adjust the assumptions to suit your plan.</p></div>
    <div className="house-estimator-grid"><div className="house-inputs">
      <div className="estimate-mode" role="group" aria-label="House measurement method"><button type="button" aria-pressed={mode==='dimensions'} onClick={()=>setMode('dimensions')}>Length & width</button><button type="button" aria-pressed={mode==='area'} onClick={()=>setMode('area')}>Floor area only</button></div>
      <div className="form-row">{mode==='dimensions'?<>{field('width','House width (ft)',5,300,.25)}{field('depth','House length (ft)',5,300,.25)}</>:<label>Enclosed area per floor (sq ft)<input type="number" min={25} max={90000} value={Number.isNaN(area)?'':area} onChange={e=>setArea(e.target.value===''?NaN:Number(e.target.value))}/></label>}{field('floors','Number of identical floors',1,10)}{field('height','Wall height per floor (ft)',6,20,.25)}</div>
      {mode==='area'&&<p className="estimate-help">Area alone assumes a square footprint. Use length and width for a closer estimate of the external walls.</p>}
      <button type="button" className="sample-plan-button" onClick={()=>{setInputs({...sampleHouse});setArea(648);setMode('dimensions')}}>Use sample plan: 24 × 27 ft</button>
      <p className="estimate-help">Sample enclosed footprint: 648 sq ft. The drawing’s front porch extends the overall depth to 34 ft; that open porch is excluded. Internal wall length, height, thicknesses and openings below are assumptions, not a measured takeoff.</p>
      <details open><summary>Adjust wall assumptions</summary><div className="form-row">{field('internalLength','Internal wall length / floor (ft)',0,3000,.5)}{field('externalThickness','External wall thickness (in)',4,24,.5)}{field('internalThickness','Internal wall thickness (in)',4,24,.5)}{field('openings','Door & window deduction (%)',0,60)}{field('waste','Breakage & cutting allowance (%)',0,30)}{field('joint','Mortar joint (in)',.25,.75,.125)}</div></details>
      <label>Brick grade for pricing<select value={grade} onChange={e=>setGrade(e.target.value)}>{options.map(p=><option value={p.id} key={p.id}>{p.name} · Rs. {p.price?.toFixed(2)} / piece</option>)}</select></label>
      <p className="estimate-help">Grade selection changes pricing only. Confirm suitability for your walls; Tukra is excluded because it is sold by tractor.</p>
    </div><div className="house-result"><span className="eyebrow">APPROXIMATE WALL BRICKS</span>
      {result?<><div aria-live="polite" aria-atomic="true"><h3>{number(result.low)}–{number(result.high)}</h3><p>bricks for planning</p><dl><div><dt>Calculated estimate, with waste</dt><dd>{number(result.quantity)} bricks</dd></div><div><dt>Total enclosed floor area</dt><dd>{number(result.area*inputs.floors)} sq ft</dd></div><div><dt>External perimeter / floor</dt><dd>{number(result.perimeter)} ft</dd></div></dl>{product?.price!=null&&<div className="house-cost"><span>Indicative brick cost range</span><strong>Rs. {number(result.low*product.price)}–{number(result.high*product.price)}</strong><small>At Rs. {product.price.toFixed(2)} per brick. Supplied VAT-inclusive rates; delivery and final price subject to confirmation.</small></div>}</div><Link className="button wide" href={`/enquiry?grade=${grade}&quantity=${result.quantity}`}>Discuss this estimate</Link><a className="whatsapp" href={`${contact.whatsappUrl}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Share assumptions on WhatsApp</a></>:<p className="error" role="alert">Enter valid values within the field limits. Floors must be a whole number. Area must be 25–90,000 sq ft.</p>}
      <p className="estimate-help">The ±15% planning range is an illustrative allowance, not a measured accuracy guarantee. This covers above-ground walls only: no foundations, parapets, boundary walls, porch walls, columns, beams, slabs, mortar cost or labour. Concrete-frame displacement and wall junctions are not deducted. Have your builder check the plan before ordering.</p>
      <details className="estimate-method"><summary>How the estimate works</summary><p>External perimeter × wall height × external thickness, plus internal wall length × height × internal thickness. Multiply by floors, subtract the opening percentage, then divide by a 10 × 5 × 3 inch brick module including the selected mortar joint. Add your waste allowance.</p><p>All floors use the same footprint and wall assumptions. Thickness inputs are estimating choices, not structural recommendations.</p><a href="https://www.gobrick.com/media/file/10-dimensioning-and-estimating-brick-masonry.pdf" target="_blank" rel="noopener noreferrer">Brick Industry Association: estimating principles</a></details>
    </div></div>
  </section>;
}
