
// import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";


// export const loader = async ({ request }) => {
//   const { billing, session } = await authenticate.admin(request);
//   let { shop } = session;
//   let myShop = shop.replace(".myshopify.com", "");
// console.log(myShop);
//   await billing.require({
//     plans: [MONTHLY_PLAN],
//     onFailure: async () => billing.request({
//       plan: MONTHLY_PLAN,
//       isTest: true,
//       returnUrl: `https://admin.shopify.com/store/${myShop}/apps/ds-app-6/app/pricing`,
//     }),
//   });
//   // App logic

//   return null;
// };
