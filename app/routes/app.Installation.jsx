import React from "react";
import { Page, Grid, Card, Text, Tag, List, BlockStack, Bleed } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

const Installation = () => {
  const wishlist_snippet = `<div class="wishlist-engine" data-product_id="{{  product.id }}" data-variant_id="{{ product.selected_or_first_available_variant.id }}" data-full_button="false" data-css="true"></div>`;
  return (
    <>
      <Page>
        <TitleBar title="Installation Guide" />

        <Grid col>
          <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Card>
            
              <Tag>Wishlist Installion Guide</Tag>
              <Tag>Paste this code to display Wishlist Button Collection Page</Tag>
           

          <Bleed  marginInline="400">
              <Text sectioned>
             
              
                  <List type="number">
                    <List.Item variant="headingMd" as="p">  Open <b>card-product.liquid</b> file or <b>product-card-grid.liquid</b> file or <b>product-card-list.liquid</b> file or <b>product-card.liquid</b> file or <b>product-grid-item.liquid</b> file.</List.Item>
                    <List.Item variant="headingMd" as="p">Please add following code to desired position</List.Item>
                    <List.Item variant="headingMd" as="p">Show only heart icon on collection page.</List.Item>

                  </List>
                



              </Text> 
              </Bleed>
              <Text title="Wishlist Snipper" sectioned>



                <div class="wishlist-code"> 
                  <div class="copy" variant="headingMd" as="p">{`${wishlist_snippet}`}</div>
                </div>
              </Text>

   
            </Card>
          </Grid.Cell>
        </Grid>
      </Page>
    </>
  );
};

export default Installation;
