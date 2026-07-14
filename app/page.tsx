import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { OwnerForm } from "@/components/OwnerForm";
import { getProperties } from "@/lib/properties";
import { whatsappUrl } from "@/lib/config";

export default async function Home() {
  const properties = await getProperties();
  const sales = properties.filter(p => (p.listing_type || 'Sale') === 'Sale').slice(0, 3);
  const rentals = properties.filter(p => p.listing_type === 'Rent').slice(0, 3);
  const areas = [...new Set(properties.map(p => p.area))].sort();
  return <main>
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">Dombivli & Thakurli property experts</div>
          <h1 className="display">Your next home is closer than you think.</h1>
          <p className="muted">Curated local homes, honest guidance and quick site visits. No endless scrolling, no confusing sales pitch.</p>
          <div className="hero-actions"><Link className="btn btn-primary" href="/properties">Explore properties</Link><a className="btn btn-outline" href={whatsappUrl("Hi, please help me find a home in Dombivli or Thakurli.")} target="_blank" rel="noreferrer">Tell us what you need</a></div>
          <div className="trust-row"><div><strong>100%</strong><span>Hyperlocal focus</span></div><div><strong>1:1</strong><span>Buyer guidance</span></div><div><strong>Quick</strong><span>Site visits</span></div></div>
        </div>
        <div className="hero-visual"><div className="hero-badge"><strong>Local knowledge matters.</strong><span className="muted">From station access to society culture, get the details listing portals miss.</span></div></div>
      </div>
    </section>
    <div className="container search-shell"><SearchBar areas={areas} /></div>
    <section className="section"><div className="container">
      <div className="section-head"><div><div className="eyebrow">Handpicked homes</div><h2 className="display">Featured homes for sale</h2></div><Link className="btn btn-outline" href="/properties?listing_type=Sale">View all homes for sale</Link></div>
      <div className="property-grid">{sales.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
      {!sales.length && <p className="muted">No homes for sale right now.</p>}
    </div></section>
    
    {rentals.length > 0 && (
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <div className="section-head"><div><div className="eyebrow">Rental options</div><h2 className="display">Featured homes for rent</h2></div><Link className="btn btn-outline" href="/properties?listing_type=Rent">View all rentals</Link></div>
        <div className="property-grid">{rentals.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
      </div></section>
    )}
    <section className="why section"><div className="container why-grid">
      <div><div className="eyebrow" style={{ color: "var(--lime)" }}>Why choose local</div><h2 className="display">A property search built around real life.</h2><p className="muted">We focus only on Dombivli and Thakurli, so advice stays practical, personal and grounded in the neighbourhood.</p></div>
      <div className="feature-list"><div className="feature"><b>01 · Curated options</b>Homes matched to your budget, family and commute.</div><div className="feature"><b>02 · Local context</b>Societies, station routes and daily conveniences explained.</div><div className="feature"><b>03 · Direct support</b>One person from first enquiry through site visit.</div><div className="feature"><b>04 · Clear conversation</b>Ask on WhatsApp. Get a useful answer quickly.</div></div>
    </div></section>
    <section className="section" style={{ background: 'var(--cream)', paddingBottom: 0 }}>
      <div className="container">
        <div className="cta-grid">
          <div className="cta-card" style={{ background: 'white', border: '1px solid var(--line)' }}>
            <div className="eyebrow">Buyer guidance</div>
            <h2 className="display" style={{ margin: '8px 0 24px', fontSize: '2.2rem' }}>Not sure where to start?</h2>
            <p className="muted" style={{ marginBottom: '24px' }}>Let us know your budget and preferred area, and we will share a curated list of properties that match.</p>
            <a className="btn btn-primary" href={whatsappUrl("Hi, I need help choosing a property. My budget is...")} target="_blank" rel="noreferrer">Share your budget</a>
          </div>
          
          <div className="cta-card" style={{ background: '#1e293b', color: 'white' }}>
            <div className="eyebrow" style={{ color: '#d7ef83' }}>Owner services</div>
            <h2 className="display" style={{ color: 'white', margin: '8px 0 16px', fontSize: '2.2rem' }}>Sell or rent out your property.</h2>
            <p style={{ opacity: 0.85, marginBottom: '32px', lineHeight: 1.5 }}>Fill out this quick form and we will connect you with the right buyer or tenant via WhatsApp.</p>
            <OwnerForm />
          </div>
        </div>
      </div>
    </section>
  </main>;
}
