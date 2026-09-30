import Image from "next/image";
import Link from "next/link";

export default function RealtorCleaningService() {
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
          <p className="eyebrow">Realtor &amp; Airbnb Services — Realtor Cleaning</p>
          <h1>
            Listing-ready,
            <br />
            <em>on your schedule.</em>
          </h1>
          <p>
            Real estate timelines don&apos;t leave room for uncertainty.
            Whether it&apos;s a pre-listing clean before photography or a
            final reset before handoff, we treat your date as fixed — and
            flag anything that could put it at risk before it becomes
            your problem.
          </p>
          <Link className="estimate-button" href="/estimate?service=realtor">
            Get my Realtor Cleaning estimate
          </Link>
        </div>

        <div className="service-detail-columns">
          <div className="service-detail-block">
            <h3>What&apos;s included</h3>
            <ul>
              <li>A listing-readiness checklist — surfaces cleared, streak-free glass, floors finished last</li>
              <li>Photo-verified completion of key rooms at every job</li>
              <li>Same-day notice if anything puts your date at risk — never discovered the day of</li>
            </ul>
          </div>

          <div className="service-detail-block">
            <h3>How we work with agents</h3>
            <ul>
              <li>We don&apos;t pay for referrals, and we don&apos;t expect anything in return — being your preferred vendor is earned through service, not purchased</li>
              <li>One point of contact for your account, every time</li>
              <li>Billing confirmed upfront, so there&apos;s never confusion at invoice time</li>
            </ul>
            <p className="service-detail-note">
              Pricing uses the same trusted per-square-foot formula as our
              Move-In/Move-Out service — no separate rate card to learn.
            </p>
          </div>
        </div>

        <p className="estimate-privacy-note">
          <Link href="/services/realtor-airbnb">← See all Realtor &amp; Airbnb Services</Link>
        </p>
      </div>
    </div>
  );
}