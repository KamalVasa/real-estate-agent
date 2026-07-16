import Link from "next/link";

import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/properties";

export function PropertyCard({ property }: { property: Property }) {
  const type = property.property_type || "Flat";
  const configuration = type.toLowerCase() === "shop" ? `${property.carpet_area} sq.ft.` : `${property.bhk} BHK · ${property.carpet_area} sq.ft.`;

  return (
    <Link className="card" href={`/properties/${property.id}`}>
      <div className="card-image">
        {property.image_urls[0] && (
          <img src={property.image_urls[0]} alt={property.society_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap', zIndex: 2 }}>
          <span className="tag" style={{ position: 'relative', top: 'auto', left: 'auto', background: property.listing_type === 'Rent' ? '#8b5cf6' : '#10b981', color: 'white' }}>
            For {property.listing_type || 'Sale'}
          </span>
          {property.featured && <span className="tag" style={{ position: 'relative', top: 'auto', left: 'auto', background: '#0f172a', color: 'white' }}>Featured</span>}
          {property.status && property.status !== "Available" && <span className="tag" style={{ position: 'relative', top: 'auto', left: 'auto', background: '#ef4444', color: 'white' }}>{property.status}</span>}
        </div>
      </div>
      <div className="card-body">
        <h3>{property.society_name}</h3>
        <div className="card-meta"><span>{property.area}</span><span>{type} · {configuration}</span></div>
        <div className="card-price">
          {formatPrice(property.price, property.listing_type)}
          {property.negotiable && <span style={{ fontSize: '0.8rem', color: '#66726b', marginLeft: '6px', fontWeight: 'normal' }}>(Negotiable)</span>}
        </div>
      </div>
    </Link>
  );
}
