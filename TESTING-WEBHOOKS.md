# Testing GDPR Webhooks

Three ways to verify your mandatory compliance webhooks work.

---

## 1. Local script (fastest)

Tests all three GDPR endpoints: invalid HMAC → **401**, valid HMAC → **200**.

### Steps

1. **Start the app** (in one terminal):
   ```bash
   npm run dev
   ```
   Note the URL shown (e.g. `http://localhost:59190`).

2. **Run the test** (in another terminal), using the **same** URL and port:
   ```bash
   # Use the URL from step 1 (replace port if yours is different)
   set WEBHOOK_TEST_URL=http://localhost:59190
   npm run test:webhooks
   ```
   On macOS/Linux use `export WEBHOOK_TEST_URL=http://localhost:59190` instead of `set`.

3. **Ensure `.env` has `SHOPIFY_API_SECRET`** so the “valid HMAC” request returns 200. Without it, both requests return 401.

**Expected output:**
- Invalid HMAC: `401 ✅ (expected 401)`
- Valid HMAC: `200 ✅ (expected 200)` (when `SHOPIFY_API_SECRET` is set)

---

## 2. Shopify CLI trigger (real delivery)

Sends a sample payload from Shopify to your app. Use after the app is reachable (tunnel or deployed).

```bash
# From your app root (ds-app)
shopify app webhook trigger --topic customers/redact --address https://your-app-url.com/webhooks/customers/redact --client-secret YOUR_SHOPIFY_API_SECRET --api-version 2024-07
```

Replace:
- `https://your-app-url.com` with your real URL (e.g. `https://layerup.onrender.com` or your tunnel URL).
- `YOUR_SHOPIFY_API_SECRET` with your app’s API secret (from Partner Dashboard or `.env`).

**Other GDPR topics:**
- `customers/data_request` → `/webhooks/customers/data_request`
- `customers/redact` → `/webhooks/customers/redact`
- `shop/redact` → `/webhooks/shop/redact`

For **local** testing with a tunnel (e.g. from `shopify app dev`), use the tunnel URL as `--address`.

---

## 3. Manual curl (single request)

**Invalid HMAC (must get 401):**
```bash
curl -X POST http://localhost:3000/webhooks/customers/redact \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Hmac-Sha256: invalid" \
  -d "{\"shop_domain\":\"test.myshopify.com\"}"
```

**Valid HMAC** (replace `YOUR_SECRET` with `SHOPIFY_API_SECRET`; body and HMAC must match):
```bash
# On Windows PowerShell, generating HMAC is easier with the Node script above.
# Or use the test script: npm run test:webhooks
```

---

## Checklist

- [ ] Invalid HMAC → **401 Unauthorized** (JSON body)
- [ ] Valid HMAC → **200 OK** with JSON (e.g. `{"received":true}`)
- [ ] Only **POST** accepted (e.g. GET returns 200 from loader; POST goes to action)
- [ ] All three endpoints work: `customers/data_request`, `customers/redact`, `shop/redact`
