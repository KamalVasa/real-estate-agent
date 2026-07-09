import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata = {
  title: "Admin | Dombivli Property AI",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="container section">
      <div className="page-hero" style={{ background: "transparent", paddingTop: 0 }}>
        <div className="eyebrow">Broker dashboard</div>
        <h1 className="display">Manage listings and leads</h1>
        <p className="muted">Add flats, shops, new areas, buyer leads, and AI marketing copy from one simple private page.</p>
      </div>
      <AdminDashboard />
    </main>
  );
}
