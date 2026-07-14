"use client";

import { FormEvent, useState } from "react";
import { whatsappUrl } from "@/lib/config";

export function LeadForm({ propertyName, areas = [], fixedIntent }: { propertyName?: string, areas?: string[], fixedIntent?: string }) {
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
      const intentMsg = fixedIntent ? fixedIntent.toLowerCase() : raw.intent?.toString().toLowerCase() || "buy";
      const areaMsg = propertyName ? propertyName : (raw.preferred_area ? `in ${raw.preferred_area}` : "in Dombivli or Thakurli");
      const budgetMsg = raw.budget ? ` My budget is around ₹${raw.budget}.` : "";
      const text = `Hi HK Properties! I am looking to ${intentMsg} a property ${areaMsg}.${budgetMsg} My name is ${raw.name}. Please call me back.`;
      
      const url = whatsappUrl(text);
      window.open(url, "_blank");

      setSent(true);
      event.currentTarget.reset();
    } catch {
      setError("We couldn’t send that enquiry. Please use WhatsApp for a quick reply.");
    } finally { setBusy(false); }
  }

  if (sent) return (
    <div className="stack">
      <div className="notice"><b>Enquiry received.</b> We’ll call you shortly. For a faster reply, message us on WhatsApp.</div>
      <a className="btn btn-accent" href={whatsappUrl(`Hi, I’m interested in ${propertyName || "a property in Dombivli or Thakurli"}.`)} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
    </div>
  );
  return (
    <form className="stack" onSubmit={submit}>
      <input type="hidden" name="source" value={propertyName ? `Property: ${propertyName}` : "Contact page"} />
      <div className="form-row">
        <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required placeholder="Full name" /></div>
        <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" required inputMode="tel" pattern="[0-9+ -]{10,15}" placeholder="10-digit mobile number" /></div>
      </div>
      <div className="form-row">
        {fixedIntent ? (
          <input type="hidden" name="intent" value={fixedIntent} />
        ) : (
          <div className="field">
            <label htmlFor="intent">I want to</label>
            <select id="intent" name="intent">
              <option value="Buy">Buy a property</option>
              <option value="Rent">Rent a property</option>
              <option value="Sell">Sell my property</option>
            </select>
          </div>
        )}
        <div className="field"><label htmlFor="budget">Budget</label><input id="budget" name="budget" type="number" min="0" placeholder="e.g. 8000000" /></div>
      </div>
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
