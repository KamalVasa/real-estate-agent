"use client";
import { useState } from 'react';

export default function NewProperty() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    let uploadedImageUrl = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";
    
    // Check if an image file was selected
    const imageFile = formData.get('image_file') as File;
    if (imageFile && imageFile.size > 0) {
      const imageFormData = new FormData();
      imageFormData.append('file', imageFile);
      try {
        const uploadRes = await fetch(`${apiUrl}/upload-image`, {
          method: 'POST',
          body: imageFormData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.url;
        } else {
          console.error("Image upload failed");
        }
      } catch (err) {
        console.error("Image upload error", err);
      }
    }

    const data = {
      society_name: formData.get('society_name'),
      area: formData.get('area'),
      bhk: parseInt(formData.get('bhk') as string),
      price: parseFloat(formData.get('price') as string),
      carpet_area: parseInt(formData.get('carpet_area') as string),
      floor: formData.get('floor'),
      furnished: formData.get('furnished'),
      station_distance: formData.get('station_distance'),
      description: formData.get('description'),
      amenities: (formData.get('amenities') as string).split(',').map(s => s.trim()),
      image_urls: [uploadedImageUrl],
      featured: formData.get('featured') === 'on'
    };

    try {
      const res = await fetch(`${apiUrl}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        window.location.href = '/admin/properties';
      } else {
        alert('Failed to save property.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '2rem' }}>Add New Flat</h1>
      
      <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Society / Project Name</label>
              <input name="society_name" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Area (e.g., Dombivli East)</label>
              <input name="area" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>BHK</label>
              <input type="number" name="bhk" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Price (₹)</label>
              <input type="number" name="price" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Carpet Area (sqft)</label>
              <input type="number" name="carpet_area" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Floor</label>
              <input name="floor" required placeholder="e.g. 5th of 7" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Furnishing</label>
              <select name="furnished" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully-Furnished">Fully-Furnished</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Distance to Station</label>
              <input name="station_distance" required placeholder="e.g. 10 mins walk" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Amenities (comma separated)</label>
            <input name="amenities" required placeholder="Lift, Security, Water Supply" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description (optional)</label>
            <textarea name="description" rows={4} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}></textarea>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Property Photo</label>
            <input type="file" name="image_file" accept="image/*" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: 'white' }} />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              <input type="checkbox" name="featured" style={{ width: '18px', height: '18px' }} />
              Mark as Featured Property
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ background: '#164f3c', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? 'Saving...' : 'Save Property'}
            </button>
            <a href="/admin/properties" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', color: '#66726b', border: '1px solid #ccc' }}>
              Cancel
            </a>
          </div>

        </form>
      </div>
    </div>
  );
}
