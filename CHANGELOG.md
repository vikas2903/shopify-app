# @shopify/shopify-app-template-remix

## 2025.03.18
-[#998](https://github.com/Shopify/shopify-app-template-remix/pull/998) Update to Vite 6

## 2025.03.01
- [#982](https://github.com/Shopify/shopify-app-template-remix/pull/982) Add Shopify Dev Assistant extension to the VSCode extension recommendations

## 2025.01.31
- [#952](https://github.com/Shopify/shopify-app-template-remix/pull/952) Update to Shopify App API v2025-01

## 2025.01.23

- [#923](https://github.com/Shopify/shopify-app-template-remix/pull/923) Update `@shopify/shopify-app-session-storage-prisma` to v6.0.0

## 2025.01.8

- [#923](https://github.com/Shopify/shopify-app-template-remix/pull/923) Enable GraphQL autocomplete for Javascript

## 2024.12.19

- [#904](https://github.com/Shopify/shopify-app-template-remix/pull/904) bump `@shopify/app-bridge-react` to latest
-
## 2024.12.18

- [875](https://github.com/Shopify/shopify-app-template-remix/pull/875) Add Scopes Update Webhook
## 2024.12.05

- [#910](https://github.com/Shopify/shopify-app-template-remix/pull/910) Install `openssl` in Docker image to fix Prisma (see [#25817](https://github.com/prisma/prisma/issues/25817#issuecomment-2538544254))
- [#907](https://github.com/Shopify/shopify-app-template-remix/pull/907) Move `@remix-run/fs-routes` to `dependencies` to fix Docker image build
- [#899](https://github.com/Shopify/shopify-app-template-remix/pull/899) Disable v3_singleFetch flag
- [#898](https://github.com/Shopify/shopify-app-template-remix/pull/898) Enable the `removeRest` future flag so new apps aren't tempted to use the REST Admin API.

## 2024.12.04

- [#891](https://github.com/Shopify/shopify-app-template-remix/pull/891) Enable remix future flags.
-

## 2024.11.26
- [888](https://github.com/Shopify/shopify-app-template-remix/pull/888) Update restResources version to 2024-10

## 2024.11.06

- [881](https://github.com/Shopify/shopify-app-template-remix/pull/881) Update to the productCreate mutation to use the new ProductCreateInput type

## 2024.10.29

- [876](https://github.com/Shopify/shopify-app-template-remix/pull/876) Update shopify-app-remix to v3.4.0 and shopify-app-session-storage-prisma to v5.1.5

## 2024.10.02

- [863](https://github.com/Shopify/shopify-app-template-remix/pull/863) Update to Shopify App API v2024-10 and shopify-app-remix v3.3.2

## 2024.09.18

- [850](https://github.com/Shopify/shopify-app-template-remix/pull/850) Removed "~" import alias

## 2024.09.17

- [842](https://github.com/Shopify/shopify-app-template-remix/pull/842) Move webhook processing to individual routes

## 2024.08.19

Replaced deprecated `productVariantUpdate` with `productVariantsBulkUpdate`

## v2024.08.06

Allow `SHOP_REDACT` webhook to process without admin context

## v2024.07.16

Started tracking changes and releases using calver


  <script>
  document.addEventListener("DOMContentLoaded", async () => {
    const wishlistContainer = document.getElementById("wishlist-products");


    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = "<p>No products in your wishlist.</p>";
  
    }

    wishlistContainer.innerHTML = "";

    for (let productId of wishlist) {
      try {
        const response = await fetch(`/products/${productId}.js`);
        if (!response.ok) throw new Error("Product not found");
        const product = await response.json();

        const productHtml = `
          <div class="wishlist-product" style="margin-bottom: 20px;">
            <h3>${product.title}</h3>
            <img src="${product.images[0]}" width="150" alt="${product.title}" />
            <p>Price: ₹${(product.price / 100).toFixed(2)}</p>
            <a href="${product.url}" target="_blank">View Product</a>
          </div>
        `;

        wishlistContainer.insertAdjacentHTML("beforeend", productHtml);
      } catch (error) {
        console.error(`Failed to fetch product with ID ${productId}:`, error.message);
      }
    }
  });

  
//       async function getProductDetails(productId) {
//     try {
//         const res = await fetch(`/products/${productId}.js`);
        
//         // Check if the response is ok (status in the range 200-299)
//         if (!res.ok) {
//             throw new Error(`Error fetching product: ${res.status} ${res.statusText}`);
//         }
//         const product = await res.json();
//         console.log(product); // Log the product details
//         return product; // Return the product details for further use
//     } catch (error) {
//         console.error('Failed to fetch product details:', error);
//     }
// }
// // Example usage
// const productId = 7960040374306; // Replace with your actual product ID
// getProductDetails(productId);

</script>