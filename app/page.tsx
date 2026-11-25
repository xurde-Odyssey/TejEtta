import { getCatalogue } from '@/lib/catalogue';
import { Hero, Collection, Pricing } from '@/components/experience';
import { KilnJourney } from '@/components/journey';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const products = await getCatalogue();
  return <main id="main"><Hero product={products.find(product => product.id === 'first')}/><KilnJourney/><Collection products={products}/><Pricing products={products}/></main>;
}
