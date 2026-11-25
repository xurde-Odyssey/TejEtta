'use client';
import { useEffect, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

import { letterShapes } from '@/lib/brick-geometry';

export function BrickModel({color='#A9472C'}:{color?:string}) {
  const {texture,letters}=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
    const ctx=canvas.getContext('2d')!;const data=ctx.createImageData(256,256);let seed=42;
    for(let i=0;i<data.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const n=110+(seed%110);data.data[i]=n;data.data[i+1]=n;data.data[i+2]=n;data.data[i+3]=255}ctx.putImageData(data,0,0);
    const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(3,2);
    const letters=letterShapes().map(shape=>new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelThickness:.018,bevelSize:.025,bevelSegments:3,steps:1,curveSegments:4}));
    return {texture,letters};
  },[]);
  useEffect(()=>()=>{texture.dispose();letters.forEach(g=>g.dispose())},[texture,letters]);
  const material=<meshStandardMaterial color={color} roughness={.98} bumpMap={texture} bumpScale={.045}/>;
  return <group>
    <RoundedBox args={[4,1.06,2]} position={[0,-.07,0]} radius={.075} smoothness={3}>{material}</RoundedBox>
    {/* The rim and inset floor form a real recessed stamp panel on the broad face. */}
    <RoundedBox args={[4,.2,.33]} position={[0,.5,.835]} radius={.055} smoothness={3}>{material}</RoundedBox>
    <RoundedBox args={[4,.2,.33]} position={[0,.5,-.835]} radius={.055} smoothness={3}>{material}</RoundedBox>
    <RoundedBox args={[.36,.2,1.48]} position={[-1.82,.5,0]} radius={.05} smoothness={3}>{material}</RoundedBox>
    <RoundedBox args={[.36,.2,1.48]} position={[1.82,.5,0]} radius={.05} smoothness={3}>{material}</RoundedBox>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.463,0]}><planeGeometry args={[3.3,1.35]}/><meshStandardMaterial color={new THREE.Color(color).multiplyScalar(.72)} roughness={1} bumpMap={texture} bumpScale={.035}/></mesh>
    <group rotation={[-Math.PI/2,0,0]} position={[-1.5,.478,.43]} scale={[.97,.97,1]}>{letters.map((geometry,i)=><mesh key={i} geometry={geometry}>{material}</mesh>)}</group>
  </group>;
}
