"use client";

import { useState } from "react";
import Link from "next/link";

interface SubItem {
  label: string;
  href?: string;
}

interface Category {
  number: string;
  name: string;
  description: string;
  subItems: SubItem[];
  href: string | null;
  estimateHref?: string;
}

const categories: Category[] = [
  {
    number: "01",
    name: "Residential",
    description:
      "Standard upkeep, deep resets, move-in/move-out, and carpet care — a package for every stage of living in your space.",
    subItems: [
      { label: "Standard/Regular Cleaning", href: "/services/residential/standard-regular-cleaning" },
      { label: "Deep Cleaning", href: "/services/residential/deep-cleaning" },
      { label: "Move-In & Move-Out", href: "/services/residential/move-in-move-out" },
      { label: "Carpet Cleaning", href: "/services/residential/carpet-cleaning" },
    ],
    href: "/services/residential",
    estimateHref: "/estimate",
  },
  {
    number: "02",
    name: "Realtor & Airbnb Services",
    description:
      "Fast, reliable turnovers and listing-ready cleans for hosts and real estate professionals.",
    subItems: [
      { label: "Realtor Cleaning", href: "/services/realtor-airbnb/realtor-cleaning" },
      { label: "Airbnb Turnover", href: "/services/realtor-airbnb/airbnb-turnover" },
    ],
    href: "/services/realtor-airbnb",
  },
  {
    number: "03",
    name: "Commercial",
    description:
      "Custom cleaning scopes for offices and other business spaces — tailored to your operation.",
    subItems: [
      { label: "Corporate & Office" },
      { label: "Custom quotes for other business types" },
    ],
    href: null,
  },
  {
    number: "04",
    name: "Decluttering & Organization",
    description:
      "Turn cluttered rooms into calm, usable space — cabinets, closets, garages, and more.",
    subItems: [
      { label: "Kitchen Cabinets & Pantry" },
      { label: "Refrigerator" },
      { label: "Home Office & Paper Management" },
      { label: "Laundry Room" },
      { label: "Closets (Bedroom, Hall, Coat)" },
      { label: "Living & Common Areas" },
      { label: "Garage & Storage" },
      { label: "Kids' Rooms & Playroom" },
    ],
    href: null,
  },
  {
    number: "05",
    name: "Post-Construction",
    description:
      "Dust-free, move-in-ready results after the crew leaves — from rough clean to final touch-up.",
    subItems: [
      { label: "Final Deep Clean" },
      { label: "Rough Clean" },
      { label: "Light Touch-Up" },
    ],
    href: null,
  },
];

export default function ProductShowcase() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openCategory = openIndex !== null ? categories[openIndex] : null;

  return (
    <>
      <div className="showcase-grid">
        {categories.map((category, index) => (
          <button
            type="button"
            className="showcase-card"
            key={category.name}
            onClick={() => setOpenIndex(index)}
          >
            <span className="showcase-card-number">{category.number}</span>
            <h3>{category.name}</h3>
            <span className="showcase-card-chevron" aria-hidden="true">+</span>
          </button>
        ))}
      </div>

      {openCategory && (
        <div className="showcase-modal-overlay" onClick={() => setOpenIndex(null)}>
          <div className="showcase-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="showcase-modal-close"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
            >
              ×
            </button>
            <span className="showcase-card-number">{openCategory.number}</span>
            <h3 className="showcase-modal-title">{openCategory.name}</h3>
            <p>{openCategory.description}</p>
            <ul className="showcase-modal-list">
              {openCategory.subItems.map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ) : (
                  <li key={item.label}>{item.label}</li>
                )
              )}
            </ul>
            <div className="showcase-modal-actions">
              {openCategory.href ? (
                <Link href={openCategory.href} className="showcase-modal-link">
                  See full details →
                </Link>
              ) : (
                <span className="showcase-coming-soon">Full details coming soon</span>
              )}
              {openCategory.estimateHref && (
                <Link href={openCategory.estimateHref} className="showcase-modal-estimate-btn">
                  Get my estimate →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}