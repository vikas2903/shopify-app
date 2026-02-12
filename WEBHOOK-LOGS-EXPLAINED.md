# When Do Webhook Logs Appear in Partner Dashboard?

## Quick Answer

**Webhook logs appear in Partner Dashboard → Monitoring → Webhooks when:**
- ✅ Shopify **actually sends** a webhook to your app
- ✅ Your app **responds** (successfully or with error)
- ✅ This works **BOTH before and after app approval** (development AND production)

**They do NOT appear:**
- ❌ When webhooks are just configured but not triggered
- ❌ When testing locally with scripts (unless using Shopify CLI trigger)
- ❌ When no events have occurred yet

---

## Detailed Explanation

### 1. **App Approval Status Does NOT Matter**

Webhook logs appear **regardless** of whether your app is:
- ✅ In development (not yet approved)
- ✅ Approved and published
- ✅ In review

**The logs show whenever Shopify sends webhooks to your app.**

---

### 2. **When GDPR Webhooks Are Triggered**

GDPR webhooks only appear in logs when **specific events happen**:

#### `customers/data_request`
- **Triggered when:** A customer requests to view their data
- **How to trigger:** 
  - Go to Shopify Admin → Customers → Select customer → More actions → **"Request customer data"**
- **Appears in logs:** ✅ Yes, immediately after triggering

#### `customers/redact`
- **Triggered when:** Store owner requests to delete customer data
- **How to trigger:**
  - Go to Shopify Admin → Customers → Select customer → More actions → **"Erase personal data"**
- **Appears in logs:** ✅ Yes, but may be delayed (up to 10 days in some cases)

#### `shop/redact`
- **Triggered when:** 48 hours after a store uninstalls your app
- **How to trigger:**
  - Uninstall your app from a test store → Wait 48 hours
- **Appears in logs:** ✅ Yes, after 48 hours

#### `app/uninstalled`
- **Triggered when:** A store uninstalls your app
- **How to trigger:**
  - Uninstall your app from a test store
- **Appears in logs:** ✅ Yes, immediately

---

### 3. **Why You Might Not See Logs**

#### Scenario 1: No Events Triggered Yet
- **Problem:** Webhooks are configured but no events have occurred
- **Solution:** Trigger the events manually (see section 2 above)

#### Scenario 2: App Not Installed on a Store
- **Problem:** Webhooks only fire when your app is installed on a store
- **Solution:** Install your app on a development store first

#### Scenario 3: Webhooks Not Properly Configured
- **Problem:** Webhook URLs might be incorrect or not deployed
- **Solution:** 
  1. Deploy your app: `shopify app deploy`
  2. Check Partner Dashboard → App setup → GDPR webhooks
  3. Verify URLs point to your production app

#### Scenario 4: Testing Locally
- **Problem:** Local test scripts don't create Partner Dashboard logs
- **Solution:** Use Shopify CLI trigger or trigger from Shopify Admin

---

### 4. **How to Check Webhook Status**

#### Option A: Partner Dashboard (Real Webhooks Only)
1. Go to **Partners → Your App → Monitoring → Webhooks**
2. Filter by date range (e.g., "Last 7 days")
3. Look for webhook deliveries with status:
   - ✅ **200 OK** = Success
   - ❌ **401** = HMAC verification failed
   - ❌ **500** = Server error
   - ❌ **Timeout** = App didn't respond in time

#### Option B: Server Logs (All Requests)
1. Check your **server console/logs** (terminal or hosting platform)
2. Look for `[WEBHOOK ...]` log messages
3. This shows ALL webhook requests, even test ones

#### Option C: Test Scripts (Local Testing)
1. Run `npm run test:webhooks` (doesn't create Dashboard logs)
2. Check terminal output for 200/401 responses
3. This verifies your endpoints work correctly

---

### 5. **Testing Webhooks During Development**

#### Method 1: Trigger from Shopify Admin (Shows in Dashboard)
1. Install app on a development store
2. Trigger the event (e.g., "Request customer data")
3. Check Partner Dashboard → Monitoring → Webhooks
4. ✅ **This WILL show in logs**

#### Method 2: Shopify CLI Trigger (Shows in Dashboard)
```bash
shopify app webhook trigger \
  --topic customers/redact \
  --address https://your-app-url.com/webhooks/customers/redact \
  --client-secret YOUR_SHOPIFY_API_SECRET \
  --api-version 2024-07
```
- ✅ **This WILL show in Dashboard logs**

#### Method 3: Local Test Script (Does NOT Show in Dashboard)
```bash
npm run test:webhooks
```
- ❌ **This does NOT create Dashboard logs**
- ✅ **But verifies your endpoints work**

---

### 6. **Checklist: Why No Logs Are Showing**

- [ ] Is your app installed on a development store?
- [ ] Have you deployed your app (`shopify app deploy`)?
- [ ] Are webhook URLs correct in Partner Dashboard?
- [ ] Have you actually triggered the webhook events?
- [ ] Is your app URL accessible (not localhost)?
- [ ] Are you checking the correct date range in Dashboard?
- [ ] Is `SHOPIFY_API_SECRET` set correctly?

---

### 7. **Summary**

| Situation | Logs in Dashboard? |
|-----------|-------------------|
| App approved, webhook triggered | ✅ Yes |
| App in development, webhook triggered | ✅ Yes |
| Webhook configured but not triggered | ❌ No |
| Testing with local script | ❌ No |
| Testing with Shopify CLI trigger | ✅ Yes |
| Testing from Shopify Admin | ✅ Yes |

**Bottom line:** Logs appear when Shopify **actually sends** webhooks to your app, regardless of approval status. If you're not seeing logs, the webhooks likely haven't been triggered yet.

---

## Next Steps

1. **Deploy your app:** `shopify app deploy`
2. **Install on a dev store:** Partners → Dev stores → Install app
3. **Trigger a webhook:** Follow instructions in section 2
4. **Check logs:** Partners → Your App → Monitoring → Webhooks
