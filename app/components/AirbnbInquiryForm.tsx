"use client";

import { useState } from "react";

export default function AirbnbInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyCount, setPropertyCount] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const formComplete =
    name.trim() !== "" && email.trim() !== "" && propertyCount.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formComplete) return;
    setStatus("sending");

    const payload = {
      inquiryType: "airbnb-turnover",
      name,
      email,
      phone,
      propertyCount,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/airbnb-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="estimate-calc-card estimate-calc-sent-confirmation">
        <p className="estimate-calc-sent-title">Thanks, {name.split(" ")[0]}!</p>
        <p>
          Your inquiry is in. A neatiful rep will reach out soon — and
          they&apos;ll be your dedicated contact for as long as you work
          with us.
        </p>
      </div>
    );
  }

  return (
    <form className="estimate-calc-card" onSubmit={handleSubmit}>
      <label className="estimate-calc-label" htmlFor="airbnb-name">Name</label>
      <input
        id="airbnb-name"
        className="estimate-calc-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label className="estimate-calc-label" htmlFor="airbnb-email">Email</label>
      <input
        id="airbnb-email"
        type="email"
        className="estimate-calc-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label className="estimate-calc-label" htmlFor="airbnb-phone">Phone (optional)</label>
      <input
        id="airbnb-phone"
        type="tel"
        className="estimate-calc-input"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label className="estimate-calc-label" htmlFor="airbnb-property-count">How many properties?</label>
      <input
        id="airbnb-property-count"
        type="number"
        min={1}
        className="estimate-calc-input"
        value={propertyCount}
        onChange={(e) => setPropertyCount(e.target.value)}
        required
      />

      <p className="estimate-calc-hint">
        That&apos;s all we need to get started — your rep will reach out to
        gather the rest and confirm pricing.
      </p>

      <button type="submit" className="estimate-calc-send-btn" disabled={!formComplete || status === "sending"}>
        {status === "sending" ? "Sending…" : "Start the Conversation"}
      </button>

      {status === "error" && (
        <p className="estimate-calc-error">
          Something went wrong sending your inquiry — please try again, or
          email us directly at hello@neatifulliving.com.
        </p>
      )}
    </form>
  );
}