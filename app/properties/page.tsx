import { Suspense } from "react";
import { PropertyExplorer } from "@/components/PropertyExplorer";
import { getProperties } from "@/lib/properties";

export const metadata = { title: "Properties", description: "Search flats by area, BHK and budget in Dombivli and Thakurli." };

export default async function PropertiesPage() {
  const properties = await getProperties();
  return <main>
    <section className="page-hero"><div className="container"><div className="eyebrow">Available homes</div><h1 className="display">Find your fit.</h1><p className="muted">Filter current options by neighbourhood, home size and budget.</p></div></section>
    <section className="section"><div className="container"><Suspense fallback={<p>Loading properties...</p>}><PropertyExplorer properties={properties} /></Suspense></div></section>
  </main>;
}
