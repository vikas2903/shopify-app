import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server.js";
import fetch from "node-fetch";
import { 
  handleShopifyAPIError, 
  validateShopifyResponse, 
  logShopifyRequest, 
  logShopifyResponse,
  REQUIRED_SCOPES 
} from "../utils/errorHandler.js";

// Loader to get theme information
export const loader = async ({ request }) => {
    try {
        const { session } = await authenticate.admin(request);
        const shopFull = session.shop;
        const accessToken = session.accessToken;

        // Check if we have the required scopes
        if (!session.scope || !session.scope.includes('read_themes')) {
            throw new Error('Insufficient permissions. App needs read_themes scope.');
        }

        const themesEndpoint = `https://${shopFull}/admin/api/2023-10/themes.json`;
        
        logShopifyRequest('GET', themesEndpoint);
        
        // Get themes
        const themesResponse = await fetch(themesEndpoint, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
            },
        });

        await validateShopifyResponse(themesResponse, themesEndpoint);
        const themesData = await themesResponse.json();
        logShopifyResponse(themesResponse, themesData);

        const mainTheme = themesData.themes.find(theme => theme.role === "main");

        if (!mainTheme) {
            throw new Error("No published theme found");
        }

        // Get theme assets
        const assetsEndpoint = `https://${shopFull}/admin/api/2023-10/themes/${mainTheme.id}/assets.json`;
        
        logShopifyRequest('GET', assetsEndpoint);
        
        const assetsResponse = await fetch(assetsEndpoint, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
            },
        });

        await validateShopifyResponse(assetsResponse, assetsEndpoint);
        const assetsData = await assetsResponse.json();
        logShopifyResponse(assetsResponse, assetsData);

        return json({
            success: true,
            theme: mainTheme,
            assets: assetsData.assets,
            shop: shopFull,
            scopes: session.scope
        });

    } catch (error) {
        console.error("Theme operations loader error:", error);
        
        if (error.name === 'ShopifyAPIError') {
            const errorResult = handleShopifyAPIError(error, 'Theme Operations Loader');
            return json(errorResult, { status: error.status || 500 });
        }
        
        return json({
            success: false,
            error: error.message,
            code: 'LOADER_ERROR'
        }, { status: 500 });
    }
};

