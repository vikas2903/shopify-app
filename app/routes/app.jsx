
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import '../assets/style/styles.css';
import { ExploreContextProvider } from '../context/Explorecontext.jsx';
import Store from "../backend/modals/store.js";
import mongoose from "mongoose";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  // Authenticate Shopify admin
  await authenticate.admin(request);
  const { session } = await authenticate.admin(request);

  const shop = session.shop;
  const accessToken = session.accessToken;

  console.log("🔑 Access token received for shop:", shop);

  // Connect MongoDB if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  }

  // Find or create store
  let store = await Store.findOne({ shop });

  if (store) {
    store.accessToken = accessToken;
    store.updatedAt = new Date();
    console.log("🔄 Store updated in DB");
  } else {
    store = new Store({
      shop,
      accessToken,
      updatedAt: new Date(),
    });
    console.log("🆕 Store created in DB");
  }

  await store.save();
  console.log("✅ Access token saved to MongoDB for:", shop);

  // Return data for AppProvider
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ExploreContextProvider>
        <NavMenu>
          <Link to="/app" rel="home">Dashboard</Link>
          <Link to="/app/explore">Blocks</Link>
          <Link to="/app/sectionsblock">Sections</Link>
          <Link to="/app/help">Support</Link>
          <Link to="/app/debug-scopes">Debug Scopes</Link> 
        </NavMenu>
        <Outlet />
      </ExploreContextProvider>
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
