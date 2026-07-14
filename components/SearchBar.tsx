"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar({ areas = [] }: { areas?: string[] }) {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("Sale");
  const [area, setArea] = useState("");
  const [bhk, setBhk] = useState("");
  const [budget, setBudget] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const query = new URLSearchParams();
    if (listingType) query.set("listing_type", listingType);
    if (propertyType) query.set("type", propertyType);
    if (area) query.set("area", area);
    if (bhk) query.set("bhk", bhk);
    if (budget) query.set("budget", budget);
    router.push(`/properties?${query}`);
  }

  return (
    <form className="search-bar" onSubmit={submit}>
      <div className="field">
        <label htmlFor="listingType">Looking to</label>
        <select id="listingType" value={listingType} onChange={(e) => { setListingType(e.target.value); setBudget(""); }}>
          <option value="Sale">Buy</option>
          <option value="Rent">Rent</option>
        </select>
      </div>
      <div className="field"><label htmlFor="area">Location</label><select id="area" value={area} onChange={(e) => setArea(e.target.value)}><option value="">Any area</option>{areas.length > 0 ? areas.map(a => <option key={a}>{a}</option>) : <><option>Dombivli East</option><option>Dombivli West</option><option>Thakurli</option></>}</select></div>
      <div className="field"><label htmlFor="propertyType">Property type</label><select id="propertyType" value={propertyType} onChange={(e) => { setPropertyType(e.target.value); if (e.target.value !== "Flat") setBhk(""); }}><option value="">Any type</option><option>Flat</option><option>Shop</option><option>Office</option></select></div>
      {propertyType !== "Shop" && propertyType !== "Office" && (
        <div className="field"><label htmlFor="bhk">BHK</label><select id="bhk" value={bhk} onChange={(e) => setBhk(e.target.value)}><option value="">Any BHK</option><option value="1">1 BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option></select></div>
      )}
      <div className="field">
        <label htmlFor="budget">Max budget</label>
        <select id="budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="">Any budget</option>
          {listingType === "Sale" ? (
            <>
              <option value="6000000">Up to ₹60 L</option>
              <option value="9000000">Up to ₹90 L</option>
              <option value="12000000">Up to ₹1.2 Cr</option>
              <option value="15000000">Up to ₹1.5 Cr</option>
            </>
          ) : (
            <>
              <option value="10000">Up to ₹10K / mo</option>
              <option value="20000">Up to ₹20K / mo</option>
              <option value="30000">Up to ₹30K / mo</option>
              <option value="50000">Up to ₹50K / mo</option>
            </>
          )}
        </select>
      </div>
      <button className="btn btn-primary" type="submit">Find listings</button>
    </form>
  );
}
