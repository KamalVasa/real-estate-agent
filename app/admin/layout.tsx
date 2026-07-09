export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '250px', background: '#17221c', color: 'white', padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Admin Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <a href="/admin" style={{ color: '#dce1dc', textDecoration: 'none' }}>Overview</a>
          <a href="/admin/properties" style={{ color: '#dce1dc', textDecoration: 'none' }}>Properties</a>
          <a href="/admin/leads" style={{ color: '#dce1dc', textDecoration: 'none' }}>Leads</a>
          <div style={{ borderTop: '1px solid #333', margin: '15px 0' }}></div>
          <a href="/" target="_blank" style={{ color: '#d7ef83', textDecoration: 'none' }}>View Public Site ↗</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
