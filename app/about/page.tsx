import Link from "next/link";

export const metadata = { title: "About", description: "Meet your local property guide for Dombivli and Thakurli." };

export default function AboutPage() {
  return <main>
    <section className="page-hero"><div className="container"><div className="eyebrow">About the broker</div><h1 className="display">Local experience.<br />Straight answers.</h1><p className="muted" style={{ maxWidth: 650 }}>We help families buy and sell homes specifically in Dombivli and Thakurli. That narrow focus means better context, faster visits and advice based on the streets we know.</p></div></section>
    <section className="section"><div className="container why-grid">
      <div className="hero-visual" style={{ minHeight: 500, borderRadius: 24, backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=85')" }} />
      <div><div className="eyebrow">Our approach</div><h2 className="display" style={{ fontSize: "3.4rem", margin: "10px 0 22px" }}>Property decisions should feel clear.</h2><p className="muted">Buying a home is a large decision. Our work is to understand your actual needs, shortlist realistic options, explain the trade-offs and make site visits productive.</p><p className="muted">We care more about a good local match than showing you the largest possible list.</p><Link className="btn btn-primary" href="/contact">Talk to us</Link></div>
    </div></section>
  </main>;
}
