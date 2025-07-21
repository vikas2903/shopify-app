import React, { useState } from 'react';
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { authenticate } from "../shopify.server.js";
import { Page, Grid, MediaCard, Banner, Toast, Tabs } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import fetch from "node-fetch";
import sectionontent from '../data/sectionsmapContent.js'
import ThemeManager from '../components/ThemeManager.jsx';

// Loader function to fetch theme and shop information
export const loader = async ({ request }) => {
    try {
        const { session } = await authenticate.admin(request);

        if (!session.shop) {
            throw new Error('Shop domain not found in session');
        }

        const shopFull = session.shop;
        const shopShort = shopFull.split(".")[0];
        const accessToken = session.accessToken;

        console.log("Shop Name:", shopFull);
        console.log("Access Token:", accessToken);

        // Fetch themes from Shopify API with updated version
        const response = await fetch(`https://${shopFull}/admin/api/2023-10/themes.json`, {
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
                throw new Error(`Access forbidden. Please ensure your app has the required scopes: read_themes, write_themes`);
            }
            
            throw new Error(`Failed to fetch themes: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Themes data:", data);

        const mainTheme = data.themes && data.themes.find(theme => theme.role === "main");
        const themeId = mainTheme ? mainTheme.id : null;

        if (!themeId) {
            throw new Error("No published theme found for this shop");
        }

        return json({ 
            shop: shopShort, 
            themeId,
            shopFull,
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

// Action function to handle theme operations
export const action = async ({ request }) => {
    try {
        const { session } = await authenticate.admin(request);
        const formData = await request.formData();
        const action = formData.get('action');
        const sectionId = formData.get('sectionId');
        const themeId = formData.get('themeId');

        const shopFull = session.shop;
        const accessToken = session.accessToken;

        console.log(`Action: ${action}, Section: ${sectionId}, Theme: ${themeId}`);

        switch (action) {
            case 'add_section':
                // Here you would add the section to the theme
                // This is a placeholder - implement based on your needs
                return json({ 
                    success: true, 
                    message: `Section ${sectionId} added successfully` 
                });

            case 'get_theme_assets':
                // Fetch theme assets
                const assetsResponse = await fetch(
                    `https://${shopFull}/admin/api/2023-10/themes/${themeId}/assets.json`,
                    {
                        method: "GET",
                        headers: {
                            "X-Shopify-Access-Token": accessToken,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!assetsResponse.ok) {
                    throw new Error(`Failed to fetch theme assets: ${assetsResponse.statusText}`);
                }

                const assetsData = await assetsResponse.json();
                return json({ 
                    success: true, 
                    assets: assetsData.assets 
                });

            default:
                return json({ 
                    success: false, 
                    message: "Invalid action" 
                }, { status: 400 });
        }

    } catch (error) {
        console.error("Action error:", error);
        return json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
};

const sections = [
    {
        "title": "Announcement Bar",
        "src": "https://plus.unsplash.com/premium_photo-1683133927528-8075b14131a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dWl8ZW58MHx8MHx8fDA%3D",
        "description": "Add a customizable announcement bar to your store header.",
        "sectionid": "announcement-bar"
    },
    {
        "title": "Offer Carousel",
        "src": "https://images.unsplash.com/photo-1720962158813-29b66b8e23e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVpfGVufDB8fDB8fHww",
        "description": "Display promotional offers in an attractive carousel format.",
        "sectionid": "offer-carousel",
    },
    {
        "title": "Recently Viewed Products",
        "src": "https://plus.unsplash.com/premium_photo-1661326248013-3107a4b2bd91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dWl8ZW58MHx8MHx8fDA%3D",
        "description": "Show customers products they've recently viewed.",
        "sectionid": "recently-viewed"
    },
    {
        "title": "Wishlist Widget",
        "src": "https://plus.unsplash.com/premium_photo-1722155330821-2557249cdb52?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHVpfGVufDB8fDB8fHww",
        "description": "Allow customers to save products to their wishlist.",
        "sectionid": "wishlist-widget"
    }
];

function Sections() {
    const loaderData = useLoaderData();
    const fetcher = useFetcher();
    const [selectedSection, setSelectedSection] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [selectedTab, setSelectedTab] = useState(0);

    // Handle errors from loader
    if (!loaderData.success) {
        return (
            <Page fullWidth>
                <TitleBar title="Sections" />
                <Banner status="critical" title="Error Loading Sections">
                    <p>{loaderData.error || "Failed to load sections. Please try again."}</p>
                </Banner>
            </Page>
        );
    }

    const { shop, themeId } = loaderData;

    const handleAddSection = (sectionId) => {
        setSelectedSection(sectionId);
        
        const formData = new FormData();
        formData.append('action', 'add_section');
        formData.append('sectionId', sectionId);
        formData.append('themeId', themeId);
        
        fetcher.submit(formData, { method: 'post' });
        
        setToastMessage(`Adding ${sectionId} to your theme...`);
        setShowToast(true);
    };

    const handleGetAssets = () => {
        const formData = new FormData();
        formData.append('action', 'get_theme_assets');
        formData.append('themeId', themeId);
        
        fetcher.submit(formData, { method: 'post' });
    };

    // Show success/error messages
    if (fetcher.data) {
        if (fetcher.data.success) {
            setToastMessage(fetcher.data.message || "Operation completed successfully!");
        } else {
            setToastMessage(fetcher.data.error || "Operation failed. Please try again.");
        }
        setShowToast(true);
    }

    const tabs = [
        {
            id: 'sections',
            content: 'App Sections',
            accessibilityLabel: 'App Sections',
            panelID: 'sections-panel',
        },
        {
            id: 'theme-manager',
            content: 'Theme Manager',
            accessibilityLabel: 'Theme Manager',
            panelID: 'theme-manager-panel',
        },
    ];

    const tabPanels = [
        {
            id: 'sections-panel',
            tabID: 'sections',
            content: (
                <>
                    {themeId && (
                        <Banner status="info" title="Theme Connected">
                            <p>Connected to theme ID: {themeId}</p>
                            <button onClick={handleGetAssets}>View Theme Assets</button>
                        </Banner>
                    )}

                    <Grid>
                        {sections.map((item, index) => (
                            <Grid.Cell key={index} columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                <MediaCard
                                    portrait
                                    title={item.title}
                                    primaryAction={{
                                        content: 'ADD SECTION', 
                                        onAction: () => handleAddSection(item.sectionid),
                                        loading: fetcher.state === 'submitting' && selectedSection === item.sectionid
                                    }}
                                    description={item.description}>
                                    <img
                                        alt={item.title}
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                                        src={item.src}
                                    />
                                </MediaCard>
                            </Grid.Cell>
                        ))}
                    </Grid>
                </>
            ),
        },
        {
            id: 'theme-manager-panel',
            tabID: 'theme-manager',
            content: (
                <ThemeManager themeId={themeId} shop={shop} />
            ),
        },
    ];

    return (
        <>
            <Page fullWidth>
                <TitleBar title="Sections & Theme Manager" />
                
                <Tabs
                    tabs={tabs}
                    selected={selectedTab}
                    onSelect={setSelectedTab}
                >
                    {tabPanels[selectedTab].content}
                </Tabs>

                {showToast && (
                    <Toast
                        content={toastMessage}
                        onDismiss={() => setShowToast(false)}
                        duration={4000}
                    />
                )}
            </Page>
        </>
    );
}

export default Sections;
