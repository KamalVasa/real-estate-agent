import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { getProperties } from "@/lib/properties";
import { whatsappUrl } from "@/lib/config";

export default async function Home() {
  const properties = await getProperties();
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
      <div className="section-head"><div><div className="eyebrow">Handpicked homes</div><h2 className="display">Featured around the neighbourhood</h2></div><Link className="btn btn-outline" href="/properties">View all homes</Link></div>
      <div className="property-grid">{properties.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} />)}</div>
    </div></section>
    <section className="why section"><div className="container why-grid">
      <div><div className="eyebrow" style={{ color: "var(--lime)" }}>Why choose local</div><h2 className="display">A property search built around real life.</h2><p className="muted">We focus only on Dombivli and Thakurli, so advice stays practical, personal and grounded in the neighbourhood.</p></div>
      <div className="feature-list"><div className="feature"><b>01 · Curated options</b>Homes matched to your budget, family and commute.</div><div className="feature"><b>02 · Local context</b>Societies, station routes and daily conveniences explained.</div><div className="feature"><b>03 · Direct support</b>One person from first enquiry through site visit.</div><div className="feature"><b>04 · Clear conversation</b>Ask on WhatsApp. Get a useful answer quickly.</div></div>
    </div></section>
    <div className="container cta-band"><h2 className="display">Not sure where to start?</h2><a className="btn btn-primary" href={whatsappUrl("Hi, I need help choosing a property. My budget is...")} target="_blank" rel="noreferrer">Share your budget</a></div>
  </main>;
}
