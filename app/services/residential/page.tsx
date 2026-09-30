import Image from "next/image";
import Link from "next/link";

const packages = [
  {
    name: "Standard / Regular Cleaning",
    description: "Recurring upkeep to keep your home consistently comfortable.",
    href: "/services/residential/standard-regular-cleaning",
  },
  {
    name: "Deep Cleaning",
    description: "A thorough, top-to-bottom reset for spaces that need extra attention.",
    href: "/services/residential/deep-cleaning",
  },
  {
    name: "Move-In & Move-Out",
    description: "A full reset between tenants, or a fresh start before you settle in.",
    href: "/services/residential/move-in-move-out",
  },
  {
    name: "Carpet Cleaning",
    description: "Standard maintenance or deep extraction, done right.",
    href: "/services/residential/carpet-cleaning",
  },
];

export default function ResidentialServices() {
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
          <p className="eyebrow">Residential</p>
          <h1>
            Residential Cleaning
            <br />
            <em>Packages.</em>
          </h1>
          <p>
            Every home is different, so we built a package for each stage of
            living in it — from everyday upkeep to a full deep reset.
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
          Not sure which package fits your space? <Link href="/estimate">Start a free estimate</Link> and
          we&apos;ll help you figure it out.
        </p>
      </div>
    </div>
  );
}