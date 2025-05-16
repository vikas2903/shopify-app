import {Page, Layout} from '@shopify/polaris';
import React from 'react';
import {TitleBar} from "@shopify/app-bridge-react";
import {useContext} from 'react';
import Explorecard from "../components/Explorecard.jsx";
import '../assets/style/card.css';
import {ExploreContext} from '../context/Explorecontext.jsx';

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
            <Layout fullWidth>
                <section className="section">
                    <div className="container">
                        <div className="explore-card-container">
                            <div className="explore-card-wrapper">
                                <Explorecard />
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </Page>
    );
}

export default AppWidgets;