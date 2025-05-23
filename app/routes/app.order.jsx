import { Page, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import React from "react";

function order() {
  return (
    <>
      <Page fullWidth>
        <TitleBar title="Orders" />
        <Layout fullWidth>
          <section className="section">
            <div className="container">
              orders
            </div>
          </section>
        </Layout>
      </Page>
    </>
  );
}

export default order;
