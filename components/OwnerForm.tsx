"use client";

import { FormEvent } from "react";
import { whatsappUrl } from "@/lib/config";

export function OwnerForm() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name") as string;
    const address = form.get("address") as string;
    const intent = form.get("intent") as string;

    const message = `Hi, I want to list my property with you.\n\nMy Name: ${name}\nProperty/Shop Address: ${address}\nLooking to: ${intent}`;
    window.open(whatsappUrl(message), "_blank");
  }

  return (
    <form className="stack" onSubmit={submit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="owner-name" style={{ color: 'rgba(255,255,255,0.7)' }}>Your name</label>
          <input id="owner-name" name="name" required placeholder="Full name" style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white' }} />
        </div>
        <div className="field">
          <label htmlFor="owner-intent" style={{ color: 'rgba(255,255,255,0.7)' }}>Looking to</label>
          <select id="owner-intent" name="intent" style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white' }}>
            <option value="Sell" style={{ color: 'black' }}>Sell it</option>
            <option value="Rent out" style={{ color: 'black' }}>Rent it out</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="address" style={{ color: 'rgba(255,255,255,0.7)' }}>Property / Shop address</label>
        <input id="address" name="address" required placeholder="e.g. 402, Metro Grande, Thakurli" style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'white' }} />
      </div>
      <button className="btn btn-primary" style={{ background: 'white', color: '#1e293b', marginTop: '10px' }}>Send details via WhatsApp</button>
    </form>
  );
}
