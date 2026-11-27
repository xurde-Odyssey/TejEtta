import { getCatalogue } from '@/lib/catalogue';
import { Hero, Collection, Pricing } from '@/components/experience';
import ContactDetails from '@/components/contact-details';
import { KilnJourney } from '@/components/journey';
import { pageMetadata, HOME_TITLE, HOME_DESCRIPTION } from '@/lib/seo';
export const metadata = pageMetadata('/', HOME_TITLE, HOME_DESCRIPTION);
export default async function Home() {
  const products = await getCatalogue();
  return <main id="main"><Hero product={products.find(product => product.id === 'first')}/><KilnJourney/><Collection products={products}/><Pricing products={products}/><section className="home-contact section" id="contact" aria-labelledby="contact-heading"><div className="home-contact-intro"><span className="eyebrow">LET’S TALK</span><h2 id="contact-heading">Contact <em>TEJ.</em></h2><p>From your first question to your next delivery,<br/>we’re here to help you build.</p></div><ContactDetails/></section></main>;
}
