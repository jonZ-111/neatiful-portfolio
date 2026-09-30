import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import EstimateCalculator from "../components/EstimateCalculator";

export default function EstimatePage() {
  return (
    <main className="estimate-page">
      <header className="estimate-page-header">
        <Link href="/" aria-label="Return to the neatiful homepage">
          <Image
            src="/neatiful-logo-blue.png"
            alt="neatiful"
            width={180}
            height={56}
            priority
          />
        </Link>

        <Link className="back-home-link" href="/">
          ← Back to home
        </Link>
      </header>

      <section className="estimate-page-content">
        <div className="estimate-page-intro">
          <p className="eyebrow">Free estimate request</p>

          <h1>
            Tell us about
            <br />
            <em>your space.</em>
          </h1>

          <p>
            Fill out the form below to receive a free estimate for your cleaning service.
          </p>

          <p className="estimate-response-time">
            Our estimate tool is designed to provide you with a quick estimate based on the information you provide. Please note that this is an estimate and the final quote may vary based on a more detailed assessment of your space.
          </p>
        </div>

        <div className="estimate-form-container">
          <Suspense fallback={null}>
            <EstimateCalculator />
          </Suspense>
        </div>

        <p className="estimate-privacy-note">
          Your information is used only to review and respond to your service
          request. Marketing communications are sent only if you choose to
          subscribe.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}