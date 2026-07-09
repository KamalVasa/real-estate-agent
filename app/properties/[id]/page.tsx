import { notFound } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { formatPrice, getProperty } from "@/lib/properties";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const property = await getProperty(Number(id));
  const type = property?.property_type || "Flat";
  const titlePrefix = type.toLowerCase() === "shop" ? "Shop" : `${property?.bhk} BHK`;
  return property ? { title: `${titlePrefix} at ${property.society_name}`, description: property.description } : {};
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  const property = await getProperty(Number(id));
  if (!property) notFound();
  const type = property.property_type || "Flat";
  const configuration = type.toLowerCase() === "shop" ? "Commercial shop" : `${property.bhk} BHK`;
  return <main className="container detail-grid">
    <div>
      <div className="detail-image" style={{ backgroundImage: `url(${property.image_urls[0]})` }} />
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="eyebrow">About this listing</div><h2 className="display" style={{ fontSize: "2.8rem", margin: "10px 0" }}>A closer look</h2>
        <p className="muted">{property.description}</p>
        <h3>Amenities</h3><div className="amenities">{property.amenities.map((item) => <span className="amenity" key={item}>{item}</span>)}</div>
      </section>
    </div>
    <aside className="detail-panel">
      <div className="eyebrow">{property.area}</div><h1 className="display">{property.society_name}</h1><div className="price">{formatPrice(property.price)}</div>
      <div className="facts"><div className="fact"><span>Type</span><b>{type}</b></div><div className="fact"><span>Configuration</span><b>{configuration}</b></div><div className="fact"><span>Carpet area</span><b>{property.carpet_area} sq.ft.</b></div><div className="fact"><span>Floor</span><b>{property.floor}</b></div><div className="fact"><span>Condition</span><b>{property.furnished}</b></div><div className="fact" style={{ gridColumn: "1/-1" }}><span>From station</span><b>{property.station_distance}</b></div></div>
      <h3>Interested in this listing?</h3><LeadForm propertyName={property.society_name} />
    </aside>
  </main>;
}
