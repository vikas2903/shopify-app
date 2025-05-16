import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu, Provider as AppBridgeReactProvider } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import '../assets/style/style.css'
import { ExploreContextProvider } from '../context/Explorecontext.jsx'

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <AppBridgeReactProvider config={{ apiKey }}>
        <ExploreContextProvider>
          <NavMenu>
            <Link to="/app/explore">Explore Section</Link>
            <Link to="/app" rel="home"> Home</Link>
            <Link to="/app/analytics">Analytics</Link>
            <Link to="/app/help"> Help</Link>
            {/* <Link to="/app/additional">Additional page</Link> */}
            <Link to="/app/installation">Installation</Link>
          </NavMenu>
          <Outlet />
        </ExploreContextProvider>
      </AppBridgeReactProvider>
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