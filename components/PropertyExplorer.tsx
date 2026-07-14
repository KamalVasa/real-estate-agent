"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Property } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";

export function PropertyExplorer({ properties }: { properties: Property[] }) {
  const params = useSearchParams();
  const [listingType, setListingType] = useState(params.get("listing_type") || "Sale");
  const [propertyType, setPropertyType] = useState(params.get("type") || "");
  const [area, setArea] = useState(params.get("area") || "");
  const [bhk, setBhk] = useState(params.get("bhk") || "");
  const [budget, setBudget] = useState(params.get("budget") || "");

  const areas = useMemo(() => [...new Set(properties.map((property) => property.area))].sort(), [properties]);
  const propertyTypes = useMemo(() => [...new Set(properties.map((property) => property.property_type || "Flat"))].sort(), [properties]);
  const filtered = useMemo(() => properties.filter((property) =>
    (property.listing_type || "Sale") === listingType &&
    (!propertyType || (property.property_type || "Flat") === propertyType) &&
    (!area || property.area === area) &&
    (!bhk || property.bhk === Number(bhk)) &&
    (!budget || property.price <= Number(budget))
  ), [properties, listingType, propertyType, area, bhk, budget]);

  return <>
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', justifyContent: 'center' }}>
      <button onClick={() => { setListingType("Sale"); setBudget(""); }} style={{ padding: '12px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', background: listingType === "Sale" ? '#164f3c' : '#f1f5f9', color: listingType === "Sale" ? 'white' : '#64748b', transition: 'all 0.2s', flex: 1, maxWidth: '200px' }}>Buy a property</button>
      <button onClick={() => { setListingType("Rent"); setBudget(""); }} style={{ padding: '12px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', background: listingType === "Rent" ? '#8b5cf6' : '#f1f5f9', color: listingType === "Rent" ? 'white' : '#64748b', transition: 'all 0.2s', flex: 1, maxWidth: '200px' }}>Rent a property</button>
    </div>
    <div className="filters">
      <div className="field"><label htmlFor="filter-type">Type</label><select id="filter-type" value={propertyType} onChange={(e) => { setPropertyType(e.target.value); if (e.target.value !== "Flat") setBhk(""); }}><option value="">All types</option>{propertyTypes.map((type) => <option key={type}>{type}</option>)}</select></div>
      <div className="field"><label htmlFor="filter-area">Area</label><select id="filter-area" value={area} onChange={(e) => setArea(e.target.value)}><option value="">All areas</option>{areas.map((item) => <option key={item}>{item}</option>)}</select></div>
      {propertyType !== "Shop" && propertyType !== "Office" && (
        <div className="field"><label htmlFor="filter-bhk">BHK</label><select id="filter-bhk" value={bhk} onChange={(e) => setBhk(e.target.value)}><option value="">Any BHK</option><option value="1">1 BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option></select></div>
      )}
      <div className="field">
        <label htmlFor="filter-budget">Max Budget</label>
        <select id="filter-budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="">Any budget</option>
          {listingType === "Sale" ? (
            <>
              <option value="6000000">Under ₹60 L</option>
              <option value="9000000">Under ₹90 L</option>
              <option value="12000000">Under ₹1.2 Cr</option>
              <option value="15000000">Under ₹1.5 Cr</option>
            </>
          ) : (
            <>
              <option value="10000">Under ₹10K / mo</option>
              <option value="20000">Under ₹20K / mo</option>
              <option value="30000">Under ₹30K / mo</option>
              <option value="50000">Under ₹50K / mo</option>
            </>
          )}
        </select>
      </div>
      <button className="btn btn-outline" onClick={() => { setPropertyType(""); setArea(""); setBhk(""); setBudget(""); }}>Clear filters</button>
    </div>
    <div className="results-count">{filtered.length} {filtered.length === 1 ? "listing" : "listings"} found</div>
    <div className="property-grid">
      {filtered.map((property) => <PropertyCard key={property.id} property={property} />)}
      {!filtered.length && <div className="empty"><h3>No exact matches yet</h3><p className="muted">Clear a filter or contact us. Good local listings often move before they reach the website.</p></div>}
    </div>
  </>;
}
