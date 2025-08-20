// import { useEffect } from "react";
// import { useFetcher } from "@remix-run/react";
// import { json } from "@remix-run/node";
// // import Homee from "../components/Home";
// import {
//   Page,
//   // Layout,
//   // Text,
//   // Card,
//   // Button,
//   // BlockStack,
//   // Box,
//   // List,
//   // Link,
//   // InlineStack,
// } from "@shopify/polaris";
// import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
// import { authenticate } from "../shopify.server";
// import mongoose from "mongoose";
// // import Home from "../components/Home";
// import '../assets/style/styles.css'
// import "../assets/style/card.css";
// import "../assets/style/dashboard.css";
// import Dashboard from "../components/Dashboard.jsx";
// import Store from "../backend/modals/store.js"

// export const loader = async ({ request }) => {
//   await authenticate.admin(request);
//   const { session } = await authenticate.admin(request);
//   const shop = session.shop;
//   const sessionAccessToken = session.accessToken;

//       if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   }

//   const store = await Store.findOne({ shop });
//   let accessToken = store?.accessToken;


//   // First-time install race handler: try to persist from session, then retry once
//   if (!accessToken) {
//     if (sessionAccessToken) {
//       await Store.findOneAndUpdate(
//         { shop },
//         { shop, accessToken: sessionAccessToken, updatedAt: new Date() },
//         { upsert: true, new: true, setDefaultsOnInsert: true }
//       );
//       const updated = await Store.findOne({ shop });
//       accessToken = updated?.accessToken;
//     }

//     if (!accessToken) {
//       await new Promise((r) => setTimeout(r, 700));
//       const retried = await Store.findOne({ shop });
//       accessToken = retried?.accessToken;
//     }

//     if (!accessToken) {
//       throw new Error("Access token not found for shop: " + shop);
//     }
//   }


//     console.log("Shopify app loaded successfully ✅ ✅✅✅✅ shop", shop);
//     console.log("Shopify app loaded successfully ✅ ✅✅✅✅ shop", accessToken);

// //   const response = await fetch(`https://${shop}/admin/api/2024-01/themes.json`, {
// //   method: "GET",
// //   headers: {
// //     "X-Shopify-Access-Token": accessToken,
// //     "Content-Type": "application/json",
// //   },
// // });

// // if (!response.ok) {
// //   throw new Error(`Failed to fetch themes: ${response.status} ${response.statusText}`);
// // }

// // const data = await response.json();
// // const publishedTheme = data.themes.find(theme => theme.role === "main");

// // if (!publishedTheme) {
// //   throw new Error("No published theme found for shop: " + shop);
// // }

// //   console.log("Shopify app loaded successfully ✅ ✅✅✅✅ shop", publishedTheme.id);


// // return json({
// //     shop,
// //     themeId: publishedTheme.id,
// //   });

//   return json({ shop });
// };

// export const action = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);
//   const color = ["Red", "Orange", "Yellow", "Green"][
//     Math.floor(Math.random() * 4)
//   ];
//   const response = await admin.graphql(
//     `#graphql
//       mutation populateProduct($product: ProductCreateInput!) {
//         productCreate(product: $product) {
//           product {
//             id
//             title
//             handle
//             status
//             variants(first: 10) {
//               edges {
//                 node {
//                   id
//                   price
//                   barcode
//                   createdAt
//                 }
//               }
//             }
//           }
//         }
//       }`,
//     {
//       variables: {
//         product: {
//           title: `${color} Snowboard`,
//         },
//       },
//     },
//   );
//   const responseJson = await response.json();
//   const product = responseJson.data.productCreate.product;
//   const variantId = product.variants.edges[0].node.id;
//   const variantResponse = await admin.graphql(
//     `#graphql
//     mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//       productVariantsBulkUpdate(productId: $productId, variants: $variants) {
//         productVariants {
//           id
//           price
//           barcode
//           createdAt
//         }
//       }
//     }`,
//     {
//       variables: {
//         productId: product.id,
//         variants: [{ id: variantId, price: "100.00" }],
//       },
//     },
//   );
//   const variantResponseJson = await variantResponse.json();

//   return {
//     product: responseJson.data.productCreate.product,
//     variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
//   };
// };

