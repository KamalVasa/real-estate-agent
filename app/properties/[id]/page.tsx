import { notFound } from "next/navigation";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { ViewTracker } from "@/components/ViewTracker";
import { formatPrice, getProperty } from "@/lib/properties";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const property = await getProperty(Number(id));
  const type = property?.property_type || "Flat";
  const titlePrefix = type.toLowerCase() === "shop" ? "Shop" : `${property?.bhk} BHK`;
  return property ? { 
    title: `${titlePrefix} for ${property.listing_type} at ${property.society_name} - ${formatPrice(property.price, property.listing_type)}`, 
    description: property.description,
    openGraph: {
      images: property.image_urls.length > 0 ? [{ url: property.image_urls[0] }] : []
    }
  } : {};
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  const property = await getProperty(Number(id));
  if (!property) notFound();
  const type = property.property_type || "Flat";
  const configuration = type.toLowerCase() === "shop" ? "Commercial shop" : `${property.bhk} BHK`;
  return <main className="container detail-grid">
    <ViewTracker propertyId={property.id} />
    <div>
      <div className="detail-image" style={{ position: "relative", minHeight: "400px", borderRadius: "24px", overflow: "hidden", background: "#f1f5f9" }}>
        {property.image_urls[0] && (
          <Image src={property.image_urls[0]} alt={property.society_name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" priority unoptimized={property.image_urls[0].includes('localhost') || property.image_urls[0].includes('127.0.0.1')} />
        )}
        {property.status && property.status !== "Available" && (
          <div style={{ position: 'absolute', top: '24px', left: '24px', background: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', zIndex: 2 }}>
            {property.status}
          </div>
        )}
      </div>
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="eyebrow">About this listing</div><h2 className="display" style={{ fontSize: "2.8rem", margin: "10px 0" }}>A closer look</h2>
        <p className="muted">{property.description}</p>
        <h3>Amenities</h3><div className="amenities">{property.amenities.map((item) => <span className="amenity" key={item}>{item}</span>)}</div>
      </section>
    </div>
    <aside className="detail-panel">
      <div className="eyebrow">{property.area}</div>
      <h1 className="display">{property.society_name}</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div className="price">{formatPrice(property.price, property.listing_type)}</div>
        <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          👁️ {property.views} Views
        </div>
      </div>
      <div className="facts">
        <div className="fact"><span>Type</span><b>{type}</b></div>
        <div className="fact"><span>Configuration</span><b>{configuration}</b></div>
        <div className="fact"><span>Carpet area</span><b>{property.carpet_area} sq.ft.</b></div>
        {type !== 'Shop' && (
          <>
            <div className="fact"><span>Floor</span><b>{property.floor}</b></div>
            <div className="fact"><span>Condition</span><b>{property.furnished}</b></div>
          </>
        )}
        <div className="fact" style={{ gridColumn: "1/-1" }}><span>From station</span><b>{property.station_distance}</b></div>
      </div>
      <h3>Interested in this listing?</h3><LeadForm propertyName={property.society_name} fixedIntent={property.listing_type === 'Rent' ? 'Rent' : 'Buy'} />
    </aside>
  </main>;
}
