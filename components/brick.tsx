'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { Component, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BrickModel } from './brick-model';

function Model({color,reduced,rotation,playing,onReady}:{color:string;reduced:boolean;rotation:number;playing:boolean;onReady:()=>void}) {
  const group=useRef<THREE.Group>(null);
  const spin=useRef(0);
  useEffect(() => {
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(onReady); });
    return () => cancelAnimationFrame(frame);
  }, [onReady]);
  const { invalidate, gl } = useThree();
  useEffect(() => {
    const wake = () => invalidate();
    gl.domElement.addEventListener('pointermove', wake, { passive: true });
    return () => gl.domElement.removeEventListener('pointermove', wake);
  }, [gl, invalidate]);
  useEffect(() => { invalidate(); }, [rotation, playing, reduced, invalidate]);
  useFrame(({pointer},delta)=>{
    if(!group.current)return;
    if(playing&&!reduced)spin.current+=Math.min(delta,.05)*.4;
    const blend=1-Math.exp(-6*Math.min(delta,.05));
    group.current.rotation.x=THREE.MathUtils.lerp(group.current.rotation.x,reduced?0:-pointer.y*.07,blend);
    const targetY=rotation+spin.current+(reduced?0:pointer.x*.1);
    group.current.rotation.y=THREE.MathUtils.lerp(group.current.rotation.y,targetY,blend);
    if ((playing&&!reduced) || Math.abs(group.current.rotation.y-targetY)>.0001 || Math.abs(group.current.rotation.x-(reduced?0:-pointer.y*.07))>.0001) invalidate();
  });
  return <group ref={group}><BrickModel color={color}/></group>;
}
class Boundary extends Component<{children:React.ReactNode},{failed:boolean}> {
  state={failed:false};static getDerivedStateFromError(){return{failed:true}}
  render(){return this.state.failed?<div className="brick-photo-fallback"><img src="/reference/tej-brick.png" alt="TEJ brick reference with raised lettering in a recessed panel"/></div>:this.props.children}
}
export default function Brick({color='#A9472C',compact=false,showControls=true}:{color?:string;compact?:boolean;showControls?:boolean}) {
  const [ready,setReady]=useState(false);
  const handleReady=useCallback(()=>setReady(true),[]);
  const [reduced,setReduced]=useState(true);const [rotation,setRotation]=useState(0);const [playing,setPlaying]=useState(false);const [visible,setVisible]=useState(true);const wrapper=useRef<HTMLDivElement>(null);
  useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(q.matches);if(q.matches)setPlaying(false)};update();q.addEventListener('change',update);const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'100px'});if(wrapper.current)observer.observe(wrapper.current);return()=>{q.removeEventListener('change',update);observer.disconnect()}},[]);
  return <div ref={wrapper} className={`brick-canvas ${compact?'brick-compact':''}`} tabIndex={compact?undefined:0} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setRotation(r=>r+(e.key==='ArrowLeft'?-.25:.25))}}} aria-label={compact?undefined:'Interactive TEJ brick. Drag a full 360 degrees or use left and right arrow keys.'}>
    <Boundary><Canvas frameloop={visible?'demand':'never'} dpr={[1,1.5]} camera={{position:[3.6,5.7,6.8],fov:35}} gl={{alpha:true,antialias:true}}><ambientLight intensity={1.1}/><directionalLight position={[-3,7,4]} intensity={3.2}/><directionalLight position={[4,2,-3]} intensity={.8}/><Suspense fallback={null}><Model color={color} reduced={reduced} rotation={rotation} playing={playing} onReady={handleReady}/>{!compact&&<ContactShadows position={[0,-.68,0]} opacity={.3} scale={9} blur={3} far={3}/>}</Suspense>{!compact&&<OrbitControls enableZoom={false} enablePan={false} minPolarAngle={.1} maxPolarAngle={Math.PI-.1}/>}</Canvas></Boundary>
    {!ready&&<div className="brick-photo-fallback brick-loading-photo"><img src="/reference/tej-brick.png" alt="TEJ red clay brick with embossed TEJ branding"/></div>}
    {!compact&&showControls&&<div className="brick-controls"><button type="button" onClick={()=>setRotation(r=>r-Math.PI/2)} aria-label="Rotate brick left 90 degrees">↶</button><button type="button" disabled={reduced} aria-pressed={playing} onClick={()=>setPlaying(p=>!p)}>{playing?'Pause':'Rotate 360°'}</button><button type="button" onClick={()=>setRotation(r=>r+Math.PI/2)} aria-label="Rotate brick right 90 degrees">↷</button></div>}
  </div>;
}
