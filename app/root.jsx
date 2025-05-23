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
