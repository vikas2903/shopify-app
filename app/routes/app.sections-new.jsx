import React, { useState } from 'react';
import { Page, Layout, Grid, Banner, Button, TextField, BlockStack } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import { authenticate } from '../shopify.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import fetch from 'node-fetch';
import SectionCard from '../components/SectionCard';
import SectionUploadNotification from '../components/SectionUploadNotification';
import { sectionsData } from '../data/sectionsData';

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    
    if (!session) {
      throw new Error('No session found. Please authenticate first.');
    }

    const shopFull = session.shop;
    const shopShort = shopFull.split('.')[0];
    const accessToken = session.accessToken;
    
    // Handle scope as string (comma-separated) or array
    const scopeValue = session.scope || '';
    const currentScopes = typeof scopeValue === 'string' ? scopeValue : (Array.isArray(scopeValue) ? scopeValue.join(',') : '');
    const scopeArray = currentScopes.split(',').map(s => s.trim()).filter(s => s);

    console.log('🔍 Sections Page Debug:');
    console.log('Shop Name:', shopFull);
    console.log('Access Token:', accessToken ? 'Present' : 'Missing');
    console.log('Session Scope (raw):', session.scope);
    console.log('Session Scope (type):', typeof session.scope);
    console.log('Current Scopes (string):', currentScopes);
    console.log('Current Scopes (array):', scopeArray);
    console.log('Session ID:', session.id);
    console.log('Session Full:', JSON.stringify(session, null, 2));

    if (!shopFull) {
      throw new Error('Shop domain not found in session');
    }

    if (!accessToken) {
      throw new Error('Access token not found in session');
    }

    // Check if we have theme scopes (handle both string and array formats)
    const hasReadThemes = currentScopes.includes('read_themes') || scopeArray.includes('read_themes');
    const hasWriteThemes = currentScopes.includes('write_themes') || scopeArray.includes('write_themes');

    // Need at least write_themes to upload; read_themes is used to auto-detect main theme
    if (!hasWriteThemes) {
      throw new Error(`Missing scope 'write_themes'. Your app needs theme write permission to upload sections. Current scopes: ${currentScopes || 'None'}. Clear session and re-authorize.`);
    }

    let themeId = null;
    let needsManualThemeId = false;

    if (hasReadThemes) {
      // Fetch themes from Shopify API
      const apiUrl = `https://${shopFull}/admin/api/2024-07/themes.json`;
      console.log('📡 Fetching themes from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        if (data.themes && Array.isArray(data.themes)) {
          const mainTheme = data.themes.find(theme => theme.role === 'main');
          themeId = mainTheme?.id || null;
        }
      }
      if (!themeId) {
        needsManualThemeId = true;
      }
    } else {
      // Has write_themes but not read_themes — allow upload with manual theme ID
      needsManualThemeId = true;
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
    });
  } catch (error) {
    console.error('❌ Loader Error:', error);
    return json({ 
      success: false, 
      error: error.message,
      needsReinstall: error.message.includes('Missing required scope') || error.message.includes('403')
    }, { status: 500 });
  }
};

const SectionsPage = () => {
  const loaderData = useLoaderData();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [uploadedSection, setUploadedSection] = useState(null);

  if (!loaderData.success) {
    return (
      <Page fullWidth>
        <TitleBar title="Sections" />
        <Layout>
          <Layout.Section>
            <Banner status="critical" title="Error Loading Sections">
              <div style={{ whiteSpace: 'pre-line' }}>
                <p>{loaderData.error || 'Failed to load sections. Please try again.'}</p>
                {loaderData.needsReinstall && (
                  <div style={{ marginTop: '16px' }}>
                    <Button
                      primary
                      onClick={() => {
                        // Redirect to clear session page
                        window.location.href = '/app/clear-session';
                      }}
                    >
                      Clear Session & Re-authorize
                    </Button>
                  </div>
                )}
              </div>
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const { shopFull, themeId: loaderThemeId, accessToken, hasWriteThemes, hasReadThemes, needsManualThemeId } = loaderData;
  const [manualThemeId, setManualThemeId] = useState('');
  const themeId = loaderThemeId || (manualThemeId.trim() ? String(manualThemeId).trim() : null);

  const handleUploadSuccess = (section) => {
    setUploadedSection(section);
    setNotificationOpen(true);
  };

  return (
    <Page fullWidth>
      <TitleBar title="Premium Sections" />
      
      <Layout>
        <Layout.Section>
          <Banner
            status={hasWriteThemes ? 'success' : 'warning'}
            title={hasWriteThemes ? 'Asset API upload enabled' : 'Theme write scope missing'}
          >
            <p>
              {hasWriteThemes
                ? hasReadThemes && themeId
                  ? `Theme Asset API upload is active (theme ID: ${themeId}). You can upload sections to your live theme.`
                  : needsManualThemeId
                    ? "You have write_themes (upload) but not read_themes. Enter your live theme ID below to upload sections. Find it in Shopify Admin: Online Store → Themes → … on your theme → Edit code — the theme ID is in the URL."
                    : "Theme Asset API upload is active. Enter your theme ID below if it wasn’t detected."
                : 'To upload sections, clear session and re-authorize so the app gets write_themes.'}
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
                  helpText="From Admin: Online Store → Themes → … → Edit code. Theme ID is in the URL (e.g. .../themes/123456789012/editor)."
                  autoComplete="off"
                />
              </BlockStack>
            </div>
          )}

          {themeId && (
            <div style={{ padding: '20px 0' }}>
              <Grid>
                {sectionsData.map((section) => (
                  <Grid.Cell key={section.id} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
                    <SectionCard
                      section={section}
                      shopFull={shopFull}
                      themeId={themeId}
                      accessToken={accessToken}
                      onUploadSuccess={handleUploadSuccess}
                    />
                  </Grid.Cell>
                ))}
              </Grid>
            </div>
          )}
        </Layout.Section>
      </Layout>

      <SectionUploadNotification
        open={notificationOpen}
        onClose={() => {
          setNotificationOpen(false);
          setUploadedSection(null);
        }}
        section={uploadedSection}
        shopFull={shopFull}
        themeId={themeId}
      />
    </Page>
  );
};

export default SectionsPage;
