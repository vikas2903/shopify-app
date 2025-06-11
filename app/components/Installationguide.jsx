import React from 'react';

const Installationguide = () => {
  return (
    <div style={{ padding: '10px 8px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', background:"#eee", borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1rem' , marginBottom: '20px' , lineHeight: '1.2'}}> 
        How to Install App Blocks in Your Shopify Theme
      </h2>

      <ol style={{ lineHeight: 1.6, fontSize: '12px', paddingLeft: '20px' }}>
        <li style={{ marginBottom: '20px' }}>
          <strong>Go to Your Theme Editor</strong>
          <br />
          From your Shopify admin, navigate to: <br />
          <em>Online Store → Themes → Customize</em> <br />
          This will open the Theme Editor for your currently published theme.
        </li>

        <li style={{ marginBottom: '20px' }}>
          <strong>Open the App Blocks Section</strong>
          <br />
          In the Theme Editor's left sidebar, scroll down and click on{" "}
          <em>"Add section"</em> or <em>"Add block"</em> depending on where you want to place the feature.
        </li>

        <li style={{ marginBottom: '20px' }}>
          <strong>Select the App Block You Want</strong>
          <br />
          Find and select the desired block from the list. Our blocks include:
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li>D2C – Announcement Bar</li>
            <li>D2C – Recently Viewed Products</li>
            <li>D2C – Offer Carosel</li>
       
   
          </ul>
        </li>

        <li style={{ marginBottom: '20px' }}>
          <strong>Click Save</strong>
          <br />
          After adding the block and adjusting its settings, click the{" "}
          <strong>Save</strong> button at the top-right corner of the editor.
        </li>

        <li style={{ marginBottom: '20px' }}>
          <strong>Done!</strong>
          <br />
          Your selected block is now active on your storefront 🎉
          <br />
          You can further customize its appearance and content from within the Theme Editor or App Dashboard.
        </li>
      </ol>

      <p style={{ fontSize: '14px', color: '#555' }}>
        Need help?{" "}
        <a href="mailto:support@yourappdomain.com" style={{ color: '#007ace', textDecoration: 'none' }}>
          Contact Support
        </a>
      </p>
    </div>
  );
};


export default Installationguide