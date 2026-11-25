export type HouseAssumptions = {
  width: number; depth: number; floors: number; height: number;
  internalLength: number; externalThickness: number; internalThickness: number;
  openings: number; waste: number; joint: number;
};

export function estimateHouse(a: HouseAssumptions) {
  if (Object.values(a).some(v => !Number.isFinite(v)) ||
      a.width < 5 || a.width > 300 || a.depth < 5 || a.depth > 300 ||
      !Number.isInteger(a.floors) || a.floors < 1 || a.floors > 10 ||
      a.height < 6 || a.height > 20 || a.internalLength < 0 || a.internalLength > 3000 ||
      a.externalThickness < 4 || a.externalThickness > 24 || a.internalThickness < 4 || a.internalThickness > 24 ||
      a.openings < 0 || a.openings > 60 || a.waste < 0 || a.waste > 30 || a.joint < .25 || a.joint > .75) return null;
  const perimeter = 2 * (a.width + a.depth);
  const netFactor = 1 - a.openings / 100;
  const externalVolume = perimeter * a.height * a.externalThickness / 12 * netFactor * a.floors;
  const internalVolume = a.internalLength * a.height * a.internalThickness / 12 * netFactor * a.floors;
  // Supplied TEJ dimensions in inches, with an assumed mortar joint on each axis.
  const moduleVolume = (10 + a.joint) * (5 + a.joint) * (3 + a.joint) / 1728;
  const base = (externalVolume + internalVolume) / moduleVolume;
  const total = base * (1 + a.waste / 100);
  return {area: a.width * a.depth, perimeter, externalVolume, internalVolume,
    base: Math.ceil(base), quantity: Math.ceil(total),
    low: Math.floor(total * .85 / 100) * 100, high: Math.ceil(total * 1.15 / 100) * 100};
}

export const sampleHouse: HouseAssumptions = {
  width:24, depth:27, floors:1, height:10, internalLength:50,
  externalThickness:10, internalThickness:5, openings:18, waste:7, joint:.375,
};
