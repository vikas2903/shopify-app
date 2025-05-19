import React from "react";
import wishlist_image from '../assets/images/body-wishlist.png';
import wishlist_image1 from '../assets/images/wishlist image.png'

const Installation = () => {
  
  return (
    <>
        <div className="install-inner">
            <div className="install-wrapper">
                <div className="install-item">
                    <div className="install-header"><h2>⭐ Manual Installation Guide – Wishlist App</h2></div>
                    <div className="install-body">
                        <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, fontSize: '14px' }}>
                            
                            <p>To enable the Wishlist feature on your Shopify storefront, follow the steps below carefully.</p>

                            <h3>🔧 Step 1: Add Store & Customer Credentials</h3>
                            <p>
                                <strong>File:</strong> <code>theme.liquid</code><br />
                                <strong>Location:</strong> Paste just before the closing <code>&lt;/body&gt;</code> tag.
                            </p>

                            <pre style={{ background: '#f4f4f4', padding: '10px', borderLeft: '4px solid #0a6' }}>
                                {`<div id="ds-wishlist-store-credentials"
     class="hidden"
     shop-name="{{ shop.name }}"
     shop-domain="{{ shop.domain }}"
     customer-id="{{ customer.id }}"
     customer-email="{{ customer.email }}"
     customer-name="{{ customer.name }}">
</div>`}
                            </pre>
                          <div className="install-image">
                              <img src={wishlist_image} alt=""/>
                          </div>

                            <p>This block identifies the customer and shop to the wishlist engine.</p>

                            <h3>🧩 Step 2: Add Wishlist Button to Product Grid</h3>
                            <p><strong>File(s):</strong> One of the following files, depending on your theme:</p>
                            <ul>
                                <li><code>card-product.liquid</code></li>
                                <li><code>product-card-grid.liquid</code></li>
                                <li><code>product-card-list.liquid</code></li>
                                <li><code>product-card.liquid</code></li>
                                <li><code>product-grid-item.liquid</code></li>
                            </ul>

                            <p><strong>Location:</strong> Inside the product grid item loop — place it where you want the wishlist button to appear.</p>

                            <pre style={{ background: '#f4f4f4', padding: '10px', borderLeft: '4px solid #0a6' }}>
                                {`<div class="wishlist-engine"
     data-product-handle="{{ product.handle }}"
     data-product_id="{{ product.id }}"
     data-variant_id="{{ product.selected_or_first_available_variant.id }}"
     data-full_button="false"
     data-css="true">
</div>`}
                            </pre>

                              <div className="install-image">
                              <img src={wishlist_image1} alt=""/>
                          </div>

                            <h3>✅ Final Step</h3>
                            <ol>
                                <li>Save the changes to your theme files.</li>
                                <li>Go to a collection or product page in your store.</li>
                                <li>You should now see the Wishlist icon or button near each product.</li>
                            </ol>

                            <p>If you need assistance, feel free to reach out to our support team. <a href="mailto:support@digisidekick.com">support@digisidekick.com</a></p>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </>
  );
};

export default Installation;
