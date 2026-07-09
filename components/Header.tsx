import Link from "next/link";
import { BUSINESS, whatsappUrl } from "@/lib/config";

export function Header() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="brand" href="/"><span>DP</span>{BUSINESS.name}</Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/properties">Properties</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <a className="btn btn-primary" href={whatsappUrl("Hi, I am looking for a property in Dombivli or Thakurli.")} target="_blank" rel="noreferrer">WhatsApp us</a>
        </nav>
        <a className="btn btn-primary mobile-cta" href={whatsappUrl("Hi, I am looking for a property in Dombivli or Thakurli.")} target="_blank" rel="noreferrer">Chat</a>
      </div>
    </header>
  );
}
