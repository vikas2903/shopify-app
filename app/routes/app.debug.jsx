import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server.js";
import { Page, Card, Text, Banner, Button } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import Store from '../backend/modals/store.js';
import mongoose from "mongoose";

export const loader = async ({ request }) => {
    try {
        const { session } = await authenticate.admin(request);

        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        const store = await Store.findOne({ shop: session.shop });

        return json({
            success: true,
            session: {
                shop: session.shop,
                hasAccessToken: !!session.accessToken,
                accessTokenLength: session.accessToken?.length,
                scope: session.scope,
                isOnline: session.isOnline,
                userId: session.userId,
                expires: session.expires
            },
            database: {
                hasStore: !!store,
                hasAccessToken: !!store?.accessToken,
                accessTokenLength: store?.accessToken?.length,
                updatedAt: store?.updatedAt
            },
            environment: {
                hasApiKey: !!process.env.SHOPIFY_API_KEY,
                hasApiSecret: !!process.env.SHOPIFY_API_SECRET,
                hasMongoUri: !!process.env.MONGO_URI,
                appName: process.env.SHOPIFY_APP_NAME
            }
        });

    } catch (error) {
        console.error("Debug loader error:", error);
        return json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
};

export default function Debug() {
    const data = useLoaderData();

    if (!data.success) {
        return (
            <Page fullWidth>
                <TitleBar title="Debug - Authentication Issues" />
                <Banner status="critical" title="Debug Error">
                    <p>{data.error}</p>
                    <pre style={{ fontSize: '12px', marginTop: '8px' }}>{data.stack}</pre>
                </Banner>
            </Page>
        );
    }

    return (
        <Page fullWidth>
            <TitleBar title="Debug - Authentication Status" />
            
            <Card>
                <div style={{ padding: '16px' }}>
                    <Text variant="headingMd" as="h3">Session Information</Text>
                    <pre style={{ 
                        backgroundColor: '#f6f6f7', 
                        padding: '12px', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        overflow: 'auto'
                    }}>
                        {JSON.stringify(data.session, null, 2)}
                    </pre>
                </div>
            </Card>

            <Card>
                <div style={{ padding: '16px' }}>
                    <Text variant="headingMd" as="h3">Database Information</Text>
                    <pre style={{ 
                        backgroundColor: '#f6f6f7', 
                        padding: '12px', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        overflow: 'auto'
                    }}>
                        {JSON.stringify(data.database, null, 2)}
                    </pre>
                </div>
            </Card>

            <Card>
                <div style={{ padding: '16px' }}>
                    <Text variant="headingMd" as="h3">Environment Variables</Text>
                    <pre style={{ 
                        backgroundColor: '#f6f6f7', 
                        padding: '12px', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        overflow: 'auto'
                    }}>
                        {JSON.stringify(data.environment, null, 2)}
                    </pre>
                </div>
            </Card>

            <Card>
                <div style={{ padding: '16px' }}>
                    <Text variant="headingMd" as="h3">Actions</Text>
                    <div style={{ marginTop: '8px' }}>
                        <Button 
                            url="/auth/login" 
                            external
                            variant="primary"
                        >
                            Re-authenticate App
                        </Button>
                    </div>
                </div>
            </Card>
        </Page>
    );
} 