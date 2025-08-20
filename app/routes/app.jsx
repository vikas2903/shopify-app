// import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
// import { boundary } from "@shopify/shopify-app-remix/server";
// import { AppProvider } from "@shopify/shopify-app-remix/react";
// import { NavMenu } from "@shopify/app-bridge-react";
// import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
// import { authenticate } from "../shopify.server";
// import '../assets/style/styles.css'
// import {ExploreContextProvider} from '../context/Explorecontext.jsx'


// export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

// export const loader = async ({ request }) => {

//   await authenticate.admin(request);
  

//   return { apiKey: process.env.SHOPIFY_API_KEY || "" };
// };

// export default function App() {
//   const { apiKey } = useLoaderData();

//   return (
//     <AppProvider isEmbeddedApp apiKey={apiKey}>
//       <ExploreContextProvider>
//         <NavMenu>
//           <Link to="/app/explore">Blocks</Link>
//           <Link to="/app" rel="home"> Dashboard</Link>
//           <Link to="/app/help"> Support</Link> 
//           <Link to="/app/installation">Wishlist</Link>
//           {/* <Link to="/app/pricing">Pricing</Link> */}
    
//         </NavMenu>
//         <Outlet />
//       </ExploreContextProvider>
//     </AppProvider>
//   );
// }

// // Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
// export function ErrorBoundary() {
//   return boundary.error(useRouteError());
// }

// export const headers = (headersArgs) => {
//   return boundary.headers(headersArgs);
// };


// require('dotenv').config();
// const { ApolloServer, gql } = require('apollo-server');
// const axios = require('axios');

// // GraphQL Schema
// const typeDefs = gql`
//   type DiscountCode {
//     id: ID
//     title: String
//     startsAt: String
//     endsAt: String
//     usageLimit: Int
//   }

//   type Query {
//     discountCodes: [DiscountCode]
//   }
// `;

// // GraphQL Resolvers
// const resolvers = {
//   Query: {
//     discountCodes: async () => {
//       try {
//         const response = await axios.post(
//           `${process.env.SHOPIFY_STORE}/admin/api/2024-01/graphql.json`,
//           {
//             query: `
//               {
//                 discountCodes(first: 10) {
//                   edges {
//                     node {
//                       id
//                       title
//                       startsAt
//                       endsAt
//                       usageLimit
//                     }
//                   }
//                 }
//               }
//             `,
//           },
//           {
//             headers: {
//               'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         return response.data.data.discountCodes.edges.map((edge) => edge.node);
//       } catch (error) {
//         console.error('Error fetching discount codes:', error.message);
//         return [];
//       }
//     },
//   },
// };

// // Start Server
// const server = new ApolloServer({ typeDefs, resolvers });
// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });



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
  const { session } = await authenticate.admin(request);

  const shop = session.shop;
  const accessToken = session.accessToken;

  console.log("🔑 Access token received for shop:", shop);

  // Try to persist the token, but don't block initial load if DB is slow/unavailable
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB connected");
    }

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
  } catch (dbError) {
    console.warn("⚠️ Skipping DB save on initial load:", dbError?.message || dbError);
  }

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
          <Link to="/app/sections">Sections</Link>
          <Link to="/app/support">Support</Link>
          {/* <Link to="/app/debug">Debug</Link> */}
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
