import Image from "next/image";
import Link from "next/link";

export default function DeepCleaningService() {
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
          <p className="eyebrow">Residential — Deep Cleaning</p>
          <h1>
            A thorough reset,
            <br />
            <em>top to bottom.</em>
          </h1>
          <p>
            Deep Cleaning goes beyond a regular tidy-up — it&apos;s a detailed,
            room-by-room clean designed for spaces that need real attention,
            or as a strong first visit before switching to recurring service.
          </p>
          <Link className="estimate-button" href="/estimate?service=deepCleaning">
            Get my Deep Cleaning estimate
          </Link>
        </div>

        <div className="service-detail-columns">
          <div className="service-detail-block">
            <h3>What&apos;s included</h3>
            <ul>
              <li>Full clean of all rooms — dusting, surfaces, floors</li>
              <li>Kitchen deep clean, including oven (interior)</li>
              <li>Fridge, interior wipe-down</li>
              <li>Cabinets, inside and out</li>
              <li>Bathrooms — deep scrub of tile, grout, and fixtures</li>
              <li>Baseboards and detail work regular cleanings skip</li>
            </ul>
          </div>

          <div className="service-detail-block">
            <h3>Optional add-ons</h3>
            <ul>
              <li>Windows (interior)</li>
              <li>Wall cleaning</li>
              <li>Fridge — clean &amp; organize</li>
              <li>Cabinets — clean &amp; organize</li>
            </ul>
            <p className="service-detail-note">
              Oven, fridge, and cabinet cleaning are already part of Deep
              Cleaning at no extra charge — the calculator will let you know
              if something you&apos;ve selected is already included.
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