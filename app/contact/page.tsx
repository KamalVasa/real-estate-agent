import { LeadForm } from "@/components/LeadForm";
import { BUSINESS } from "@/lib/config";

import { getProperties } from "@/lib/properties";

export const metadata = { title: "Contact", description: "Contact a local Dombivli and Thakurli real estate broker by phone or WhatsApp." };

export default async function ContactPage() {
  const properties = await getProperties();
  const areas = [...new Set(properties.map(p => p.area))].sort();

  return <main>
    <section className="page-hero"><div className="container"><div className="eyebrow">Let’s talk property</div><h1 className="display">Tell us what home looks like to you.</h1></div></section>
    <section className="section"><div className="container contact-layout">
      <div><h2 className="display" style={{ fontSize: "2.6rem", marginTop: 0 }}>Direct, local help.</h2><p className="muted">Share your area, BHK and budget. We’ll respond with relevant options and help plan a site visit.</p><div className="contact-card"><small>Call us</small><h3><a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a></h3></div><div className="contact-card"><small>Email</small><h3><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></h3></div><div className="contact-card"><small>Service area</small><h3>Dombivli & Thakurli, Maharashtra</h3></div></div>
      <div className="form-card"><h2 style={{ marginTop: 0 }}>Request a callback</h2><LeadForm areas={areas} /></div>
    </div></section>
  </main>;
}