// export default function Index() {
//   const fetcher = useFetcher();
//   const shopify = useAppBridge();
//   const isLoading =
//     ["loading", "submitting"].includes(fetcher.state) &&
//     fetcher.formMethod === "POST";
//   const productId = fetcher.data?.product?.id.replace(
//     "gid://shopify/Product/",
//     "",
//   );

//   useEffect(() => {
//     if (productId) {
//       shopify.toast.show("Product created");
//     }
//   }, [productId, shopify]);
//   const generateProduct = () => fetcher.submit({}, { method: "POST" });

//   return (
//     <Page fullWidth >
//        <TitleBar title="Dashboard" /> 

//     {/* <Home /> */}
//     < Dashboard />
//       {/* <TitleBar title="Remix app template">
//         <button variant="primary" onClick={generateProduct}>
//           Generate a product
//         </button>
//       </TitleBar>
//       <BlockStack gap="500">
//         <Layout>
//           <Layout.Section>
//             <Card>
//               <BlockStack gap="500">
//                 <BlockStack gap="200">
//                   <Text as="h2" variant="headingMd">
//                     Congrats on creating a new Shopify app 🎉
//                   </Text>
//                   <Text variant="bodyMd" as="p">
//                     This embedded app template uses{" "}
//                     <Link
//                       url="https://shopify.dev/docs/apps/tools/app-bridge"
//                       target="_blank"
//                       removeUnderline
//                     >
//                       App Bridge
//                     </Link>{" "}
//                     interface examples like an{" "}
//                     <Link url="/app/additional" removeUnderline>
//                       additional page in the app nav
//                     </Link>
//                     , as well as an{" "}
//                     <Link
//                       url="https://shopify.dev/docs/api/admin-graphql"
//                       target="_blank"
//                       removeUnderline
//                     >
//                       Admin GraphQL
//                     </Link>{" "}
//                     mutation demo, to provide a starting point for app
//                     development.
//                   </Text>
//                 </BlockStack>
//                 <BlockStack gap="200">
//                   <Text as="h3" variant="headingMd">
//                     Get started with products
//                   </Text>
//                   <Text as="p" variant="bodyMd">
//                     Generate a product with GraphQL and get the JSON output for
//                     that product. Learn more about the{" "}
//                     <Link
//                       url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
//                       target="_blank"
//                       removeUnderline
//                     >
//                       productCreate
//                     </Link>{" "}
//                     mutation in our API references.
//                   </Text>
//                 </BlockStack>
//                 <InlineStack gap="300">
//                   <Button loading={isLoading} onClick={generateProduct}>
//                     Generate a product
//                   </Button>
//                   {fetcher.data?.product && (
//                     <Button
//                       url={`shopify:admin/products/${productId}`}
//                       target="_blank"
//                       variant="plain"
//                     >
//                       View product
//                     </Button>
//                   )}
//                 </InlineStack>
//                 {fetcher.data?.product && (
//                   <>
//                     <Text as="h3" variant="headingMd">
//                       {" "}
//                       productCreate mutation
//                     </Text>
//                     <Box
//                       padding="400"
//                       background="bg-surface-active"
//                       borderWidth="025"
//                       borderRadius="200"
//                       borderColor="border"
//                       overflowX="scroll"
//                     >
//                       <pre style={{ margin: 0 }}>
//                         <code>
//                           {JSON.stringify(fetcher.data.product, null, 2)}
//                         </code>
//                       </pre>
//                     </Box>
//                     <Text as="h3" variant="headingMd">
//                       {" "}
//                       productVariantsBulkUpdate mutation
//                     </Text>
//                     <Box
//                       padding="400"
//                       background="bg-surface-active"
//                       borderWidth="025"
//                       borderRadius="200"
//                       borderColor="border"
//                       overflowX="scroll"
//                     >
//                       <pre style={{ margin: 0 }}>
//                         <code>
//                           {JSON.stringify(fetcher.data.variant, null, 2)}
//                         </code>
//                       </pre>
//                     </Box>
//                   </>
//                 )}
//               </BlockStack>
//             </Card>
//           </Layout.Section>
//           <Layout.Section variant="oneThird">
//             <BlockStack gap="500">
//               <Card>
//                 <BlockStack gap="200">
//                   <Text as="h2" variant="headingMd">
//                     App template specs
//                   </Text>
//                   <BlockStack gap="200">
//                     <InlineStack align="space-between">
//                       <Text as="span" variant="bodyMd">
//                         Framework
//                       </Text>
//                       <Link
//                         url="https://remix.run"
//                         target="_blank"
//                         removeUnderline
//                       >
//                         Remix
//                       </Link>
//                     </InlineStack>
//                     <InlineStack align="space-between">
//                       <Text as="span" variant="bodyMd">
//                         Database
//                       </Text>
//                       <Link
//                         url="https://www.prisma.io/"
//                         target="_blank"
//                         removeUnderline
//                       >
//                         Prisma
//                       </Link>
//                     </InlineStack>
//                     <InlineStack align="space-between">
//                       <Text as="span" variant="bodyMd">
//                         Interface
//                       </Text>
//                       <span>
//                         <Link
//                           url="https://polaris.shopify.com"
//                           target="_blank"
//                           removeUnderline
//                         >
//                           Polaris
//                         </Link>
//                         {", "}
//                         <Link
//                           url="https://shopify.dev/docs/apps/tools/app-bridge"
//                           target="_blank"
//                           removeUnderline
//                         >
//                           App Bridge
//                         </Link>
//                       </span>
//                     </InlineStack>
//                     <InlineStack align="space-between">
//                       <Text as="span" variant="bodyMd">
//                         API
//                       </Text>
//                       <Link
//                         url="https://shopify.dev/docs/api/admin-graphql"
//                         target="_blank"
//                         removeUnderline
//                       >
//                         GraphQL API
//                       </Link>
//                     </InlineStack>
//                   </BlockStack>
//                 </BlockStack>
//               </Card>
//               <Card>
//                 <BlockStack gap="200">
//                   <Text as="h2" variant="headingMd">
//                     Next steps
//                   </Text>
//                   <List>
//                     <List.Item>
//                       Build an{" "}
//                       <Link
//                         url="https://shopify.dev/docs/apps/getting-started/build-app-example"
//                         target="_blank"
//                         removeUnderline
//                       >
//                         {" "}
//                         example app
//                       </Link>{" "}
//                       to get started
//                     </List.Item>
//                     <List.Item>
//                       Explore Shopify’s API with{" "}
//                       <Link
//                         url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
//                         target="_blank"
//                         removeUnderline
//                       >
//                         GraphiQL
//                       </Link>
//                     </List.Item>
//                   </List>
//                 </BlockStack>
//               </Card>
//             </BlockStack>
//           </Layout.Section>
//         </Layout>
//       </BlockStack> */}
      
      
//     </Page>
//   );
// }



