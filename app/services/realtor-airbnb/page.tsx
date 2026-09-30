import Image from "next/image";
import Link from "next/link";

const packages = [
  {
    name: "Realtor Cleaning",
    description: "Listing-ready, on your timeline — pre-listing preps, move-outs tied to a sale, and closing-day resets.",
    href: "/services/realtor-airbnb/realtor-cleaning",
  },
  {
    name: "Airbnb Turnover",
    description: "Consistent, guest-ready turnovers between check-out and check-in.",
    href: "/services/realtor-airbnb/airbnb-turnover",
  },
];

export default function RealtorAirbnbServices() {
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
          <p className="eyebrow">Realtor &amp; Airbnb Services</p>
          <h1>
            Real Estate &amp; Rental
            <br />
            <em>Property Services.</em>
          </h1>
          <p>
            Two different relationships, one standard of reliability —
            whether you&apos;re an agent prepping a listing or a host
            managing turnovers between guests.
          </p>
        </div>

        <div className="service-hub-grid">
          {packages.map((pkg) => (
            <article className="service-hub-card" key={pkg.name}>
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              {pkg.href ? (
                <Link href={pkg.href}>See details →</Link>
              ) : (
                <span className="service-hub-coming-soon">More details coming soon</span>
              )}
            </article>
          ))}
        </div>

        <p className="estimate-privacy-note">
          Not sure which service fits? <Link href="/estimate">Start a free estimate</Link> and
          we&apos;ll help you figure it out.
        </p>
      </div>
    </div>
  );
}