import Image from "next/image";
import SiteFooter from "./components/SiteFooter";
import ProductShowCase from "./components/ProductShowCase";

const services = [
  "Residential Cleaning",
  "Move-In & Move-Out",
  "Deep & Specialty Cleaning",
  "Carpet Cleaning",
  "Decluttering",
  "Organization",
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Image
          src="/neatiful-logo-blue.png"
          alt="Neatiful"
          width={300}
          height={94}
          priority
        />

      <nav>
        <a href="#services">Services</a>
        <a href="#about">Why Neatiful</a>
        <a href="#estimate" className="nav-cta">Free Estimate</a>
      </nav>

      <a className="phone-link" href="tel:+17372005446">
        (737) 200-5446
      </a>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Serving Austin, Houston and surrounding areas.</p>

          <h1>
            Transforming Spaces.
          <br />
            <em>Beautiful Living.</em>
          </h1>

          <p className="hero-description">
            Thoughtful cleaning and organization for spaces that feel calm,
            cared for, and beautifully yours.
          </p>

          <a className="estimate-button" href="#estimate">
            Request a free estimate
          </a>
        </div>

        <div className="hero-image">
          <Image
          src="/neatiful_heroimage.png"
          alt="A clean and beautifully organized home"
          width={1672}
          height={941}
          priority
          />
        </div>
      </section>

      <section className="services-section" id="services">
        <p className="eyebrow">What we do</p>

        <h2>
          More than clean.
        <br />
        <em>Comfortably neatiful.</em>
        </h2>

        <div className="services-grid">
          <ProductShowCase/>
        </div>
      </section>
      
      <section className="about-section" id="about">
        <p className="eyebrow">The Neatiful difference</p>

        <h2>
          Care you can see.
          <br />
          <em>Comfort you can feel.</em>
        </h2>

        <p className="about-description">
          We believe a well-cared-for home changes how your whole day feels.
          That is why we listen first, focus on the details that matter to you,
          and treat your space with genuine respect.
        </p>

        <div className="about-points">
          <article>
            <span>01</span>
            <h3>Personalized from the start</h3>
            <p>Your priorities guide the service —not a one-size-fits-all checklist.</p>
          </article>

          <article>
            <span>02</span>
            <h3>Thoughtful attention</h3>
            <p>We notice the small details that make a space feel truly cared for.</p>
          </article>

          <article>
            <span>03</span>
            <h3>One team for a calmer home</h3>
            <p>Cleaning, carpet care, decluttering, and organization in one place.</p>
          </article>
        </div>
      </section>

      <section className="estimate-cta-section" id="estimate">
        <div className="estimate-cta-copy">
          <p className="eyebrow">Ready when you are</p>

          <h2>
            A more comfortable space
            <br />
            <em>starts here.</em>
          </h2>

          <p>
            Tell us about your space, priorities, and service needs. Our team will
            review the details and prepare a personalized estimate.
          </p>

          <a className="estimate-button" href="/estimate">
            Start my free estimate
          </a>
        </div>

        <div className="estimate-cta-details">
          <p>What to expect</p>
          <div>
            <span>01</span>
            <strong>Consistencty and reliability</strong>
          </div>

          <div>
            <span>02</span>
            <strong>Customer care designed for you, your time matters</strong>
          </div>

          <div>
            <span>03</span>
          <strong>Strong ability to exceed your expectations</strong>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}