"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/properties";

type Lead = {
  id: number;
  intent: string;
  name: string;
  phone: string;
  budget?: number | null;
  preferred_area?: string | null;
  status: string;
  source?: string | null;
  created_at: string;
};

type MarketingContent = {
  instagram_caption: string;
  facebook_post: string;
  whatsapp_status: string;
  reel_script: string;
  property_description: string;
};

type PropertyForm = {
  listing_type: string;
  property_type: string;
  society_name: string;
  area: string;
  bhk: string;
  price: string;
  carpet_area: string;
  floor: string;
  furnished: string;
  station_distance: string;
  amenities: string;
  image_urls: string;
  featured: boolean;
  description: string;
  status: string;
  price_unit: string;
  negotiable: boolean;
  views: number;
  station_distance_unit: string;
};

const emptyForm: PropertyForm = {
  listing_type: "Sale",
  property_type: "Flat",
  society_name: "",
  area: "",
  bhk: "2",
  price: "",
  carpet_area: "",
  floor: "",
  furnished: "Unfurnished",
  station_distance: "",
  amenities: "",
  image_urls: "",
  featured: false,
  description: "",
  status: "Available",
  price_unit: "Lakh",
  negotiable: false,
  views: 0,
  station_distance_unit: "km",
};

function splitLines(value: string) {
  return value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
}

function propertyToForm(property: Property): PropertyForm {
  let displayPrice = property.price;
  let priceUnit = "Lakh";
  if (property.price >= 10000000) {
    displayPrice = property.price / 10000000;
    priceUnit = "Cr";
  } else if (property.price >= 100000) {
    displayPrice = property.price / 100000;
  }
  
  return {
    listing_type: property.listing_type || "Sale",
    property_type: property.property_type || "Flat",
    society_name: property.society_name,
    area: property.area,
    bhk: String(property.bhk || 0),
    price: String(displayPrice),
    carpet_area: String(property.carpet_area),
    floor: property.floor,
    furnished: property.furnished,
    station_distance: property.station_distance ? property.station_distance.replace(/ km| m|km|m/gi, '').trim() : "",
    amenities: property.amenities ? property.amenities.join("\n") : "",
    image_urls: property.image_urls ? property.image_urls.join("\n") : "",
    featured: Boolean(property.featured),
    description: property.description || "",
    status: property.status || "Available",
    price_unit: priceUnit,
    negotiable: property.negotiable || false,
    views: property.views || 0,
    station_distance_unit: property.station_distance && property.station_distance.toLowerCase().includes("m") && !property.station_distance.toLowerCase().includes("km") ? "m" : "km",
  };
}

