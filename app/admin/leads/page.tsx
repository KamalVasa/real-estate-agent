"use client";
import { useEffect, useState } from 'react';

type Lead = {
  id: number;
  name: string;
  phone: string;
  budget: number | null;
  preferred_area: string | null;
  status: string;
  source: string | null;
  created_at: string;
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/leads`);
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      await fetch(`${apiUrl}/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchLeads(); // Refresh
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      await fetch(`${apiUrl}/leads/${id}`, { method: 'DELETE' });
      fetchLeads(); // Refresh
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };

  if (loading) return <p>Loading leads...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '2rem' }}>Lead Management</h1>
      
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f7f4ed', color: '#66726b', fontSize: '0.9rem' }}>
            <tr>
              <th style={{ padding: '16px' }}>Date</th>
              <th style={{ padding: '16px' }}>Name</th>
              <th style={{ padding: '16px' }}>Phone / WhatsApp</th>
              <th style={{ padding: '16px' }}>Interest</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px', fontSize: '0.9rem', color: '#66726b' }}>
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{lead.name}</td>
                <td style={{ padding: '16px' }}>
                  <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#164f3c', textDecoration: 'underline' }}>
                    {lead.phone}
                  </a>
                </td>
                <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                  {lead.preferred_area ? `Area: ${lead.preferred_area}` : 'Any Area'}<br/>
                  {lead.budget ? `Budget: ₹${lead.budget.toLocaleString()}` : ''}
                </td>
                <td style={{ padding: '16px' }}>
                  <select 
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.9rem' }}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td style={{ padding: '16px' }}>
                  <button 
                    onClick={() => deleteLead(lead.id)}
                    style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#66726b' }}>No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
