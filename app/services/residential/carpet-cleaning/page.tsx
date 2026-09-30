import Image from "next/image";
import Link from "next/link";

export default function CarpetCleaningService() {
  return (
    <div className="estimate-page">
      <header className="estimate-page-header">
        <Link href="/">
          <Image
            src="/neatiful-logo-blue.png"
            alt="neatiful"
            width={160}
            height={50}
          />
        </Link>
        <Link href="/" className="back-home-link">
          ← Back home
        </Link>
      </header>

      <div className="estimate-page-content">
        <div className="estimate-page-intro">
          <p className="eyebrow">Residential — Carpet Cleaning</p>
          <h1>
            Carpets that feel
            <br />
            <em>as good as new.</em>
          </h1>
          <p>
            From routine upkeep to a full deep extraction, we treat carpets
            with the right method for how they&apos;re actually being used.
          </p>
          <Link className="estimate-button" href="/estimate?service=carpet">
            Get my Carpet Cleaning estimate
          </Link>
        </div>

        <div className="service-detail-columns">
          <div className="service-detail-block">
            <h3>Choose your level</h3>
            <ul>
              <li><strong>Standard Steam Clean</strong> — routine maintenance to keep carpets fresh</li>
              <li><strong>Deep Extraction</strong> — a more thorough treatment for heavier buildup, stains, or high-traffic areas</li>
            </ul>
          </div>

          <div className="service-detail-block">
            <h3>Good to know</h3>
            <ul>
              <li>Priced by square footage</li>
              <li>Can be booked alongside another cleaning service or on its own</li>
            </ul>
          </div>
        </div>

        <p className="estimate-privacy-note">
          <Link href="/services/residential">← See all Residential packages</Link>
        </p>
      </div>
    </div>
  );
}