import { getCatalogue } from '@/lib/catalogue';
import { Collection, Pricing } from '@/components/experience';
import { pageMetadata, catalogueSchema } from '@/lib/seo';
import StructuredData from '@/components/structured-data';
export const metadata = pageMetadata('/products', 'Red Clay Brick Grades & Prices in Nepal', 'Compare TEJ first-class, Picket/Jhama, second-class and Godiya bricks, plus Tukra by the full loaded tractor. Explore NPR prices and delivery enquiries.');
export default async function Products(){const products=await getCatalogue();return <main id="main" className="inner-page"><StructuredData data={catalogueSchema(products)}/><Collection products={products} full/><Pricing products={products}/></main>}
