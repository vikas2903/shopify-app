import React, { useState } from 'react';
import { Page, Layout, Grid, Banner, Button } from '@shopify/polaris';
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
    const currentScopes = session.scope || '';

    console.log('🔍 Sections Page Debug:');
    console.log('Shop Name:', shopFull);
    console.log('Access Token:', accessToken ? 'Present' : 'Missing');
    console.log('Current Scopes:', currentScopes);

    if (!shopFull) {
      throw new Error('Shop domain not found in session');
    }

    if (!accessToken) {
      throw new Error('Access token not found in session');
    }

    // Check if we have theme scopes
    if (!currentScopes.includes('read_themes')) {
      const errorMessage = `Missing required scope 'read_themes'. 
      
Your app needs theme permissions to upload sections. 

Current scopes: ${currentScopes || 'None'}

To fix this:
1. Deploy your app: shopify app deploy
2. Uninstall and reinstall the app from your Shopify admin
3. This will grant the new scopes: read_themes, write_themes, read_products`;
      
      throw new Error(errorMessage);
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Theme API error:', errorText);
      
      if (response.status === 403) {
        throw new Error(`Access forbidden (403). Your app needs theme permissions. 
        
Current scopes: ${currentScopes || 'None'}

Please uninstall and reinstall the app to grant the required scopes: read_themes, write_themes`);
      } else if (response.status === 401) {
        throw new Error(`Authentication failed (401). Please reinstall the app to refresh permissions.`);
      }
      
      throw new Error(`Failed to fetch themes: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Themes fetched successfully');
    
    if (!data.themes || !Array.isArray(data.themes)) {
      throw new Error('Invalid response format - no themes array found');
    }

    const mainTheme = data.themes.find(theme => theme.role === 'main');
    const themeId = mainTheme?.id;

    if (!themeId) {
      throw new Error('⚠️ No published theme found. Please ensure your store has a published theme.');
    }

    return json({
      shop: shopShort,
      shopFull,
      themeId,
      accessToken,
      success: true,
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
                        // Redirect to reinstall
                        window.location.href = '/auth';
                      }}
                    >
                      Re-authorize App
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

  const { shopFull, themeId, accessToken } = loaderData;

  const handleUploadSuccess = (section) => {
    setUploadedSection(section);
    setNotificationOpen(true);
  };

  return (
    <Page fullWidth>
      <TitleBar title="Premium Sections" />
      
      <Layout>
        <Layout.Section>
          {themeId && (
            <Banner status="info" title="Theme Connected">
              <p>Connected to theme ID: {themeId}</p>
            </Banner>
          )}

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
