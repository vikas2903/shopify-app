import fetch from 'node-fetch';

const SHOP = process.env.SHOPIFY_TEMP_SHOPNAME;
const ACCESS_TOKEN = process.env.SHOPIFY_TEMP_SHOPNAME;

const shopifyFetch = async (query) => {
  const response = await fetch(`https://${SHOP}.myshopify.com/admin/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const json = await response.json();
  if (json.errors) {
    console.error("Shopify API Errors:", JSON.stringify(json.errors, null, 2));
  }
  return json;
};

// Helper to count items via pagination
const countItems = async (queryName) => {
  let hasNextPage = true;
  let cursor = null;
  let count = 0;

  while (hasNextPage) {
    const query = `
      {
        ${queryName}(first: 100${cursor ? `, after: "${cursor}"` : ''}) {
          edges {
            cursor
            node { id }
          }
          pageInfo { hasNextPage }
        }
      }
    `;

    const data = await shopifyFetch(query);
    const edges = data?.data?.[queryName]?.edges || [];
    count += edges.length;
    hasNextPage = data?.data?.[queryName]?.pageInfo?.hasNextPage;
    if (hasNextPage) {
      cursor = edges[edges.length - 1].cursor;
    }
  }

  return count;
};

export const getDashboardData = async (req, res) => {
  try {
    // Today's date at midnight (UTC)
    const todayISO = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();

    // Orders placed today
    const orderTodayQuery = `
      {
        orders(first: 100, query: "created_at:>=${todayISO}") {
          edges { node { id createdAt } }
        }
      }
    `;
    const ordersToday = await shopifyFetch(orderTodayQuery);
    const orderTodayCount = ordersToday?.data?.orders?.edges?.length || 0;

    // Accurate counts via pagination
    const productCount = await countItems("products");
    const customerCount = await countItems("customers");

    // Conversion rate — replace with real session value if available
    const sessions = 1000;
    const conversionRate = ((orderTodayCount / sessions) * 100).toFixed(2);

    res.json({
      success: true,
      orderTodayCount,
      productCount,
      customerCount,
      conversionRate: `${conversionRate}%`,
    });

  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error.message);
    res.status(500).json({ error: "Failed to fetch dashboard data", details: error.message });
  }
};