// Action to handle theme operations
export const action = async ({ request }) => {
    try {
        const { session } = await authenticate.admin(request);
        const formData = await request.formData();
        const operation = formData.get('operation');
        const themeId = formData.get('themeId');
        const assetKey = formData.get('assetKey');
        const content = formData.get('content');

        const shopFull = session.shop;
        const accessToken = session.accessToken;

        console.log(`Theme operation: ${operation}, Theme: ${themeId}`);

        // Check scopes based on operation
        if (operation === 'update_asset' || operation === 'create_asset' || operation === 'delete_asset') {
            if (!session.scope || !session.scope.includes('write_themes')) {
                throw new Error('Insufficient permissions. App needs write_themes scope for this operation.');
            }
        }

        switch (operation) {
            case 'get_asset':
                // Get specific asset content
                const getAssetEndpoint = `https://${shopFull}/admin/api/2023-10/themes/${themeId}/assets.json?asset[key]=${assetKey}`;
                
                logShopifyRequest('GET', getAssetEndpoint);
                
                const getAssetResponse = await fetch(getAssetEndpoint, {
                    method: "GET",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json",
                    },
                });

                await validateShopifyResponse(getAssetResponse, getAssetEndpoint);
                const assetData = await getAssetResponse.json();
                logShopifyResponse(getAssetResponse, assetData);
                
                return json({
                    success: true,
                    asset: assetData.asset
                });

            case 'update_asset':
                // Update asset content
                const updateAssetEndpoint = `https://${shopFull}/admin/api/2023-10/themes/${themeId}/assets.json`;
                const updatePayload = {
                    asset: {
                        key: assetKey,
                        value: content
                    }
                };
                
                logShopifyRequest('PUT', updateAssetEndpoint, updatePayload);
                
                const updateAssetResponse = await fetch(updateAssetEndpoint, {
                    method: "PUT",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatePayload),
                });

                await validateShopifyResponse(updateAssetResponse, updateAssetEndpoint);
                const updateData = await updateAssetResponse.json();
                logShopifyResponse(updateAssetResponse, updateData);
                
                return json({
                    success: true,
                    message: "Asset updated successfully",
                    asset: updateData.asset
                });

            case 'create_asset':
                // Create new asset
                const createAssetEndpoint = `https://${shopFull}/admin/api/2023-10/themes/${themeId}/assets.json`;
                const createPayload = {
                    asset: {
                        key: assetKey,
                        value: content
                    }
                };
                
                logShopifyRequest('PUT', createAssetEndpoint, createPayload);
                
                const createAssetResponse = await fetch(createAssetEndpoint, {
                    method: "PUT",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(createPayload),
                });

                await validateShopifyResponse(createAssetResponse, createAssetEndpoint);
                const createData = await createAssetResponse.json();
                logShopifyResponse(createAssetResponse, createData);
                
                return json({
                    success: true,
                    message: "Asset created successfully",
                    asset: createData.asset
                });

            case 'delete_asset':
                // Delete asset
                const deleteAssetEndpoint = `https://${shopFull}/admin/api/2023-10/themes/${themeId}/assets.json?asset[key]=${assetKey}`;
                
                logShopifyRequest('DELETE', deleteAssetEndpoint);
                
                const deleteAssetResponse = await fetch(deleteAssetEndpoint, {
                    method: "DELETE",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json",
                    },
                });

                await validateShopifyResponse(deleteAssetResponse, deleteAssetEndpoint);
                logShopifyResponse(deleteAssetResponse);
                
                return json({
                    success: true,
                    message: "Asset deleted successfully"
                });

            case 'get_sections':
                // Get theme sections
                const sectionsEndpoint = `https://${shopFull}/admin/api/2023-10/themes/${themeId}/assets.json`;
                
                logShopifyRequest('GET', sectionsEndpoint);
                
                const sectionsResponse = await fetch(sectionsEndpoint, {
                    method: "GET",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json",
                    },
                });

                await validateShopifyResponse(sectionsResponse, sectionsEndpoint);
                const sectionsData = await sectionsResponse.json();
                logShopifyResponse(sectionsResponse, sectionsData);
                
                const sections = sectionsData.assets.filter(asset => 
                    asset.key.startsWith('sections/')
                );
                
                return json({
                    success: true,
                    sections: sections
                });

            case 'get_theme_info':
                // Get detailed theme information
                const themeInfoEndpoint = `https://${shopFull}/admin/api/2023-10/themes/${themeId}.json`;
                
                logShopifyRequest('GET', themeInfoEndpoint);
                
                const themeInfoResponse = await fetch(themeInfoEndpoint, {
                    method: "GET",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json",
                    },
                });

                await validateShopifyResponse(themeInfoResponse, themeInfoEndpoint);
                const themeInfoData = await themeInfoResponse.json();
                logShopifyResponse(themeInfoResponse, themeInfoData);
                
                return json({
                    success: true,
                    theme: themeInfoData.theme
                });

            default:
                return json({
                    success: false,
                    message: "Invalid operation",
                    code: 'INVALID_OPERATION'
                }, { status: 400 });
        }

    } catch (error) {
        console.error("Theme operations action error:", error);
        
        if (error.name === 'ShopifyAPIError') {
            const errorResult = handleShopifyAPIError(error, 'Theme Operations Action');
            return json(errorResult, { status: error.status || 500 });
        }
        
        return json({
            success: false,
            error: error.message,
            code: 'ACTION_ERROR'
        }, { status: 500 });
    }
}; 