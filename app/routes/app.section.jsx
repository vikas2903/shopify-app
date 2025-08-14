// app/routes/section.jsx
import React, { useState, useEffect } from 'react';
import CardItem from '../components/cardsitems';
import { Page } from '@shopify/polaris';
import axios from 'axios';
import { authenticate } from '../shopify.server.js';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { TitleBar } from '@shopify/app-bridge-react';

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const shopFull = session.shop;
    const extractShopName = shopFull.split('.')[0];

    let accessToken = session.accessToken;

    if (shopFull === 'd2c-apps.myshopify.com') {
      accessToken = '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'; // ✅ Dev token
    }

    // Fetch theme list
    const response = await fetch(`https://${shopFull}/admin/api/2024-01/themes.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Theme API error:', errorText);
      throw new Error(`Failed to fetch themes: ${response.statusText}`);
    }

    const data = await response.json();
    const mainTheme = data.themes.find(theme => theme.role === 'main');
    const themeId = mainTheme?.id;

    if (!themeId) {
      throw new Error('⚠️ No published theme found');
    }

    return json({
      shop: extractShopName,
      shopFull,
      themeId,
      accessToken,
      extractShopName,
      success: true,
    });

  } catch (error) {
    console.error('Loader Error:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

const Section = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { shopFull, themeId, extractShopName, accessToken } = useLoaderData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://shopify-wishlist-app-mu3m.onrender.com/api/carditems');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading card items: {error}</div>;

  return (
    <Page fullWidth>
      <TitleBar title="Premium Sections" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          padding: '20px',
        }}
      >
        {data.length > 0 ? (
          data.map((item) => (
            <CardItem
              key={item.id}
              keyy={item.id}
              title={item.title}
              description={item.popupcontent}
              image={item.image}
              url={item.url}
              shop={extractShopName}
              shopFull={shopFull}
              themeid={themeId}
              accessToken={accessToken}
            />
          ))
        ) : (
          <div>No items found.</div>
        )}
      </div>
    </Page>
  );
};

export default Section;
