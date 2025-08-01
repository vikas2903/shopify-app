import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Page, BlockStack, Text, Select, Button, Banner } from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server.js";

export const loader = async ({ request }) => {
  try {
    console.log("🚀 Loader started");
    
    const { session } = await authenticate.admin(request);
    
    if (!session) {
      throw new Error("No session found. Please authenticate first.");
    }
    
    const shopFull = session.shop;
    const accessToken = session.accessToken;
    const currentScopes = session.scope || '';

    console.log("🔍 Debug Info:");
    console.log("Shop Name:", shopFull);
    console.log("Access Token:", accessToken ? "Present" : "Missing");
    console.log("Current Scopes:", currentScopes);
    console.log("Session ID:", session.id);

    // Validate session data
    if (!shopFull) {
      throw new Error("Shop domain not found in session");
    }

    if (!accessToken) {
      throw new Error("Access token not found in session");
    }

    // Check if we have any scopes at all
    if (!currentScopes) {
      throw new Error("No scopes found. Please reinstall the app to get proper permissions.");
    }

    // Check specifically for theme scopes
    if (!currentScopes.includes('read_themes')) {
      throw new Error(`Missing required scope 'read_themes'. Current scopes: ${currentScopes}`);
    }

    // Try to get themes using REST API
    console.log("🔄 Attempting to fetch themes...");
    
    const apiUrl = `https://${shopFull}/admin/api/2024-01/themes.json`;
    console.log("📡 API URL:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response status text:", response.statusText);
    console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
      } catch (e) {
        console.error("❌ Could not read error response:", e);
        errorText = 'Could not read error response';
      }
      
      if (response.status === 403) {
        throw new Error(`Access forbidden (403). Your app needs theme permissions. Current scopes: ${currentScopes}. Error: ${errorText}`);
      } else if (response.status === 401) {
        throw new Error(`Authentication failed (401). Please reinstall the app. Error: ${errorText}`);
      } else if (response.status === 404) {
        throw new Error(`API endpoint not found (404). This might be a configuration issue. Error: ${errorText}`);
      } else {
        throw new Error(`API request failed: ${response.status} ${response.statusText}. Error: ${errorText}`);
      }
    }

    let data;
    try {
      data = await response.json();
      console.log("✅ Successfully fetched themes:", data);
    } catch (e) {
      console.error("❌ Failed to parse JSON response:", e);
      throw new Error("Invalid JSON response from Shopify API");
    }

    if (!data) {
      throw new Error("Empty response from Shopify API");
    }

    if (!data.themes || !Array.isArray(data.themes)) {
      console.error("❌ Invalid response format:", data);
      throw new Error("Invalid response format - no themes array found");
    }

    const themes = data.themes.map(theme => ({
      id: theme.id.toString(),
      name: theme.name,
      role: theme.role.toUpperCase()
    }));

    console.log("📋 Processed themes:", themes);

    return json({
      themes,
      shop: session.shop,
      error: null,
      debug: {
        scopes: currentScopes,
        themeCount: themes.length,
        apiUrl: apiUrl,
        responseStatus: response.status
      }
    });

  } catch (error) {
    console.error("💥 Loader error:", error);
    console.error("💥 Error stack:", error.stack);
    
    return json({
      themes: [],
      shop: null,
      error: {
        message: error.message,
        type: error.name || 'UnknownError',
        stack: error.stack
      },
      debug: {
        scopes: 'unknown',
        errorTime: new Date().toISOString()
      }
    }, { status: 500 });
  }
};

export default function ThemesPage() {
  const { themes, shop, error, debug } = useLoaderData();
  const [selectedThemeId, setSelectedThemeId] = useState(
    themes.length > 0 ? themes[0].id : ""
  );

  const handleSelectChange = (value) => {
    setSelectedThemeId(value);
  };

  const themeOptions = themes.map((theme) => ({
    label: `${theme.name}${theme.role === "MAIN" ? " 🟢" : ""}`,
    value: theme.id,
  }));

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);
  const themeId = selectedTheme?.id;

  const themeEditorUrl = `https://${shop}/admin/themes/${themeId}/editor`;
  const codeEditorUrl = `https://${shop}/admin/themes/${themeId}`;

  // Show error banner if there's an error
  if (error) {
    return (
      <Page title="Store Themes" fullWidth>
        <Banner
          title="Theme Access Error"
          tone="critical"
        >
          <p><strong>Error:</strong> {error.message}</p>
          <p><strong>Type:</strong> {error.type}</p>
          {debug && (
            <>
              <p><strong>Debug Info:</strong></p>
              <ul>
                <li>Scopes: {debug.scopes}</li>
                {debug.apiUrl && <li>API URL: {debug.apiUrl}</li>}
                {debug.responseStatus && <li>Response Status: {debug.responseStatus}</li>}
                {debug.errorTime && <li>Error Time: {debug.errorTime}</li>}
              </ul>
            </>
          )}
          
          <p><strong>To fix this:</strong></p>
          <ol>
            <li>Go to your Shopify admin</li>
            <li>Navigate to Apps → LayerUp</li>
            <li>Click "Uninstall app"</li>
            <li>Wait 30 seconds</li>
            <li>Go to your app URL and reinstall it</li>
            <li>Make sure to accept all permissions when prompted</li>
          </ol>
          
          <p><strong>Note:</strong> This error usually means the app needs to be reinstalled to get the correct permissions.</p>
          
          <p><strong>Console Logs:</strong> Check your browser's developer console (F12) for detailed error information.</p>
        </Banner>
      </Page>
    );
  }

  return (
    <Page title="Store Themes">
      {debug && (
        <Banner
          title="Debug Info"
          tone="info"
        >
          <p>Scopes: {debug.scopes}</p>
          <p>Themes found: {debug.themeCount}</p>
        </Banner>
      )}
      
      <BlockStack gap="400">
        {themes.length === 0 ? (
          <Banner
            title="No Themes Found"
            tone="warning"
          >
            <p>No themes were found for this store. This might indicate a permission issue.</p>
          </Banner>
        ) : (
          <>
            <Select
              label="Select a theme"
              options={themeOptions}
              onChange={handleSelectChange}
              value={selectedThemeId}
            />

            <Card>
              <BlockStack gap="200">
                <Text variant="bodyMd">
                  Selected theme:{" "}
                  {themes.find((t) => t.id === selectedThemeId)?.name || "None"}
                </Text>

                {selectedTheme && (
                  <BlockStack gap="200">
                    <Button
                      onClick={() => window.open(themeEditorUrl, "_blank")}
                      variant="primary"
                    >
                      Customize
                    </Button>

                    <Button
                      onClick={() => window.open(codeEditorUrl, "_blank")}
                      variant="primary"
                    >
                      Edit Code
                    </Button>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          </>
        )}
      </BlockStack>
    </Page>
  );
}