// app/routes/Section.jsx or your route file

import React, { useState, useEffect } from 'react';
import CardItem from '../components/cardsitems';
import { Page } from '@shopify/polaris';
import axios from 'axios';
import { authenticate } from '../shopify.server.js';
import { json } from '@remix-run/node';
import { useLoaderData } from "@remix-run/react";

import { verifyShopifyHmac } from "../utils/verifyhmac.js";

// ✅ Loader with HMAC Verification
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  // ✅ Step 1: Verify HMAC
  const isValid = verifyShopifyHmac(params, process.env.SHOPIFY_API_SECRET);

  if (!isValid) {
    console.error("❌ Invalid HMAC", params);
    throw new Response("Forbidden: Invalid HMAC", { status: 403 });
  }

  // ✅ Step 2: Continue with authenticated session logic
  try {
    const { session } = await authenticate.admin(request);

    if (!session?.shop) {
      throw new Error("Shop domain not found in session");
    }

    const shopFull = session.shop;
    const accessToken = session.accessToken;

    console.log("✅ Shop Name:", shopFull);
    console.log("✅ Access Token:", accessToken);

    // ✅ Step 3: Get main theme
    const themeResponse = await fetch(`https://${shopFull}/admin/api/2024-01/themes.json`, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!themeResponse.ok) {
      const errorText = await themeResponse.text();
      console.error("Theme API Error:", themeResponse.status, themeResponse.statusText, errorText);

      if (themeResponse.status === 403) {
        throw new Error("Access forbidden. Ensure your app has scopes: read_themes, write_themes.");
      }

      throw new Error(`Failed to fetch themes: ${themeResponse.status} ${themeResponse.statusText}`);
    }

    const themeData = await themeResponse.json();
    const mainTheme = themeData.themes?.find(theme => theme.role === "main");
    const themeId = mainTheme?.id;

    if (!themeId) {
      throw new Error("No published theme found for this shop");
    }

    return json({
      shop: shopFull,
      themeId,
      accessToken,
      success: true
    });

  } catch (error) {
    console.error("Loader error:", error);
    return json({
      error: error.message,
      success: false
    }, { status: 500 });
  }
};

// ✅ Component
const Section = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { shop } = useLoaderData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://shopify-wishlist-app-mu3m.onrender.com/api/carditems');
        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Page fullWidth>
      <h1>Sections</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          justifyContent: 'center',
        }}
      >
        {data && data.length > 0 ? (
          data.map((item) => (
            <CardItem
              shop={shop}
              key={item.id}
              title={item.title}
              description={item.popupcontent}
              image={item.image}
              url={item.url}
            />
          ))
        ) : (
          <div>No items found</div>
        )}
      </div>
    </Page>
  );
};

export default Section;
