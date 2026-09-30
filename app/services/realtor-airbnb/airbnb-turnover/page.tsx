import Image from "next/image";
import Link from "next/link";
import AirbnbInquiryForm from "../../../components/AirbnbInquiryForm";

export default function AirbnbTurnoverService() {
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
          <p className="eyebrow">Realtor &amp; Airbnb Services — Airbnb Turnover</p>
          <h1>
            Consistent turnovers,
            <br />
            <em>every check-in.</em>
          </h1>
          <p>
            Managing an Airbnb means an ongoing relationship, not a one-time
            job — so we start with a conversation, not an instant quote.
            Reach out, and you&apos;ll be paired with a dedicated neatiful
            rep who manages your account for as long as you work with us.
          </p>
          <a className="estimate-button" href="#start-inquiry">
            Start my inquiry
          </a>
        </div>

        <div className="service-detail-columns">
          <div className="service-detail-block">
            <h3>How pricing works</h3>
            <ul>
              <li>Base package: 1 bedroom, 1 bathroom, common areas, linens, and a restocking check — $100</li>
              <li>Each additional bedroom (linens included): +$20</li>
              <li>Each additional bathroom: +$20</li>
              <li>2–4 properties enrolled: 5% off. 5+ properties: 10% off.</li>
            </ul>
          </div>

          <div className="service-detail-block">
            <h3>Restocking, our way</h3>
            <ul>
              <li>You supply and stock consumables — we check against your agreed par levels and refill from what you&apos;ve provided</li>
              <li>Every restock is photo-documented, so you always know what was checked</li>
              <li>We don&apos;t purchase or warehouse supplies on your behalf under this plan</li>
            </ul>
            <p className="service-detail-note">
              These are our standard rates — your rep will confirm exact
              pricing for your property during onboarding.
            </p>
          </div>
        </div>

        <div id="start-inquiry" style={{ marginTop: "60px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
            Tell us about your property
          </h2>
          <AirbnbInquiryForm />
        </div>

        <p className="estimate-privacy-note">
          <Link href="/services/realtor-airbnb">← See all Realtor &amp; Airbnb Services</Link>
        </p>
      </div>
    </div>
  );
}