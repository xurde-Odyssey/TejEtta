import * as THREE from 'three';

// Letter silhouettes hand-built from Brick.png. Geometry, not generated text or a decal.
export function letterShapes() {
  const paths = [
    [[0,.9],[.96,.9],[.9,.69],[.57,.69],[.34,0],[.08,0],[.3,.69],[-.06,.69]],
    [[1.2,.9],[2.05,.9],[1.98,.69],[1.43,.69],[1.36,.54],[1.83,.54],[1.76,.34],[1.29,.34],[1.23,.2],[1.8,.2],[1.74,0],[.88,0]],
    [[2.3,.9],[3.08,.9],[3.01,.69],[2.82,.69],[2.64,.15],[2.5,.03],[2.3,-.01],[2.06,.02],[1.98,.14],[2.04,.43],[2.28,.43],[2.23,.23],[2.34,.19],[2.41,.25],[2.56,.69],[2.23,.69]],
  ];
  return paths.map(points=>{const shape=new THREE.Shape();points.forEach(([x,y],i)=>{if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y)});shape.closePath();return shape});
}

