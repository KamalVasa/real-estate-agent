import Link from "next/link";

export default function NotFound() {
  return <main className="section container empty"><h1 className="display">That home isn’t listed.</h1><p className="muted">It may have been sold or the link may be old.</p><Link className="btn btn-primary" href="/properties">Browse available homes</Link></main>;
}
