import { getCatalogue } from '@/lib/catalogue';
import ContactDetails from '@/components/contact-details';
import HouseBlueprint from '@/components/house-blueprint';
import EnquiryForm from '@/components/enquiry-form';

export const metadata = { title: 'Request a quotation' };
export const dynamic = 'force-dynamic';

export default async function Enquiry({ searchParams }: { searchParams: Promise<{ grade?: string; quantity?: string }> }) {
  const products = await getCatalogue();
  const params = await searchParams;
  return <main id="main" className="enquiry-page section">
    <HouseBlueprint/>
    <div className="enquiry-intro">
      <div className="enquiry-visual">
        <h1>Let’s <em>build.</em></h1>
        <p>Your project starts with a quote.</p>
      </div>
      <div className="enquiry-direct"><h2>Prefer to talk?</h2><ContactDetails/></div>
    </div>
    <EnquiryForm products={products} initialGrade={params.grade} initialQuantity={params.quantity} enabled={Boolean(process.env.ENQUIRY_WEBHOOK_URL)}/>
  </main>;
}
