# GDPR Mandatory Compliance Webhooks — LayerUp App

This document describes how **LayerUp** implements Shopify’s mandatory compliance webhooks for App Store review.

---

## 1. Subscriptions (shopify.app.toml)

The app is subscribed to all three mandatory compliance webhooks:

| Topic | URI |
|-------|-----|
| `customers/data_request` | `/webhooks/customers/data_request` |
| `customers/redact` | `/webhooks/customers/redact` |
| `shop/redact` | `/webhooks/shop/redact` |

Configured in `shopify.app.toml` under `[webhooks]` with `compliance_topics` and the URIs above.

---

## 2. Implementation Summary

- **POST only**: All three endpoints accept POST; non-POST (e.g. GET) receive 405 Method Not Allowed where applicable; loaders return 200 for compatibility.
- **JSON body**: Handlers read `Content-Type: application/json` and parse the JSON payload.
- **HMAC verification**: Every POST is verified using `X-Shopify-Hmac-Sha256` and `SHOPIFY_API_SECRET`. Invalid or missing HMAC → **401 Unauthorized**.
- **Response**: Valid requests receive a **200**-series JSON response (e.g. `{"received":true}`) to confirm receipt.

---

## 3. Per-Topic Behavior

### customers/data_request

- **Purpose**: Customer requested to view their data.
- **Action**: App does **not** store customer or order PII. We acknowledge receipt with **200** and do not return customer data.

### customers/redact

- **Purpose**: Store owner requested deletion of customer data.
- **Action**: App does **not** store customer or order PII. We acknowledge receipt with **200**. No customer data is retained to delete.

### shop/redact

- **Purpose**: 48 hours after uninstall; delete all app data for the shop.
- **Action**: We **delete all data** for the shop:
  - **Prisma (Session)**: All sessions for `shop_domain` are deleted.
  - **MongoDB (Store)**: The store document for `shop_domain` (shop + accessToken) is deleted.
- We then respond with **200** to confirm receipt.

---

## 4. How to Verify

1. **Local / automated**: Run `npm run test:webhooks` (see `TESTING-WEBHOOKS.md`). Ensures invalid HMAC → 401, valid HMAC → 200 for all three endpoints.
2. **Shopify CLI**: Use `shopify app webhook trigger --topic <topic> --address <app-base-url>/webhooks/...` for each topic (see `TESTING-WEBHOOKS.md`).
3. **Production**: Ensure `SHOPIFY_API_SECRET` is set in the production environment so HMAC verification works.

---

## 5. Checklist for Review

- [x] Subscribed to `customers/data_request`, `customers/redact`, `shop/redact` in `shopify.app.toml`
- [x] POST with JSON body and `Content-Type: application/json` handled
- [x] Invalid Shopify HMAC → 401 Unauthorized
- [x] Valid request → 200 (or 200-series) response to confirm receipt
- [x] `shop/redact` deletes all stored data for the shop (Prisma Session + MongoDB Store)
- [x] `customers/data_request` and `customers/redact` acknowledged (no customer PII stored)

---

**Code locations**

- HMAC and response helpers: `app/utils/gdprWebhook.js`
- Route handlers: `app/routes/webhooks/customers/data_request.js`, `app/routes/webhooks/customers/redact.js`, `app/routes/webhooks/shop/redact.js` (and equivalent flat routes under `app/routes/`)
