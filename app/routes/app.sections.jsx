import React, { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Banner,
  Button,
  TextField,
  BlockStack,
  Card,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import fetch from "node-fetch";
import mongoose from "mongoose";
import SectionUsage from "../backend/modals/sectionUsage.js";
import SectionUploadNotification from "../components/SectionUploadNotification";
import {
  shopableVideoSection,
  SHOPABLE_VIDEO_KEY,
} from "../data/shopableVideoSection.js";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);

    if (!session) {
      throw new Error("No session found. Please authenticate first.");
    }

    const shopFull = session.shop;
    const shopShort = shopFull.split(".")[0];
    const accessToken = session.accessToken;

    const scopeValue = session.scope || "";
    const currentScopes =
      typeof scopeValue === "string"
        ? scopeValue
        : Array.isArray(scopeValue)
          ? scopeValue.join(",")
          : "";
    const scopeArray = currentScopes
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    if (!shopFull) {
      throw new Error("Shop domain not found in session");
    }
    if (!accessToken) {
      throw new Error("Access token not found in session");
    }

    const hasReadThemes =
      currentScopes.includes("read_themes") ||
      scopeArray.includes("read_themes");
    const hasWriteThemes =
      currentScopes.includes("write_themes") ||
      scopeArray.includes("write_themes");

    if (!hasWriteThemes) {
      throw new Error(
        `Missing scope 'write_themes'. Your app needs theme write permission. Current scopes: ${currentScopes || "None"}. Clear session and re-authorize.`
      );
    }

    let themeId = null;
    let needsManualThemeId = false;

    if (hasReadThemes) {
      const apiUrl = `https://${shopFull}/admin/api/2024-07/themes.json`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.themes && Array.isArray(data.themes)) {
          const mainTheme = data.themes.find((t) => t.role === "main");
          themeId = mainTheme?.id || null;
        }
      }
      if (!themeId) needsManualThemeId = true;
    } else {
      needsManualThemeId = true;
    }

    // Database: track which store has used the section
    let sectionAlreadyUsed = false;
    let sectionUsedAt = null;
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    const usage = await SectionUsage.findOne({
      shop: shopFull,
      sectionKey: SHOPABLE_VIDEO_KEY,
    });
    if (usage) {
      sectionAlreadyUsed = true;
      sectionUsedAt = usage.usedAt;
    }

    return json({
      shop: shopShort,
      shopFull,
      themeId,
      accessToken,
      success: true,
      hasWriteThemes,
      hasReadThemes,
      needsManualThemeId,
      sectionAlreadyUsed,
      sectionUsedAt: sectionUsedAt ? sectionUsedAt.toISOString() : null,
    });
  } catch (error) {
    console.error("Loader Error:", error);
    return json(
      {
        success: false,
        error: error.message,
        needsReinstall:
          error.message.includes("Missing required scope") ||
          error.message.includes("403"),
      },
      { status: 500 }
    );
  }
};

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, { status: 405 });
  }
  try {
    const { session } = await authenticate.admin(request);
    const formData = await request.formData();
    const themeId = formData.get("themeId");
    const actionType = formData.get("action");

    if (actionType !== "uploadSection" || !themeId) {
      return json(
        { success: false, error: "Missing themeId or action" },
        { status: 400 }
      );
    }

    const shopFull = session.shop;
    const accessToken = session.accessToken;
    const filePath = `sections/${shopableVideoSection.sectionName}.liquid`;

    const putUrl = `https://${shopFull}/admin/api/2024-07/themes/${themeId}/assets.json`;
    const response = await fetch(putUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        asset: {
          key: filePath,
          value: shopableVideoSection.liquidCode,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.errors
          ? JSON.stringify(errData.errors)
          : `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    await SectionUsage.findOneAndUpdate(
      { shop: shopFull, sectionKey: SHOPABLE_VIDEO_KEY },
      { themeId: String(themeId), usedAt: new Date() },
      { upsert: true }
    );

    return json({ success: true });
  } catch (error) {
    console.error("Upload action error:", error);
    return json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

const SectionsPage = () => {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const [manualThemeId, setManualThemeId] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);

  const themeId =
    loaderData.themeId ||
    (manualThemeId.trim() ? String(manualThemeId).trim() : null);

  useEffect(() => {
    if (fetcher.data?.success) {
      setNotificationOpen(true);
    }
  }, [fetcher.data]);

  if (!loaderData.success) {
    return (
      <Page fullWidth>
        <TitleBar title="Sections" />
        <Layout>
          <Layout.Section>
            <Banner status="critical" title="Error Loading Sections">
              <div style={{ whiteSpace: "pre-line" }}>
                <p>{loaderData.error || "Failed to load sections."}</p>
                {loaderData.needsReinstall && (
                  <Button
                    primary
                    onClick={() => (window.location.href = "/app/clear-session")}
                  >
                    Clear Session & Re-authorize
                  </Button>
                )}
              </div>
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const {
    shopFull,
    hasWriteThemes,
    hasReadThemes,
    needsManualThemeId,
    sectionAlreadyUsed,
    sectionUsedAt,
  } = loaderData;

  const handleUpload = () => {
    if (!themeId) return;
    const form = new FormData();
    form.append("action", "uploadSection");
    form.append("themeId", themeId);
    fetcher.submit(form, { method: "post" });
  };

  return (
    <Page fullWidth>
      <TitleBar title="Sections" />

      <Layout>
        <Layout.Section>
          <Banner
            status={hasWriteThemes ? "success" : "warning"}
            title={hasWriteThemes ? "Asset API upload enabled" : "Theme write scope missing"}
          >
            <p>
              {hasWriteThemes
                ? hasReadThemes && themeId
                  ? `Live theme selected (ID: ${themeId}). Upload the Shopable Video section below.`
                  : needsManualThemeId
                    ? "You have write_themes but not read_themes. Enter your live theme ID below. Find it in Shopify Admin: Online Store → Themes → … → Edit code (theme ID in the URL)."
                    : "Enter your theme ID below if it wasn’t detected."
                : "Clear session and re-authorize to get write_themes."}
            </p>
          </Banner>

          {needsManualThemeId && (
            <div style={{ marginTop: 16, maxWidth: 400 }}>
              <BlockStack gap="300">
                <TextField
                  label="Theme ID (required to upload)"
                  value={manualThemeId}
                  onChange={setManualThemeId}
                  placeholder="e.g. 123456789012"
                  helpText="Online Store → Themes → … → Edit code. Theme ID is in the URL."
                  autoComplete="off"
                />
              </BlockStack>
            </div>
          )}

          {themeId && (
            <div style={{ padding: "20px 0" }}>
              <Card>
                <div style={{ padding: "16px" }}>
                  <div style={{ marginBottom: "16px", borderRadius: 8, overflow: "hidden" }}>
                    <img
                      src={shopableVideoSection.image}
                      alt={shopableVideoSection.title}
                      style={{ width: "100%", height: 200, objectFit: "cover" }}
                    />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                    {shopableVideoSection.title}
                  </h3>
                  <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.5 }}>
                    {shopableVideoSection.description}
                  </p>
                  {sectionAlreadyUsed && (
                    <Banner status="info" style={{ marginTop: 12 }}>
                      Section already used
                      {sectionUsedAt && (
                        <span style={{ marginLeft: 8, opacity: 0.9 }}>
                          (uploaded {new Date(sectionUsedAt).toLocaleDateString()})
                        </span>
                      )}
                    </Banner>
                  )}
                  <div style={{ marginTop: 16 }}>
                    <Button
                      primary
                      onClick={handleUpload}
                      loading={fetcher.state === "submitting"}
                      disabled={fetcher.state === "submitting"}
                    >
                      {fetcher.state === "submitting"
                        ? "Uploading…"
                        : "Upload Section"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </Layout.Section>
      </Layout>

      <SectionUploadNotification
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        section={shopableVideoSection}
        shopFull={shopFull}
        themeId={themeId}
      />
    </Page>
  );
};

export default SectionsPage;
