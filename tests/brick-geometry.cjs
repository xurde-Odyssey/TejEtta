const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const Module=require('node:module');
const THREE=require('three');
const compiled=ts.transpileModule(fs.readFileSync('lib/brick-geometry.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const model=new Module(require('node:path').resolve('lib/brick-geometry.cjs'));
model.paths=module.paths;
model._compile(compiled,require('node:path').resolve('lib/brick-geometry.cjs'));
const shapes=model.exports.letterShapes();
assert.equal(shapes.length,3,'TEJ must retain three explicit letter silhouettes');
let lastRight=-Infinity;
for(const shape of shapes){
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelThickness:.018,bevelSize:.025,bevelSegments:3});
 geometry.computeBoundingBox();
 const box=geometry.boundingBox;
 assert.ok(box.max.x>box.min.x && box.max.y>box.min.y);
 assert.ok((box.min.x+box.max.x)/2>lastRight,'Letters must read left to right');
 assert.ok(box.max.z>.05,'Letter must have real depth');
 assert.ok(Array.from(geometry.attributes.position.array).every(Number.isFinite));
 lastRight=(box.min.x+box.max.x)/2;geometry.dispose();
}
console.log('TEJ geometry: three ordered, finite, extruded letter shapes verified.');
