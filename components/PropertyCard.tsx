import Link from "next/link";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/properties";

export function PropertyCard({ property }: { property: Property }) {
  const type = property.property_type || "Flat";
  const configuration = type.toLowerCase() === "shop" ? `${property.carpet_area} sq.ft.` : `${property.bhk} BHK · ${property.carpet_area} sq.ft.`;

  return (
    <Link className="card" href={`/properties/${property.id}`}>
      <div className="card-image" style={{ backgroundImage: `url(${property.image_urls[0]})` }}>
        {property.featured && <span className="tag">Featured</span>}
      </div>
      <div className="card-body">
        <h3>{property.society_name}</h3>
        <div className="card-meta"><span>{property.area}</span><span>{type} · {configuration}</span></div>
        <div className="card-price">{formatPrice(property.price)}</div>
      </div>
    </Link>
  );
}
