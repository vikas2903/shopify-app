/**
 * Consistent HTML email templates for LayerUp (Support / Help).
 * Uses table-based layout and inline styles for broad email client support.
 */

const BRAND_NAME = "LayerUp";
const BRAND_COLOR = "#000000";
const BODY_BG = "#f4f4f5";
const CARD_BG = "#ffffff";
const TEXT = "#333333";
const TEXT_MUTED = "#6d7175";
const BORDER = "#e1e3e5";

function wrapEmail(bodyContent) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND_NAME}</title>
</head>
<body style="margin:0; padding:0; background-color:${BODY_BG}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; font-size: 15px; line-height: 1.5; color: ${TEXT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BODY_BG};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color:${CARD_BG}; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid ${BORDER};">
          <!-- Header -->
          <tr>
            <td style="padding: 24px 24px 16px 24px; border-bottom: 2px solid ${BRAND_COLOR};">
              <h1 style="margin:0; font-size: 22px; font-weight: 700; color: ${BRAND_COLOR}; letter-spacing: -0.02em;">${BRAND_NAME}</h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: ${TEXT_MUTED}; font-weight: 500;">Support</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 24px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 16px 24px 24px 24px; border-top: 1px solid ${BORDER}; font-size: 12px; color: ${TEXT_MUTED};">
              This email was sent by ${BRAND_NAME}. Please do not reply directly to this message.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label, value) {
  if (value === undefined || value === null || String(value).trim() === "") return "";
  return `
  <tr>
    <td style="padding: 8px 0 4px 0; font-weight: 600; color: ${TEXT_MUTED}; font-size: 13px; vertical-align: top;">${escapeHtml(String(label))}</td>
    <td style="padding: 8px 0 4px 0; font-size: 15px; vertical-align: top;">${escapeHtml(String(value))}</td>
  </tr>`;
}

function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  const s = String(str);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Admin notification: new support/help request received.
 * @param {{ type: 'support'|'help', shop: string, name: string, email: string, pagesStr: string, block: string, address: string }} data
 */
export function adminNotificationEmail(data) {
  const type = data?.type ?? "support";
  const shop = data?.shop ?? "";
  const name = data?.name ?? "";
  const email = data?.email ?? "";
  const pagesStr = data?.pagesStr ?? "";
  const block = data?.block ?? "";
  const address = data?.address ?? "";
  const title = type === "help" ? "New Help Request" : "New Support Request";
  const bodyContent = `
  <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: ${TEXT}; border-bottom: 1px solid ${BORDER}; padding-bottom: 8px;">${title} from ${escapeHtml(shop)}</h2>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px;">
    ${row("Name", name)}
    ${row("Email", email)}
    ${row("Shop", shop)}
    ${row("Pages", pagesStr)}
    ${row("Block", block)}
    ${row("Message", address)}
  </table>`;
  return wrapEmail(bodyContent);
}

/**
 * User confirmation: we received your request.
 * @param {{ name: string, shop: string, pagesStr: string, block: string, address: string, type?: 'support'|'help' }} data
 */
export function userConfirmationEmail(data) {
  const name = data?.name ?? "";
  const shop = data?.shop ?? "";
  const pagesStr = data?.pagesStr ?? "";
  const block = data?.block ?? "";
  const address = data?.address ?? "";
  const type = data?.type ?? "support";
  const intro = type === "help"
    ? "Thank you for contacting LayerUp. We have received your request and will get back to you shortly."
    : "Thank you for contacting LayerUp support. We have received your request and will get back to you shortly.";
  const bodyContent = `
  <p style="margin: 0 0 16px 0;">Hi ${escapeHtml(name)},</p>
  <p style="margin: 0 0 20px 0;">${intro}</p>
  <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: ${TEXT};">Your submitted details</h3>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
    ${row("Shop", shop)}
    ${row("Pages", pagesStr)}
    ${row("Block", block)}
    ${row("Message", address)}
  </table>
  <p style="margin: 24px 0 0 0;">Best regards,<br/><strong>${BRAND_NAME} Team</strong></p>`;
  return wrapEmail(bodyContent);
}
