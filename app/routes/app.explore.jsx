import {Page, Layout} from '@shopify/polaris';
import React, {useContext} from 'react';
import {TitleBar} from "@shopify/app-bridge-react";
import Explorecard from "../components/Explorecard.jsx";
import '../assets/style/card.css';
import {ExploreContext} from '../context/Explorecontext.jsx';





// export const loader = async ({ request }) => {
//   const { session } = await authenticate.admin(request);

//     const shop = session.shop;
//   const accessToken = session.accessToken;

//   console.log("shop -vs", shop)
//     console.log("accessToken -vs", accessToken)

//   return json({ shop: session.shop });
// };







function AppWidgets() {
    const {exploreData} = useContext(ExploreContext);


    if (!exploreData) {
        return (
            <Page fullWidth>
                <TitleBar title="Explore Section" />
                <div>Loading...</div>
            </Page>
        );
    }

    return (
        <Page fullWidth>
            <TitleBar title="Explore Section" />
            <h1>Explore Section</h1>
            <Layout fullWidth>
                <section className="section">
                    <div className="container">
                        <div className="explore-card-container">
                            <div className="explore-card-wrapper">
                                <Explorecard  />
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </Page>
    );
}

export default AppWidgets;