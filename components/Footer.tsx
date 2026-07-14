import Link from "next/link";
import { BUSINESS } from "@/lib/config";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand"><span>HK</span>{BUSINESS.name}</div>
            <p className="muted">Straightforward property guidance for buyers and families across Dombivli and Thakurli.</p>
          </div>
          <div><b>Explore</b><Link href="/">Home</Link><Link href="/properties">All properties</Link><Link href="/about">About us</Link><Link href="/contact">Contact</Link></div>
          <div><b>Get in touch</b><a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></div>
        </div>
        <div className="copyright">© {new Date().getFullYear()} {BUSINESS.name}. Local property expertise, made digital.</div>
      </div>
    </footer>
  );
}
