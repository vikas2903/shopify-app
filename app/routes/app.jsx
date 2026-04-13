
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import '../assets/style/styles.css';
import { ExploreContextProvider } from '../context/Explorecontext.jsx';

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  // Authenticate Shopify admin
  await authenticate.admin(request);

  // Return data for AppProvider
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ExploreContextProvider>
        <NavMenu>
          <Link to="/app" rel="home">Home</Link>
          <Link to="/app/guide">How To Use</Link>
          <Link to="/app/contact">Support</Link>
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
