"use client";

import { FormEvent, useState } from "react";
import { whatsappUrl } from "@/lib/config";

export function LeadForm({ propertyName, areas = [] }: { propertyName?: string, areas?: string[] }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const raw = Object.fromEntries(form.entries());
    const payload = { ...raw, budget: raw.budget ? Number(raw.budget) : null };
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      if (api) {
        const response = await fetch(`${api}/leads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error("Could not save enquiry");
      }
      setSent(true);
      event.currentTarget.reset();
    } catch {
      setError("We couldn’t send that enquiry. Please use WhatsApp for a quick reply.");
    } finally { setBusy(false); }
  }

  if (sent) return <div className="notice"><b>Enquiry received.</b> We’ll call you shortly. For a faster reply, message us on WhatsApp.</div>;
  return (
    <form className="stack" onSubmit={submit}>
      <input type="hidden" name="source" value={propertyName ? `Property: ${propertyName}` : "Contact page"} />
      <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required placeholder="Full name" /></div>
      <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" required inputMode="tel" pattern="[0-9+ -]{10,15}" placeholder="10-digit mobile number" /></div>
      <div className="field"><label htmlFor="budget">Budget</label><input id="budget" name="budget" type="number" min="0" placeholder="e.g. 8000000" /></div>
      {!propertyName && (
        <div className="field">
          <label htmlFor="preferred_area">Preferred area</label>
          <select id="preferred_area" name="preferred_area">
            <option value="">Select an area</option>
            {areas.length > 0 ? areas.map(a => <option key={a}>{a}</option>) : <><option>Dombivli East</option><option>Dombivli West</option><option>Thakurli</option></>}
          </select>
        </div>
      )}
      {error && <div className="notice">{error}</div>}
      <button className="btn btn-primary" disabled={busy}>{busy ? "Sending..." : "Request a callback"}</button>
      <a className="btn btn-accent" href={whatsappUrl(`Hi, I’m interested in ${propertyName || "a property in Dombivli or Thakurli"}.`)} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
    </form>
  );
}
