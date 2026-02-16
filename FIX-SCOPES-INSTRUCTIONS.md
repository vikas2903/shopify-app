# Fix Session Scopes Issue

## Problem
Even after reinstalling the app, the session in Prisma database still has old scopes without `read_themes`.

## Solution Steps

### Option 1: Use the Clear Session Page (Easiest)

1. **Go to:** `/app/clear-session` in your app
2. **Check current scopes** - You'll see what scopes are currently stored
3. **Click "Clear Session & Re-authorize"**
4. **Re-authorize** - Grant all permissions when prompted
5. **Check server logs** - Look for the `afterAuth` logs showing granted scopes

### Option 2: Check Debug Page

1. **Go to:** `/app/debug-scopes`
2. **See detailed scope information:**
   - What's in the session from `authenticate.admin()`
   - What's stored in the database
   - Scope analysis showing if `read_themes` is present

### Option 3: Manual Database Fix (If needed)

If the above doesn't work, manually check/fix the Prisma database:

#### Check Current Sessions:
```bash
# Using SQLite command line (if you have it)
sqlite3 prisma/dev.sqlite "SELECT id, shop, scope FROM Session WHERE shop = 'd2c-apps.myshopify.com';"
```

#### Delete Sessions Manually:
```bash
sqlite3 prisma/dev.sqlite "DELETE FROM Session WHERE shop = 'd2c-apps.myshopify.com';"
```

#### Or use Node script:
```bash
node scripts/fix-session-scopes.js
```

### Option 4: Verify Partner Dashboard

1. Go to **Partners → LayerUp → Versions → Active version**
2. Check **"Scopes"** section
3. Should show: `read_products`, `read_themes`, `write_themes`
4. If `read_themes` is missing:
   - Run: `shopify app deploy`
   - Wait 5-10 minutes
   - Then clear session and re-auth

## What to Check After Re-authorization

### Server Console Logs:
Look for these logs after re-authorization:
```
🔐 Auth completed for shop: d2c-apps.myshopify.com
📋 Granted scopes (raw): read_products,read_themes,write_themes
📋 Has read_themes: true
```

### Debug Page:
Visit `/app/debug-scopes` and verify:
- ✅ `Has read_themes: ✅ Yes`
- ✅ Scope includes all three: `read_products`, `read_themes`, `write_themes`

## If Still Not Working

1. **Check Partner Dashboard** - Ensure scopes are configured correctly
2. **Wait 10 minutes** after `shopify app deploy` for changes to propagate
3. **Clear browser cache** and cookies
4. **Check server logs** during OAuth flow to see what Shopify actually grants
5. **Verify** `shopify.app.toml` has: `scopes = "read_themes,write_themes,read_products"`
6. **Verify** `shopify.server.js` has: `scopes: ["read_themes", "write_themes", "read_products"]`

## Expected Behavior

After successful re-authorization:
- Session scope should be: `read_products,read_themes,write_themes` (or similar comma-separated string)
- `/app/sections-new` should work without errors
- `/app/debug-scopes` should show `Has read_themes: ✅ Yes`
