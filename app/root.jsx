import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import Sidebar from "./components/Sidebar";
// import Header from "./components/Header";
import Analytics from "./routes/app.analytics";
import Root from "./zoha.jsx";
import { useEffect } from "react";
import "./assets/style/styles.css";

export default function App() {

  useEffect(() => {
    // Zoho config script
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      window.$zoho = window.$zoho || {};
      $zoho.salesiq = $zoho.salesiq || {
        ready: function () {
          console.log("Zoho SalesIQ loaded");
        }
      };
    `;
    document.body.appendChild(configScript);

    // Zoho widget loader script
    const zohoScript = document.createElement("script");
    zohoScript.src = "https://salesiq.zohopublic.in/widget?wc=siq1b81f21d9c29bf6604592eb7dbc4b3b9569d0f1d8957d977477a7e6f458cb73c";
    zohoScript.defer = true;
    document.body.appendChild(zohoScript);

    return () => {
      
      document.body.removeChild(configScript);
      document.body.removeChild(zohoScript);
    };
  }, []);
  return (
    <html HL="VIKAS">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        
        <Meta />
        <Links />
        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body>
        <div className="dashboard">
          {/* <Sidebar /> */}
          <div className="main-contentt">
            {/* <Header /> */}
            <Outlet />
            <ScrollRestoration />
            <Scripts />
          </div>
        </div>
      </body>
    </html>
  );
}
