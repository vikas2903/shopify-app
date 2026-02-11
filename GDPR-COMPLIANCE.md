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

## 4. How the Shopify App Review Team Verifies GDPR

Shopify does **not** use Google Console for app review (Google Console is for Android/Google Play). For Shopify apps, verification works like this:

1. **Subscription check**  
   They confirm your app is subscribed to all three mandatory compliance webhooks. That comes from:
   - Your **shopify.app.toml** (and/or what’s synced to the **Partner Dashboard** when you run `shopify app deploy`).

2. **Partner Dashboard → GDPR webhooks**  
   - Go to **[Partners](https://partners.shopify.com) → Your app → App setup**.  
   - Find the **“GDPR mandatory webhooks”** (or “Event subscriptions” / “Webhooks”) section.  
   - There you’ll see the three topics and the **URLs** Shopify will call.  
   - Review team uses these same subscriptions to know where to send test webhooks.

3. **Sending test requests**  
   Review typically verifies that:
   - Sending a POST **with an invalid or missing HMAC** → your app returns **401 Unauthorized**.  
   - Sending a POST **with a valid HMAC** (using your app’s secret) → your app returns **200** (or another 2xx).  
   So they effectively “ping” your three URLs and check status codes and possibly response body.

4. **Rejection if wrong**  
   If mandatory webhook URLs are missing or responses don’t match the requirements (e.g. no 401 for bad HMAC, or no 2xx for valid request), the app is **rejected** and you must fix and resubmit.

---

## 5. How to Check GDPR Yourself (Console, Network, Dashboard)

### There is no “Google Console” for Shopify GDPR

- **Google Console** (e.g. Google Play Console) is for Android apps.  
- For **Shopify** apps, you use **Shopify Partner Dashboard** and your own **server logs / network** (below).

### Where to verify

| Where | What you see |
|-------|-------------------------------|
| **Partner Dashboard** | Partners → Your app → **App setup** → **GDPR mandatory webhooks** (or Event subscriptions). Shows the three topics and the **callback URLs** Shopify will call. |
| **Server console / logs** | When Shopify (or you) sends a webhook, the request hits **your server**, so you see it in your **Node/Remix server logs** (e.g. `[WEBHOOK shop/redact]`, `[WEBHOOK customers/redact]`). Run the app locally or check your host’s logs (e.g. Render, Heroku). |
| **Network (browser)** | The browser **Network** tab only shows requests **from the browser** to your app. GDPR webhooks are sent **from Shopify’s servers to your app**, so they do **not** appear in the browser Network tab. To “see” them: use **server logs** (above) or a request-inspection tool (e.g. ngrok, Runscope) that logs incoming requests to your app URL. |
| **CLI / script** | Use `npm run test:webhooks` or `shopify app webhook trigger ...` to send test POSTs to your app; watch the **same server console** for the log lines and confirm 401 for invalid HMAC and 200 for valid HMAC. |

### Quick self-check

1. **Partner Dashboard**: Confirm all three GDPR webhook URLs are set and point to your live app (e.g. `https://layerup.onrender.com/webhooks/...`).  
2. **Server logs**: Trigger a test (e.g. `npm run test:webhooks` with app running) and confirm in the **terminal/server console** that you see the webhook logs and 200 responses.  
3. **Production env**: Ensure `SHOPIFY_API_SECRET` is set in production so real webhooks from Shopify get a valid HMAC and return 200.

---

## 6. How to Verify (Testing)

1. **Local / automated**: Run `npm run test:webhooks` (see `TESTING-WEBHOOKS.md`). Ensures invalid HMAC → 401, valid HMAC → 200 for all three endpoints.
2. **Shopify CLI**: Use `shopify app webhook trigger --topic <topic> --address <app-base-url>/webhooks/...` for each topic (see `TESTING-WEBHOOKS.md`).
3. **Production**: Ensure `SHOPIFY_API_SECRET` is set in the production environment so HMAC verification works.
4. **From Shopify Admin** (real flow): In a development store, **Customers** → open a customer → use **“Request customer data”** or **“Erase personal data”** to trigger `customers/data_request` or (after Shopify’s delay) `customers/redact`; watch your **server logs** for the incoming webhook.

---

## 7. Checklist for Review

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
