export const loader = () => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Privacy Policy</title>
    </head>
    <body style="font-family: sans-serif; max-width: 1200px; margin: auto; padding: 2rem;">
      <h1>Privacy Policy</h1> 

      <h2>1. Overview</h2>
      <p>At LayerUp, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information when you use our Shopify app.</p>

      <h2>2. Data We Access</h2>
      <p>To deliver the features of our app, we request read and write access to your Shopify theme. This allows us to enable and manage app blocks such as announcement bars, offer sliders, product USPs, and other elements that improve your store’s performance and user experience.</p>
      <p>We do not collect or store any personal customer data, order information, or payment details from your store.</p>

      <h2>3. Data Storage & Protection</h2>
      <p>Our primary goal in collecting this limited access is to provide you with a secure, smooth, and efficient experience while customizing your Shopify store using LayerUp.</p>

    
      <h2>4. Data Sharing</h2>
      <p>We do not share, sell, or transmit any store data. Since we don’t store sensitive data, there is nothing to share.</p>

      <h2>5. Uninstall & Deletion</h2>
      <p>Uninstalling the app ends all interaction with your store. As no store data is stored on our end, no further deletion action is needed.</p>

        <h2>6. Free to Use</h2>
      <p>LayerUp is currently 100% free for all users. You can enjoy all features without any subscription or hidden charges.</p>

      <h2>7. Contact</h2>
      <p>Questions? Email us at <a href="mailto:support@digisidekick.com">support@digisidekick.com</a></p>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
};
