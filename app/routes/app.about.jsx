import { Page, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import React from "react";

function order() {
  return (
    <>
      <Page fullWidth>
        <TitleBar title="Orders" />
 
        <Layout fullWidth >
          <section className="section">
            <div className="container">
              <p>
                
                Ds-App is a powerful Shopify app designed to help merchants
                enhance their storefront using customizable UI extensions.
              </p>
              <p>
                
                With a wide range of pre-built blocks, users can easily drag,
                drop, and configure components without writing any code.
              </p>
              <p>
                From announcement bars to product highlights, every section is
                flexible and responsive.
              </p>
              <p>
              
                Customize text, colors, images, and layout directly from the
                Shopify editor.
              </p>
              <p>
            
                No developer? No problem — Ds-App is built for ease of use.
              </p>
              <p>
            
                Perfect for boosting engagement, conversions, and store
                appearance.
              </p>
              <p>
              
                Create a stunning storefront that reflects your brand — fast and
                effortlessly.
              </p>
            </div>
          </section>
        </Layout>
      </Page>
    </>
  );
}

export default order;
