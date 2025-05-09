
console.log("Wishlist App [0]");

document.addEventListener('DOMContentLoaded', function () {



    let wishlist_icon = '<svg class="wishlist-svg" xmlns="http://www.w3.org/2000/svg" width="30px" id="Semi-Solid__x2F__x2F__Black" viewBox="0 0 788.994 643.434"><path d="m729.401 55.76c-33.742-33.741-77.523-53.486-123.281-55.596-41.868-1.93-85.6 13.265-126.447 43.947-28.446 21.367-53.387 46.693-72.128 73.244-3.019 4.283-7.756 6.75-12.997 6.767-5.277 0-9.993-2.42-13.039-6.683l-.062-.087c-18.74-26.548-43.681-51.874-72.126-73.24-40.849-30.684-84.578-45.879-126.448-43.948-45.757 2.11-89.54 21.855-123.281 55.596-32.958 32.959-53.616 76.22-58.167 121.813-16.408 164.374 112.03 295.902 222.665 377.296 25.782 18.968 53.158 36.42 81.323 51.849 23.965 13.388 43.662 23.142 63.865 31.628 8.042 3.378 16.516 5.088 25.202 5.088.307 0 .615-.002.923-.006 8.386-.117 16.593-1.838 24.393-5.116 20.178-8.479 39.85-18.223 63.74-31.57 28.209-15.453 55.585-32.906 81.367-51.873 110.635-81.393 239.073-212.921 222.665-377.296-4.551-45.593-25.208-88.854-58.167-121.813zm-409.435 491.705c-1.091 1.991-3.146 3.119-5.268 3.119-.975 0-1.962-.238-2.877-.739-21.186-11.606-41.747-24.713-61.11-38.959-44.899-33.031-81.57-67.987-108.995-103.896-2.011-2.634-1.507-6.399 1.127-8.41 2.632-2.011 6.398-1.507 8.41 1.126 26.733 35.003 62.588 69.157 106.569 101.514 18.936 13.931 39.044 26.75 59.765 38.101 2.905 1.592 3.97 5.238 2.379 8.144z"/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>';

    document.querySelectorAll('.wishlist-engine').forEach(button => {
        button.innerHTML = wishlist_icon;
        button.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 99;
         `;


        function addToWishlist(productId) {
            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            if (!wishlist.includes(productId)) {
                wishlist.push(productId);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
            }
        }


        button.addEventListener('click', function () {

            let product_id = button.getAttribute('data-product_id');
            let variant_id = button.getAttribute('data-variant_id');
            let product_handle = button.getAttribute('data-product-handle');


            console.log(`Product id:${product_id} and Variant id: ${product_id}`);
            addToWishlist(product_handle);
            console.log("Product Added to Wishlist", product_id)


            let wishlist_api_url = 'http://localhost:3001/api/wishlist';

            fetch(wishlist_api_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backendData),
            }).then((response) => {
                return response.json();
            }).then((data) => {
                alert("Added to Wishlist")
                console.log("Server Response", data)
            }).catch((error) => {
                console.log("Error Sending data to backend", error);
            })
        });

    })
})

console.log("Wishlist App [1]");

document.addEventListener("DOMContentLoaded", async () => {

    const wishlistContainer = document.getElementById("wishlist-products");
    wishlistContainer.innerHTML = "Product Loading...";

    const wishlistHandle = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlistHandle.length === 0) {
        wishlistContainer.innerHTML = "<p>No products in your wishlist.</p>";

    }

    for (let handle of wishlistHandle) {
        try {
            const response = await fetch(`/products/${handle}.js`);
            if (!response.ok) throw new Error("Product Not Found");

            const product = await response.json(); 
console.log(product)
            const productHtml = `
          <div class="Item">
            <a href="${product.url}" class="Item__link">
              <div class="ImageContainer">
                <img src="${product.featured_image}" alt="${product.title}" class="Image">
              </div>
              <div class="Item__title">${product.title}</div>
              <div class="Item__price">₹${(product.price / 100).toFixed(2)}</div>
            </a>
          </div>
        `;

            wishlistContainer.innerHTML += productHtml;

        } catch (error) {
            console.error(`Failed to load product: ${handle}`, error);
        }
    }
});

console.log("Wishlist App [2]");


