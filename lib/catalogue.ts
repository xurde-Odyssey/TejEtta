import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
export type Product = { id: string; name: string; grade: string; price: number | null; unit: 'piece' | 'tractor'; color: string; description: string; application: string };
export const cataloguePath = path.join(process.cwd(), 'data/catalogue.json');
export async function getCatalogue(): Promise<Product[]> { return JSON.parse(await readFile(cataloguePath, 'utf8')); }
