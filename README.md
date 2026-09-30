# neatiful — Website & Estimate Calculator (Portfolio Version)

> **This is a public portfolio copy of a private company repository.**
> The code and structure are the same as production, but all pricing data
> and business details have been replaced with placeholders to protect
> Orivallis LLC's proprietary information. The prices shown are not real.

neatiful is a cleaning and organizing startup in Austin, Texas, that I
co-founded. This is its website, built with **Next.js, React, and TypeScript**.
Its core feature is an instant estimate calculator: customers get a real
price before contacting the company, instead of waiting for a call.

## What it does

- **Instant estimates** for residential, move in/out, office, post-construction,
  carpet, and decluttering & organization services
- **Service pages** for each service line
- **Estimate submission:** customers can send their estimate to the team,
  which feeds the company's CRM through Power Automate webhooks
- **Airbnb Turnover inquiries** through a dedicated server route

## Engineering decisions worth noting

**One source of truth for pricing.** Every rate lives in
[`app/lib/pricing.ts`](app/lib/pricing.ts). The calculator reads from it, and
in production it mirrors the company's internal pricing spreadsheet exactly,
so the website and the CRM never disagree on a price.

**Interpolated price tables.** Prices are defined at square-footage
breakpoints and linearly interpolated between them, so any home size gets a
consistent price without a giant lookup table. Commercial pricing uses
fixed tiers with nearest-tier matching instead.

**A condition multiplier, with a limit.** The space's condition adjusts the
price, but the most severe level deliberately returns a manual quote rather
than an automatic number that could mislead the customer.

**No price before real input.** The calculator shows nothing until the
customer picks a service, square footage, and condition, because an early
default number would look like their actual quote.

**No double charging.** Add-ons already included in a service are greyed out
and removed automatically when the customer switches services.

**Traceable ZIP classification.** Travel fees use the official USPS list of
Austin ZIP codes rather than a prefix guess (a prefix match misclassified
areas like Lakeway and West Lake Hills). Business judgment calls, like
treating an adjacent town as core, are kept in a separate list so official
data and decisions never get mixed up.

**Secrets stay on the server.** The Airbnb inquiry webhook is read only
inside a server route (`app/api/airbnb-inquiry/route.ts`), so its URL never
reaches the browser. Both webhooks fail gracefully with a clear message to
the user instead of silently losing their information.

**Privacy by default.** Contact details are only sent when the customer
clicks "Send," which the form states explicitly.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Without webhook environment variables,
estimate submissions show a friendly error instead of sending, by design.

## How it was built

I designed the pricing logic, the calculator's user flow, and the site's
structure, and I wrote and debugged the code with AI assistance (Claude),
using it as a tutor and code reviewer. I verify calculator results against
the company's pricing spreadsheet, including edge cases, before calling a
feature done.

## Author

**Jonathan Zarazua** — co-founder, neatiful (Orivallis LLC)
[github.com/jonZ-111](https://github.com/jonZ-111)

---

© Orivallis LLC. All rights reserved. This code is shared for portfolio
review only and may not be copied or reused.
