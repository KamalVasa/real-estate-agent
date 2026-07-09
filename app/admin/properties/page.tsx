"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Property = {
  id: number;
  society_name: string;
  area: string;
  bhk: number;
  price: number;
};

type Marketing = {
  instagram_caption: string;
  facebook_post: string;
  whatsapp_status: string;
  reel_script: string;
  property_description: string;
};

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [marketingData, setMarketingData] = useState<Marketing | null>(null);
  const [isMarketingLoading, setIsMarketingLoading] = useState(false);

  const fetchProperties = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/properties`);
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const deleteProperty = async (id: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      await fetch(`${apiUrl}/properties/${id}`, { method: 'DELETE' });
      fetchProperties();
    } catch (err) {
      console.error("Failed to delete property", err);
    }
  };

  const generateMarketing = async (id: number) => {
    setIsMarketingLoading(true);
    setMarketingData(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/properties/${id}/marketing`, { method: 'POST' });
      if (!res.ok) throw new Error("Failed to generate marketing content");
      const data = await res.json();
      setMarketingData(data);
    } catch (err) {
      alert("Error generating marketing copy. Make sure the Gemini API key is set up in the backend.");
      console.error(err);
    } finally {
      setIsMarketingLoading(false);
    }
  };

  if (loading) return <p>Loading properties...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Property Inventory</h1>
        <Link 
          href="/admin/properties/new" 
          style={{ background: '#164f3c', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
        >
          + Add New Flat
        </Link>
      </div>
      
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f7f4ed', color: '#66726b', fontSize: '0.9rem' }}>
            <tr>
              <th style={{ padding: '16px' }}>Society / Project</th>
              <th style={{ padding: '16px' }}>Location</th>
              <th style={{ padding: '16px' }}>Type</th>
              <th style={{ padding: '16px' }}>Price</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr key={prop.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{prop.society_name}</td>
                <td style={{ padding: '16px' }}>{prop.area}</td>
                <td style={{ padding: '16px' }}>{prop.bhk} BHK</td>
                <td style={{ padding: '16px' }}>₹{prop.price.toLocaleString('en-IN')}</td>
                <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => generateMarketing(prop.id)}
                    style={{ background: '#d7ef83', color: '#17221c', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                    disabled={isMarketingLoading}
                  >
                    Generate Marketing
                  </button>
                  <button 
                    onClick={() => deleteProperty(prop.id)}
                    style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#66726b' }}>No properties found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Marketing Modal */}
      {(marketingData || isMarketingLoading) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>AI Marketing Copy</h2>
              <button onClick={() => setMarketingData(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            {isMarketingLoading ? (
              <p>Generating magical marketing copy... (this takes 10-15 seconds)</p>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <h3 style={{ color: '#164f3c', margin: '0 0 8px 0', fontSize: '1.1rem' }}>WhatsApp Status / Message</h3>
                  <textarea readOnly value={marketingData?.whatsapp_status} style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #dce1dc' }} />
                </div>
                <div>
                  <h3 style={{ color: '#164f3c', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Instagram Caption</h3>
                  <textarea readOnly value={marketingData?.instagram_caption} style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #dce1dc' }} />
                </div>
                <div>
                  <h3 style={{ color: '#164f3c', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Facebook Post</h3>
                  <textarea readOnly value={marketingData?.facebook_post} style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #dce1dc' }} />
                </div>
                <div>
                  <h3 style={{ color: '#164f3c', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Reel Script</h3>
                  <textarea readOnly value={marketingData?.reel_script} style={{ width: '100%', height: '150px', padding: '12px', borderRadius: '8px', border: '1px solid #dce1dc' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
