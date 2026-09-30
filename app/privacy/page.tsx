import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Notice | neatiful",
  description:
    "Learn how neatiful collects, uses, and protects customer information.",
};

export default function PrivacyPage() {
  return (
    <>
      <main className="privacy-page">
        <div className="privacy-container">
          <Link className="privacy-back-link" href="/">
            ← Return to homepage
          </Link>

          <p className="eyebrow">Your information matters</p>
          <h1>Privacy Notice</h1>
          <p className="privacy-effective-date">
            Effective date: August 18, 2026
          </p>

          <p className="privacy-introduction">
            The neatiful brand (“neatiful,” “we,”, “our,” or “us”), respects your privacy. This notice explains how
            we collect, use, disclose, and protect information submitted
            through our website and estimate-request process.
          </p>

          <section>
            <h2>Information we collect</h2>
            <p>We may collect information that you voluntarily provide, including:</p>
            <ul>
              <li>Your name, telephone number, and email address.</li>
              <li>Your service address or general service location.</li>
              <li>Property type, square footage, and requested services.</li>
              <li>
                Information about pets, stains, clutter, delicate surfaces,
                accessibility, and other conditions affecting the service.
              </li>
              <li>Your preferred timing and communication method.</li>
              <li>Messages, photographs, or other information you provide.</li>
            </ul>
          </section>

          <section>
            <h2>How we use information</h2>
            <p>We use this information to:</p>
            <ul>
              <li>Review and respond to estimate requests.</li>
              <li>Prepare personalized service estimates.</li>
              <li>Schedule, coordinate, and provide requested services.</li>
              <li>Communicate about appointments and customer support.</li>
              <li>Maintain business, safety, accounting, and legal records.</li>
              <li>Improve our services and customer experience.</li>
            </ul>
          </section>

          <section>
            <h2>Service providers and contractors</h2>
            <p>
              We may share information when reasonably necessary with service
              providers that support our operations, including Microsoft Forms
              and Microsoft 365, website-hosting providers, payment processors,
              and independent cleaning professionals assigned to a service.
              Contractors receive only the information reasonably necessary to
              complete the accepted job.
            </p>
          </section>

          <section>
            <h2>Sale of personal information</h2>
            <p>
              neatiful does not sell customers’ personal information. We do not
              sell sensitive personal data or biometric data.
            </p>
          </section>

          <section>
            <h2>Data retention and security</h2>
            <p>
              We retain information only as long as reasonably necessary for
              estimates, services, customer support, accounting, legal
              obligations, and dispute resolution. We use reasonable
              administrative and technical safeguards, but no electronic
              system can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>Your choices and requests</h2>
            <p>
              You may ask whether we maintain your personal information or
              request access, correction, or deletion by contacting us. We may
              need to verify your identity before completing a request and may
              retain information when required by law or legitimate business
              obligations.
            </p>
          </section>

          <section>
            <h2>Children’s privacy</h2>
            <p>
              Our services are intended for adults. We do not knowingly collect
              personal information directly from children under 13.
            </p>
          </section>

          <section>
            <h2>Updates to this notice</h2>
            <p>
              We may update this notice as our services or practices change.
              The effective date above indicates the latest version.
            </p>
          </section>

          <section>
            <h2>Contact us</h2>
            <p>
              For privacy questions or requests, email{" "}
              <a href="mailto:hello@neatifulliving.com">
                hello@neatifulliving.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}