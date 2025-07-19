// Error handling utilities for Shopify API operations

export class ShopifyAPIError extends Error {
  constructor(message, status, response, endpoint) {
    super(message);
    this.name = 'ShopifyAPIError';
    this.status = status;
    this.response = response;
    this.endpoint = endpoint;
    this.timestamp = new Date().toISOString();
  }
}

export const handleShopifyAPIError = (error, context = '') => {
  console.error(`Shopify API Error [${context}]:`, {
    message: error.message,
    status: error.status,
    endpoint: error.endpoint,
    timestamp: error.timestamp,
    response: error.response
  });

  // Common error patterns
  if (error.status === 403) {
    return {
      success: false,
      error: 'Access forbidden. Please check your app permissions and scopes.',
      details: 'Your app may need additional scopes or the access token may be invalid.',
      code: 'FORBIDDEN'
    };
  }

  if (error.status === 401) {
    return {
      success: false,
      error: 'Authentication failed. Please re-authenticate your app.',
      details: 'The access token may have expired or be invalid.',
      code: 'UNAUTHORIZED'
    };
  }

  if (error.status === 404) {
    return {
      success: false,
      error: 'Resource not found.',
      details: 'The requested theme, asset, or endpoint does not exist.',
      code: 'NOT_FOUND'
    };
  }

  if (error.status === 422) {
    return {
      success: false,
      error: 'Validation error.',
      details: 'The request data is invalid or missing required fields.',
      code: 'VALIDATION_ERROR'
    };
  }

  if (error.status >= 500) {
    return {
      success: false,
      error: 'Shopify server error.',
      details: 'Shopify is experiencing issues. Please try again later.',
      code: 'SERVER_ERROR'
    };
  }

  return {
    success: false,
    error: error.message || 'An unexpected error occurred.',
    details: 'Please check your request and try again.',
    code: 'UNKNOWN_ERROR'
  };
};

export const validateShopifyResponse = async (response, endpoint) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorDetails = '';

    try {
      const errorData = await response.text();
      errorDetails = errorData;
      
      // Try to parse as JSON for better error details
      try {
        const jsonError = JSON.parse(errorData);
        if (jsonError.errors) {
          errorMessage = jsonError.errors;
        }
      } catch (e) {
        // Not JSON, use as text
      }
    } catch (e) {
      errorDetails = 'Could not read error response';
    }

    throw new ShopifyAPIError(
      errorMessage,
      response.status,
      errorDetails,
      endpoint
    );
  }

  return response;
};

export const logShopifyRequest = (method, endpoint, data = null) => {
  console.log(`Shopify API Request:`, {
    method,
    endpoint,
    data: data ? (typeof data === 'string' ? data : JSON.stringify(data)) : null,
    timestamp: new Date().toISOString()
  });
};

export const logShopifyResponse = (response, data = null) => {
  console.log(`Shopify API Response:`, {
    status: response.status,
    statusText: response.statusText,
    data: data ? (typeof data === 'string' ? data : JSON.stringify(data)) : null,
    timestamp: new Date().toISOString()
  });
};

// Utility to check if scopes are sufficient
export const checkRequiredScopes = (requiredScopes, currentScopes) => {
  if (!currentScopes) return false;
  
  const currentScopeArray = currentScopes.split(',').map(s => s.trim());
  const requiredScopeArray = requiredScopes.split(',').map(s => s.trim());
  
  return requiredScopeArray.every(scope => currentScopeArray.includes(scope));
};

// Common scope requirements
export const SCOPES = {
  THEME_READ: 'read_themes',
  THEME_WRITE: 'write_themes',
  FILE_READ: 'read_files',
  FILE_WRITE: 'write_files',
  PRODUCT_READ: 'read_products',
  PRODUCT_WRITE: 'write_products',
  ORDER_READ: 'read_orders',
  ORDER_WRITE: 'write_orders'
};

export const REQUIRED_SCOPES = {
  THEME_OPERATIONS: `${SCOPES.THEME_READ},${SCOPES.THEME_WRITE}`,
  FILE_OPERATIONS: `${SCOPES.FILE_READ},${SCOPES.FILE_WRITE}`,
  FULL_ACCESS: `${SCOPES.THEME_READ},${SCOPES.THEME_WRITE},${SCOPES.FILE_READ},${SCOPES.FILE_WRITE},${SCOPES.PRODUCT_READ},${SCOPES.PRODUCT_WRITE},${SCOPES.ORDER_READ},${SCOPES.ORDER_WRITE}`
}; 