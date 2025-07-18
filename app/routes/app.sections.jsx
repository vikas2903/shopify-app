import React from 'react';
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server.js";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  if (!session.shop) {
    throw new Error('Shop domain not found in session');
  }

  const shopFull = session.shop; // e.g., "d2c-apps.myshopify.com"
  const shopShort = shopFull.split(".")[0]; // e.g., "d2c-apps"
  const accessToken = session.accessToken;

  console.log("shopFull", shopFull);
  console.log("accessToken", accessToken);

  // Fetch themes from Shopify
  const response = await fetch(`https://${shopFull}/admin/api/2023-07/themes.json`, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch themes: ${response.statusText}`);
  }

  const data = await response.json();
  const mainTheme = data.themes.find(theme => theme.role === "main");
  const themeId = mainTheme ? mainTheme.id : null;

  return json({ shop: shopShort, themeId });
};

function Sections() {
  const { shop, themeId } = useLoaderData();

  console.log("Short shop name:", shop);
  console.log("Theme ID:", themeId);

  return (
    <>
      <div>🙂 Sections</div>
      <p>Shop Name (Short): {shop}</p>
      <p>Theme ID: {themeId ? themeId : 'No main theme found'}</p>
    </>
  );
}

export default Sections;
