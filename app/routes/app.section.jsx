import React, { useState, useEffect } from 'react';
import CardItem from '../components/cardsitems'; 
import { Page } from '@shopify/polaris';
import axios from 'axios';
import { authenticate } from '../shopify.server.js'
import {json} from '@remix-run/node'
import { useLoaderData } from "@remix-run/react";
import { TitleBar } from '@shopify/app-bridge-react';
 export const loader = async ({ request }) => {
  
     try {
         const { session } = await authenticate.admin(request);
 
         if (!session.shop) {
             throw new Error('Shop domain not found in session');
         }
 
         const shopFull = session.shop;
         const extractShopName = shopFull.split(".")[0];
         

         
         if(shopFull == 'd2c-apps.myshopify.com'){
        var accessToken = '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';
           console.log("Shop Name:", shopFull);
         }else{
          console.log("Not Test");
            accessToken = session.accessToken;
         }
        
        
      
         console.log("Access Token:", accessToken);
 
         // Fetch themes from Shopify API with updated version
         const response = await fetch(`https://${shopFull}/admin/api/2024-01/themes.json`, {
             method: "GET",
             headers: {
                 "X-Shopify-Access-Token": accessToken,
                 "Content-Type": "application/json",
             },
         });
 
         if (!response.ok) {
             console.error(`Theme API Error: ${response.status} ${response.statusText}`);
             const errorText = await response.text();
             console.error("Error details:", errorText);
             
             if (response.status === 403) {
                 throw new Error(`Access forbidden. Please ensure your app has the required scopes: read_themes, write_themes check `);
             }
             
             throw new Error(`Failed to fetch themes: ${response.status} ${response.statusText}`);
         }
 
         const data = await response.json();
        //  console.log("Themes data:", data);
 
         const mainTheme = data.themes && data.themes.find(theme => theme.role === "main");
         const themeId = mainTheme ? mainTheme.id : null;
 
         if (!themeId) {
             throw new Error("No published theme found for this shop");
         }
 
         return json({ 
             shop: shopFull, 
             themeId,
             shopFull,
             extractShopName,
             accessToken,
             success: true 
         });
 
     } catch (error) {
         console.error("Loader error:", error);
         return json({ 
             error: error.message,
             success: false 
         }, { status: 500 });
     }
 };
const Section = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { shop, themeId, extractShopName, accessToken  } = useLoaderData();
       
  useEffect(() => {

    
    const fetchData = async () => {
      try {

        const response = await axios.get('https://shopify-wishlist-app-mu3m.onrender.com/api/carditems');
        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Page fullWidth>
       <TitleBar title='Premium Sections' />
      <div
        className=""
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          justifyContent: 'center',
        }}
      >
        {/* Pass fetched data to CardItem */}
        {data && data.length > 0 ? (
          data.map((item) => (
            <CardItem accessToken={accessToken} themeid={themeId}  shop={extractShopName}  keyy={item.id} key={item.id} title={item.title} description={item.popupcontent} image={item.image} url={item.url}/>
          ))
        ) : (
          <div>No items found</div>
        )}
      </div>
    </Page>
  );
};

export default Section;
