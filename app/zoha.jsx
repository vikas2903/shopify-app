import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";

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
    zohoScript.src = "https://salesiq.zohopublic.in/widget?wc=siq2084c27fe220c816892dec0d99a9092a03d9399a0a187b9968460a97f4233ff0";
    zohoScript.defer = true;
    document.body.appendChild(zohoScript);

    return () => {
      // Cleanup if needed
      document.body.removeChild(configScript);
      document.body.removeChild(zohoScript);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="dashboard">
          <Sidebar />
          <div className="main-contentt">
            <Outlet />
            <ScrollRestoration />
            <Scripts />
          </div>
        </div>
      </body>
    </html>
  );
}
