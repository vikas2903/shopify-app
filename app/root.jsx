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
import {Root} from './zoha.jsx'
 



export default function App() {
 useEffect(() => {
    // Inject Zoho SalesIQ Script
    const script1 = document.createElement("script");
    script1.innerHTML = `
      window.$zoho = window.$zoho || {};
      $zoho.salesiq = $zoho.salesiq || {
        ready: function () {
          console.log("Zoho SalesIQ Ready");
        }
      };
    `;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://salesiq.zohopublic.in/widget?wc=siq2084c27fe220c816892dec0d99a9092a03d9399a0a187b9968460a97f4233ff0";
    script2.defer = true;
    document.body.appendChild(script2);
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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

      </head>
      <body>

        <div className="dashboard">
         
          <Sidebar />
          <div className="main-contentt">
          
                  {/* <Header /> */}
                  <Outlet />
  
            <ScrollRestoration />
            <Scripts />
          </div>
    
        </div>

        
<Root />
    
      </body>
    </html>
  );
}
