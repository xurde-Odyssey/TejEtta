import { getCatalogue } from '@/lib/catalogue';
import ContactDetails from '@/components/contact-details';
import HouseBlueprint from '@/components/house-blueprint';
import EnquiryForm from '@/components/enquiry-form';
import { Noto_Serif_Devanagari } from 'next/font/google';

const quoteFont = Noto_Serif_Devanagari({ subsets: ['devanagari'], weight: '700', display: 'swap' });

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
      <div className="enquiry-direct">
        <h2>Prefer to talk?</h2>
        <ContactDetails/>
        <blockquote className={`enquiry-quote ${quoteFont.className}`} lang="ne">
          “हरेक इँटामा हाम्रो प्रतिबद्धता, हरेक निर्माणमा तपाईंको विश्वास। तपाईंको सपनालाई बलियो आधार दिनु नै हाम्रो गर्व हो।”
        </blockquote>
      </div>
    </div>
    <EnquiryForm products={products} initialGrade={params.grade} initialQuantity={params.quantity} enabled={Boolean(process.env.ENQUIRY_WEBHOOK_URL)}/>
  </main>;
}
