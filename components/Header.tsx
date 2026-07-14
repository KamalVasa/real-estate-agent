"use client";
import { useState } from "react";
import Link from "next/link";
import { BUSINESS, whatsappUrl } from "@/lib/config";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="brand" href="/" onClick={() => setIsOpen(false)}><span>HK</span>{BUSINESS.name}</Link>
        <nav className={`nav-links ${isOpen ? 'open' : ''}`} aria-label="Primary navigation">
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/properties" onClick={() => setIsOpen(false)}>Properties</Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          <a className="btn btn-primary" href={whatsappUrl("Hi, I am looking for a property in Dombivli or Thakurli.")} target="_blank" rel="noreferrer">WhatsApp us</a>
        </nav>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a className="btn btn-primary mobile-cta" href={whatsappUrl("Hi, I am looking for a property in Dombivli or Thakurli.")} target="_blank" rel="noreferrer">Chat</a>
          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