import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  Page,
  TitleBar,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import mongoose from "mongoose";
import "../assets/style/styles.css";
import "../assets/style/card.css";
import "../assets/style/dashboard.css";
import Dashboard from "../components/Dashboard.jsx";
import Store from "../backend/modals/store.js";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  if (!session) throw new Error("No session found");

  const shop = session.shop;
  const sessionAccessToken = session.accessToken;

  // MongoDB Connection
  if (mongoose.connection.readyState === 0) {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  let store = await Store.findOne({ shop });
  let accessToken = store?.accessToken;

  // Handle first-time installation (race condition-safe)
  if (!accessToken && sessionAccessToken) {
    store = await Store.findOneAndUpdate(
      { shop },
      {
        shop,
        accessToken: sessionAccessToken,
        updatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    accessToken = store.accessToken;
  }

  if (!accessToken) {
    throw new Error("Access token not found even after retry for shop: " + shop);
  }

  console.log("✅ App loaded for shop:", shop);
  return json({ shop });
};

export default function Index() {
  const fetcher = useFetcher();
  const appBridge = useAppBridge();

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const productId = fetcher.data?.product?.id?.replace(
    "gid://shopify/Product/",
    ""
  );

  useEffect(() => {
    if (productId && appBridge?.toast) {
      appBridge.toast.show("Product created");
    }
  }, [productId, appBridge]);

  return (
    <Page fullWidth>
      <TitleBar title="Dashboard" />
      <Dashboard />
    </Page>
  );
}
