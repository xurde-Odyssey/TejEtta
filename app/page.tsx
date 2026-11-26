import { getCatalogue } from '@/lib/catalogue';
import { Hero, Collection, Pricing } from '@/components/experience';
import { KilnJourney } from '@/components/journey';
import { pageMetadata, HOME_TITLE, HOME_DESCRIPTION } from '@/lib/seo';
export const metadata = pageMetadata('/', HOME_TITLE, HOME_DESCRIPTION);
export default async function Home() {
  const products = await getCatalogue();
  return <main id="main"><Hero product={products.find(product => product.id === 'first')}/><KilnJourney/><Collection products={products}/><Pricing products={products}/></main>;
}
