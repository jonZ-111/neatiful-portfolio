import Image from "next/image";
import Link from "next/link";

export default function MoveInMoveOutService() {
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
          <p className="eyebrow">Residential — Move-In &amp; Move-Out</p>
          <h1>
            A fresh start,
            <br />
            <em>or a clean handoff.</em>
          </h1>
          <p>
            Whether you&apos;re settling into a new place or preparing one
            to hand off, this service resets the space from top to bottom —
            available in three levels depending on how thorough you need it.
          </p>
          <Link className="estimate-button" href="/estimate?service=moveInOut">
            Get my Move-In/Move-Out estimate
          </Link>
        </div>

        <div className="service-detail-columns">
          <div className="service-detail-block">
            <h3>Choose your level</h3>
            <ul>
              <li><strong>Deep Cleaning</strong> — the most thorough option, includes oven, fridge, and cabinets (inside &amp; out) at no extra charge</li>
              <li><strong>Standard Cleaning</strong> — a full clean without the deep-detail extras</li>
            </ul>
          </div>

          <div className="service-detail-block">
            <h3>Optional add-ons</h3>
            <ul>
              <li>Windows (interior)</li>
              <li>Wall cleaning</li>
              <li>Fridge — Interior Cleaning</li>
              <li>Cabinets — Interior Cleaning</li>
            </ul>
            <p className="service-detail-note">
              Choosing the Deep Cleaning level already includes oven, fridge,
              and cabinet cleaning — the estimate tool will let you know if
              something you&apos;ve selected is already covered.
            </p>
          </div>
        </div>

        <p className="estimate-privacy-note">
          <Link href="/services/residential">← See all Residential packages</Link>
        </p>
      </div>
    </div>
  );
}