import Image from "next/image";
import Link from "next/link";

export default function StandardRegularCleaningService() {
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
          <p className="eyebrow">Residential — Standard / Regular Cleaning</p>
          <h1>
            Consistent care,
            <br />
            <em>on your schedule.</em>
          </h1>
          <p>
            Standard Cleaning keeps your home comfortable between deeper
            cleans — available as a one-time visit or on a recurring
            schedule that fits your routine, from weekly to monthly.
          </p>
          <Link className="estimate-button" href="/estimate?service=standardRegular">
            Get my Standard Cleaning estimate
          </Link>
        </div>

        <div className="service-detail-columns">
          <div className="service-detail-block">
            <h3>What&apos;s included</h3>
            <ul>
              <li>Dusting all reachable surfaces</li>
              <li>Vacuuming and mopping floors</li>
              <li>Kitchen counters, sink, and outer appliance surfaces</li>
              <li>Bathrooms — sinks, toilets, showers/tubs, mirrors</li>
              <li>Trash removal and general tidying</li>
              <li>Choice of frequency: one-time, weekly, biweekly, or monthly</li>
            </ul>
          </div>

          <div className="service-detail-block">
            <h3>Optional add-ons</h3>
            <ul>
              <li>Oven (interior)</li>
              <li>Fridge (interior)</li>
              <li>Cabinets, inside and out</li>
              <li>Windows (interior)</li>
              <li>Wall cleaning</li>
            </ul>
            <p className="service-detail-note">
              Unlike Deep Cleaning, these are optional here — add whichever
              ones fit what your space needs this visit.
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