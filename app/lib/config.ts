// neatiful — Estimate Submission Config
//
// This URL is a Power Automate "When an HTTP request is received" trigger.
// Replace the placeholder below once that flow is created (see setup steps
// provided alongside this file). The flow should, on receiving this payload:
//   1. Send a notification email to hello@neatifulliving.com (same shared
//      inbox your Microsoft Forms submissions already notify)
//   2. Append a row to the CRM Pipeline / Calculo de Cotizaciones workbook,
//      so estimates from the website land in the exact same system as
//      Forms submissions do today.
//
// Until this is set to a real URL, submissions will fail gracefully and
// show the user an error message rather than silently losing their info.

export const ESTIMATE_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_ESTIMATE_WEBHOOK_URL || "REPLACE_WITH_POWER_AUTOMATE_URL";

export const WEBHOOK_CONFIGURED = ESTIMATE_WEBHOOK_URL !== "REPLACE_WITH_POWER_AUTOMATE_URL";

// neatiful — Airbnb Turnover Inquiry Config
//
// This URL is a separate Power Automate "When an HTTP request is received"
// trigger, dedicated to Airbnb Turnover inquiries (not the general estimate
// flow above). On receiving this payload, the flow should:
//   1. Send a notification email to hello@neatifulliving.com so a rep can
//      start the relationship personally
//   2. Append a row to its own tab in the CRM — Airbnb inquiries carry
//      different fields (property count, not sqft/condition) than the
//      general Quote Requests sheet, so they don't belong in the same table.
//
// Unlike ESTIMATE_WEBHOOK_URL above, this is intentionally NOT prefixed
// with NEXT_PUBLIC_ — it's only ever read inside the /api/airbnb-inquiry
// server route, never exposed to the browser.
//
// Until this is set to a real URL, submissions will fail gracefully and
// show the user an error message rather than silently losing their info.

export const AIRBNB_INQUIRY_WEBHOOK_URL =
  process.env.AIRBNB_INQUIRY_WEBHOOK_URL || "REPLACE_WITH_POWER_AUTOMATE_URL";

export const AIRBNB_WEBHOOK_CONFIGURED =
  AIRBNB_INQUIRY_WEBHOOK_URL !== "REPLACE_WITH_POWER_AUTOMATE_URL";