export function AdminDashboard() {
  const api = process.env.NEXT_PUBLIC_API_URL || "";
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [form, setForm] = useState<PropertyForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [marketing, setMarketing] = useState<MarketingContent | null>(null);
  const [activeTab, setActiveTab] = useState<'add_property' | 'inventory' | 'leads'>('add_property');
  const [selectedAreaByType, setSelectedAreaByType] = useState<Record<string, string>>({});
  const [inventoryListingType, setInventoryListingType] = useState<"Sale" | "Rent">("Sale");

  function selectArea(type: string, area: string) {
    setSelectedAreaByType((prev) => ({ ...prev, [type]: area }));
  }

  const authHeaders = useMemo(() => token ? { "X-Admin-Token": token } : {}, [token]);

  const groupedProperties = useMemo(() => {
    const groups: Record<string, Record<string, Property[]>> = {};
    properties
      .filter((p) => (p.listing_type || "Sale") === inventoryListingType)
      .forEach((property) => {
        const type = property.property_type || "Flat";
        const area = property.area || "Unknown Area";
        if (!groups[type]) groups[type] = {};
        if (!groups[type][area]) groups[type][area] = [];
        groups[type][area].push(property);
      });
    return groups;
  }, [properties, inventoryListingType]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("dpa_admin_token") || "";
    setToken(savedToken);
    setTokenInput(savedToken);
  }, []);

  useEffect(() => {
    if (api && token) refresh();
  }, [api, token]);

  async function request(path: string, options: RequestInit = {}) {
    const response = await fetch(`${api}${path}`, {
      cache: 'no-store',
      ...options,
      headers: {
        ...authHeaders,
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers as Record<string, string> || {}),
      } as Record<string, string>,
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.detail || "Request failed");
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function refresh() {
    setError("");
    try {
      const ts = Date.now();
      const [propertyData, leadData] = await Promise.all([
        request(`/properties?t=${ts}`),
        request(`/leads?t=${ts}`),
      ]);
      setProperties(propertyData);
      setLeads(leadData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin data");
    }
  }

  function saveToken(event: FormEvent) {
    event.preventDefault();
    window.localStorage.setItem("dpa_admin_token", tokenInput);
    setToken(tokenInput);
    setMessage("Admin password saved on this device.");
  }

  function updateField(name: keyof PropertyForm, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function payloadFromForm() {
    return {
      listing_type: form.listing_type || "Sale",
      property_type: form.property_type.trim() || "Flat",
      society_name: form.society_name.trim(),
      area: form.area.trim(),
      bhk: Number(form.bhk || 0),
      price: Number(form.price) * (form.price_unit === 'Cr' ? 10000000 : 100000),
      carpet_area: Number(form.carpet_area),
      floor: form.floor.trim(),
      furnished: form.furnished.trim(),
      station_distance: form.station_distance.trim() ? `${form.station_distance.trim()} ${form.station_distance_unit}` : "",
      amenities: splitLines(form.amenities),
      image_urls: splitLines(form.image_urls),
      featured: form.featured,
      description: form.description.trim() || null,
      status: form.status,
      negotiable: form.negotiable,
    };
  }

  async function saveProperty(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = payloadFromForm();
      await request(editingId ? `/properties/${editingId}` : "/properties", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setMessage(editingId ? "Listing updated." : "Listing added. It will now show on the website.");
      setForm(emptyForm);
      setEditingId(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save listing");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const result = await request("/upload-image", { method: "POST", body: data });
      updateField("image_urls", [form.image_urls, result.url].filter(Boolean).join("\n"));
      setMessage("Image uploaded and added to this listing form.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload image");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProperty(id: number) {
    if (!window.confirm("Delete this listing permanently?")) return;
    await request(`/properties/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function updateLeadStatus(id: number, status: string) {
    await request(`/leads/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
    await refresh();
  }

  async function deleteLead(id: number) {
    if (!window.confirm("Delete this lead permanently?")) return;
    await request(`/leads/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function generateMarketing(id: number) {
    setBusy(true);
    setError("");
    setMarketing(null);
    try {
      setMarketing(await request(`/properties/${id}/marketing`, { method: "POST" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate marketing content");
    } finally {
      setBusy(false);
    }
  }

  if (!api) {
    return <div className="notice">Set <b>NEXT_PUBLIC_API_URL</b> first. Admin needs the deployed backend API URL.</div>;
  }

  return (
    <div className="admin-grid">
      {(!token || error?.includes("Invalid admin token")) && (
        <section className="admin-panel">
          <div className="eyebrow">Private admin</div>
          <h2>Login</h2>
          <form className="stack" onSubmit={saveToken}>
            <div className="field">
              <label htmlFor="admin-token">Admin password</label>
              <input id="admin-token" value={tokenInput} onChange={(event) => setTokenInput(event.target.value)} type="password" placeholder="Enter admin password" />
            </div>
            <button className="btn btn-primary" type="submit">Log In</button>
          </form>
          {message && <div className="notice">{message}</div>}
          {error && <div className="notice notice-error">{error}</div>}
        </section>
      )}

      {token && !error?.includes("Invalid admin token") && (
        <>
          <section className="admin-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #dce1dc", borderRadius: "16px 16px 0 0", marginBottom: 0 }}>
             <div>
               <div className="eyebrow">Private admin</div>
               <p style={{ margin: 0, fontWeight: "bold" }}>Logged in successfully</p>
             </div>
             <div style={{ display: 'flex', gap: '12px' }}>
               <a href="/" className="btn btn-outline">Go to Website</a>
               <button className="btn btn-outline danger" onClick={() => { setToken(""); setTokenInput(""); window.localStorage.removeItem("dpa_admin_token"); }}>Log Out</button>
             </div>
          </section>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', background: 'white', padding: '16px', borderRadius: '0 0 16px 16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <button 
              onClick={() => setActiveTab('add_property')}
              style={{ flex: '1 1 auto', minWidth: '140px', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: activeTab === 'add_property' ? '#164f3c' : '#edf3ee', color: activeTab === 'add_property' ? 'white' : '#17221c' }}
            >
              Add Property
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              style={{ flex: '1 1 auto', minWidth: '140px', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: activeTab === 'inventory' ? '#164f3c' : '#edf3ee', color: activeTab === 'inventory' ? 'white' : '#17221c' }}
            >
              Manage Inventory
            </button>
            <button 
              onClick={() => setActiveTab('leads')}
              style={{ flex: '1 1 auto', minWidth: '140px', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: activeTab === 'leads' ? '#164f3c' : '#edf3ee', color: activeTab === 'leads' ? 'white' : '#17221c' }}
            >
              Buyer Enquiries
            </button>
          </div>

          {message && <div className="notice" style={{marginBottom: '20px', fontSize: '1.1rem', padding: '16px', border: '2px solid #164f3c'}}>{message}</div>}
          {error && <div className="notice notice-error" style={{marginBottom: '20px'}}>{error}</div>}

      {activeTab === 'add_property' && (
        <>
          <section className="admin-panel">
        <div className="eyebrow">{editingId ? "Edit listing" : "Add listing"}</div>
        <h2>{editingId ? "Update property or shop" : "New property or shop"}</h2>
        <form className="admin-form" onSubmit={saveProperty}>
          <div className="form-row">
            <div className="field">
              <label>Listing type</label>
              <select value={form.listing_type} onChange={(event) => updateField("listing_type", event.target.value)}>
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status || "Available"} onChange={(event) => updateField("status", event.target.value)}>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Rented">Rented</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Property type</label>
              <select value={form.property_type} onChange={(event) => updateField("property_type", event.target.value)}>
                <option value="Flat">Flat</option>
                <option value="Shop">Shop</option>
                <option value="Office">Office</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="field"><label>{form.property_type === "Flat" ? "Society / building name" : "Complex / Market name"}</label><input required value={form.society_name} onChange={(event) => updateField("society_name", event.target.value)} /></div>
            <div className="field"><label>Area</label><input required value={form.area} onChange={(event) => updateField("area", event.target.value)} placeholder="Dombivli East, Kalyan, Diva..." /></div>
          </div>
          
          <div className="form-row">
            {form.property_type === "Flat" && (
              <div className="field"><label>BHK</label><input value={form.bhk} onChange={(event) => updateField("bhk", event.target.value)} type="number" min="0" /></div>
            )}
            <div className="field">
              <label>Price</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input required value={form.price} onChange={(event) => updateField("price", event.target.value)} type="number" min="0.01" step="0.01" style={{ flex: 1 }} placeholder="e.g. 50" />
                <select value={form.price_unit || "Lakh"} onChange={(event) => updateField("price_unit", event.target.value)} style={{ width: '90px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px' }}>
                  <option value="Lakh">Lakh</option>
                  <option value="Cr">Cr</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="field"><label>Carpet area</label><input required value={form.carpet_area} onChange={(event) => updateField("carpet_area", event.target.value)} type="number" min="1" /></div>
            <div className="field-group">
            <div className="field">
              <label>Station distance</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input required value={form.station_distance} onChange={(event) => updateField("station_distance", event.target.value)} type="number" min="0" step="0.01" style={{ flex: 1 }} placeholder="e.g. 1.5" />
                <select value={form.station_distance_unit || "km"} onChange={(event) => updateField("station_distance_unit", event.target.value)} style={{ width: '80px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' }}>
                  <option value="km">km</option>
                  <option value="m">m</option>
                </select>
              </div>
            </div>
          </div>
          </div>

          {form.property_type !== "Shop" && (
            <div className="form-row">
              <div className="field"><label>Floor</label><input required value={form.floor} onChange={(event) => updateField("floor", event.target.value)} /></div>
              <div className="field"><label>Furnished</label><input required value={form.furnished} onChange={(event) => updateField("furnished", event.target.value)} /></div>
            </div>
          )}
          <div className="field admin-wide"><label>{form.property_type === "Flat" ? "Amenities" : "Features (e.g. Washroom, Frontage)"}</label><textarea value={form.amenities} onChange={(event) => updateField("amenities", event.target.value)} placeholder={form.property_type === "Flat" ? "Parking\nSecurity\nLift" : "Attached Washroom\nRoad Facing\nPower Backup"} rows={4} /></div>
          <div className="field admin-wide"><label>Description</label><textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={4} /></div>
          <div className="field admin-wide"><label>Image URLs</label><textarea value={form.image_urls} onChange={(event) => updateField("image_urls", event.target.value)} placeholder="Paste one image URL per line" rows={4} /></div>
          <div className="field"><label>Upload image</label><input type="file" accept="image/*" onChange={uploadImage} /></div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label className="check-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.featured} onChange={(event) => updateField("featured", event.target.checked)} /> 
              <b>Featured listing</b>
            </label>
            <label className="check-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.negotiable} onChange={(event) => updateField("negotiable", event.target.checked)} /> 
              <b>Price is Negotiable</b>
            </label>
          </div>
          <div className="admin-actions admin-wide">
            <button className="btn btn-primary" disabled={busy}>{busy ? "Saving..." : editingId ? "Update listing" : "Add listing"}</button>
            {editingId && <button className="btn btn-outline" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</button>}
          </div>
        </form>
      </section>
      </>
      )}

      {activeTab === 'inventory' && (
      <>
      <section className="admin-panel admin-wide">
        <div className="section-head compact-head">
          <div><div className="eyebrow">Inventory</div><h2>Listings</h2></div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
              <button onClick={() => setInventoryListingType("Sale")} style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', background: inventoryListingType === "Sale" ? 'white' : 'transparent', color: inventoryListingType === "Sale" ? '#0f172a' : '#64748b', boxShadow: inventoryListingType === "Sale" ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s ease' }}>For Sale</button>
              <button onClick={() => setInventoryListingType("Rent")} style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', background: inventoryListingType === "Rent" ? 'white' : 'transparent', color: inventoryListingType === "Rent" ? '#0f172a' : '#64748b', boxShadow: inventoryListingType === "Rent" ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s ease' }}>For Rent</button>
            </div>
            <button className="btn btn-outline" onClick={refresh}>Refresh</button>
          </div>
        </div>
        <div className="admin-list" style={{ gap: '2rem' }}>
          {Object.entries(groupedProperties).map(([type, areas]) => {
            const currentArea = selectedAreaByType[type] || "";
            return (
              <div key={type} className="property-group" style={{ marginBottom: '2rem' }}>
                <h3 style={{ borderBottom: '2px solid #164f3c', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#164f3c' }}>{type}s</h3>
                
                <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '6px', borderRadius: '14px', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {Object.keys(areas).map((area) => {
                    const isActive = currentArea === area;
                    return (
                      <button 
                        key={area}
                        onClick={() => selectArea(type, area)}
                        style={{
                          padding: '8px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem',
                          background: isActive ? 'white' : 'transparent',
                          color: isActive ? '#0f172a' : '#64748b',
                          boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>

                {currentArea && areas[currentArea] ? (
                  <div className="area-group" style={{ marginBottom: '1.5rem' }}>
                    <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {areas[currentArea].map((property) => (
                        <div 
                          key={property.id} 
                          style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '24px', background: 'white', borderRadius: '16px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)'; }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>{property.society_name}</span>
                            <div>
                              <span style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: '700' }}>{formatPrice(property.price, property.listing_type)}</span>
                              {property.negotiable && <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '4px' }}>(Negotiable)</span>}
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                              {property.property_type === 'Flat' && property.bhk ? `${property.bhk} BHK • ` : ''}{property.carpet_area} sq.ft.
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => { setActiveTab('add_property'); setEditingId(property.id); setForm(propertyToForm(property)); }} 
                              style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#334155', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => generateMarketing(property.id)} disabled={busy}
                              style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                            >
                              ✨ AI Copy
                            </button>
                            <button 
                              onClick={() => deleteProperty(property.id)}
                              style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#ef4444', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="muted">Select an area above to view listings.</p>
                )}
              </div>
            );
          })}
          {Object.keys(groupedProperties).length === 0 && <p className="muted">No {inventoryListingType === "Sale" ? "sale" : "rental"} properties found. Add some from the "Add listing" tab.</p>}
        </div>
      </section>

      {marketing && <section className="admin-panel admin-wide">
        <div className="eyebrow">AI marketing output</div>
        <h2>Ready to post</h2>
        {Object.entries(marketing).map(([key, value]) => (
          <div className="copy-box" key={key}>
            <b>{key.replaceAll("_", " ")}</b>
            <p>{value}</p>
          </div>
        ))}
      </section>}
      </>
      )}

            {activeTab === 'leads' && (
      <section className="admin-panel admin-wide" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
        <div className="section-head compact-head" style={{ marginBottom: '24px' }}>
          <div><div className="eyebrow">Buyer Enquiries</div><h2 style={{ margin: 0 }}>Lead Management</h2></div>
          <button className="btn btn-outline" onClick={refresh}>Refresh Leads</button>
        </div>
        {(() => {
          const buyLeads = leads.filter(l => l.intent === 'Buy');
          const rentLeads = leads.filter(l => l.intent === 'Rent');

          const renderLead = (lead: Lead) => (
            <div key={lead.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', color: '#0f172a' }}>{lead.name}</h3>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    {lead.intent} Enquiry • {new Date(lead.created_at).toLocaleDateString()}
                  </div>
                </div>
                <select 
                  value={lead.status || "new"}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    try {
                      await request(`/leads/${lead.id}`, {
                        method: "PUT",
                        body: JSON.stringify({ ...lead, status: newStatus }),
                      });
                      refresh();
                    } catch (err) {
                      alert("Failed to update status");
                    }
                  }}
                  style={{ 
                    padding: '4px 12px', 
                    borderRadius: '16px', 
                    fontSize: '0.85rem', 
                    fontWeight: 'bold', 
                    border: 'none',
                    background: lead.status === 'Closed' ? '#dcfce7' : lead.status === 'Contacted' ? '#dbeafe' : lead.status === 'Junk' ? '#fee2e2' : '#fef3c7',
                    color: lead.status === 'Closed' ? '#166534' : lead.status === 'Contacted' ? '#1e40af' : lead.status === 'Junk' ? '#991b1b' : '#92400e',
                    cursor: 'pointer'
                  }}
                >
                  <option value="new">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                  <option value="Junk">Junk</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '0.95rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📞 <a href={`tel:${lead.phone}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>{lead.phone}</a></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>💰 Budget: <b>{lead.budget ? formatPrice(lead.budget) : "Not shared"}</b></span>
              </div>
              <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                📍 {lead.source && lead.source.startsWith("Property:") ? lead.source : `Preferred Area: ${lead.preferred_area || "Any area"}`}
              </span>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button 
                  onClick={() => deleteLead(lead.id)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#ef4444', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                >
                  Delete
                </button>
              </div>
            </div>
          );

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {buyLeads.length > 0 && (
                <div>
                  <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', color: '#0f172a' }}>Buy Enquiries</h3>
                  <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {buyLeads.map(renderLead)}
                  </div>
                </div>
              )}
              {rentLeads.length > 0 && (
                <div>
                  <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px', color: '#0f172a' }}>Rent Enquiries</h3>
                  <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {rentLeads.map(renderLead)}
                  </div>
                </div>
              )}
              {!leads.length && (
                <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                  <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No leads yet. When customers submit the callback form, they will appear here.</p>
                </div>
              )}
            </div>
          );
        })()}
      </section>
      )}
        </>
      )}
    </div>
  );
}
