import { getCatalogue } from '@/lib/catalogue';
import { Collection, Pricing } from '@/components/experience';
export const metadata={title:'Our brick collection'};
export const dynamic='force-dynamic';
export default async function Products(){const products=await getCatalogue();return <main id="main" className="inner-page"><Collection products={products} full/><Pricing products={products}/></main>}
