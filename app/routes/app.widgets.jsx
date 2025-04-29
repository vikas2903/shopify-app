
import {Page,Layout,Grid,Card,Text, Bleed } from '@shopify/polaris';
import React from 'react';
import { TitleBar } from "@shopify/app-bridge-react";
import GridItem from '../components/Griditem';
import  Popup  from '../components/Popup.jsx';

function appwidgets() {
  return (
    <>
    <Page fullWidth>
      <TitleBar title="Explore Section" />
      <Layout fullWidth>
        <div className="grid-wrapper">
          <GridItem  img="https://d1xgiem9kow01r.cloudfront.net/xagtjorkzwew06igloi46uox9p5n" title="Offers Content" />
          <GridItem img="https://d1xgiem9kow01r.cloudfront.net/6rg79d5ewtpp9xc4503qlqn0bv9h" title="Offer Carosel" />  
          <GridItem img="https://d1xgiem9kow01r.cloudfront.net/pnw2qfjpwmj8582n1cgz1tvhbxqc" title="Whatsapp Button" />
          <GridItem img="https://d1xgiem9kow01r.cloudfront.net/low61hnll2f0h5dc2pf0845l4847"title="Product Page Usp"  />  

          <GridItem  img="https://d1xgiem9kow01r.cloudfront.net/k956xdpoee0t88h8eem6d3yz16lc" title="Offers Content" />
          <GridItem img="https://d1xgiem9kow01r.cloudfront.net/36x0oynb2971o9veijuj0f0xnnqh" title="Offer Carosel" />  
          <GridItem img="https://d1xgiem9kow01r.cloudfront.net/8feswpcajbksam9z7fxy864chvyl" title="Whatsapp Button" />
          <GridItem img="https://d1xgiem9kow01r.cloudfront.net/a4hgh2h4rnvye495y6lnj33t8z89"title="Product Page Usp"  />  

          <GridItem  img="https://d1xgiem9kow01r.cloudfront.net/xagtjorkzwew06igloi46uox9p5n" title="Offers Content" />
          <GridItem img="https://d1xgiem9kow01r.cloudfront.net/6rg79d5ewtpp9xc4503qlqn0bv9h" title="Offer Carosel" />  
          <GridItem img="https://d1xgiem9kow01r.cloudfront.net/pnw2qfjpwmj8582n1cgz1tvhbxqc" title="Whatsapp Button" />
          <GridItem img="https://d1xgiem9kow01r.cloudfront.net/low61hnll2f0h5dc2pf0845l4847"title="Product Page Usp"  />  
        </div>

        <Popup />
      </Layout>
    </Page>
    </>
    
  )
}

export default appwidgets