import { json } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useFetcher, useRouteError } from "@remix-run/react";
import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  FormLayout,
  Layout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { authenticate } from "../shopify.server";

const FUNCTION_HANDLE = "ambitionkids-dicountapp";
const FUNCTION_TITLE = "Ambition Kids Discount";
const DEFAULT_TITLE = "Ambition Kids Steal Deal";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const title = String(formData.get("title") || DEFAULT_TITLE).trim();
  const startsAt = String(formData.get("startsAt") || "").trim();
  const endsAt = String(formData.get("endsAt") || "").trim();

  const functionsResponse = await admin.graphql(
    `#graphql
      query GetShopifyFunctions {
        shopifyFunctions(first: 50) {
          nodes {
            id
            apiType
            title
          }
        }
      }
    `,
  );

  const functionsJson = await functionsResponse.json();

  if (functionsJson.errors?.length) {
    return json({
      ok: false,
      error: functionsJson.errors.map((item) => item.message).join(", "),
    });
  }

  const discountFunction = functionsJson.data?.shopifyFunctions?.nodes?.find(
    (fn) => fn.title === FUNCTION_TITLE,
  ) ?? functionsJson.data?.shopifyFunctions?.nodes?.find(
    (fn) => String(fn.apiType || "").toLowerCase().includes("discount"),
  );

  if (!discountFunction?.id) {
    return json({
      ok: false,
      error:
        "Discount function not found for this store. Deploy and release the app version that contains the discount extension, then try again.",
    });
  }

  const response = await admin.graphql(
    `#graphql
      mutation CreateStealDeal($automaticAppDiscount: DiscountAutomaticAppInput!) {
        discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
          automaticAppDiscount {
            discountId
            title
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        automaticAppDiscount: {
          title: title || DEFAULT_TITLE,
          functionId: discountFunction.id,
          discountClasses: ["PRODUCT"],
          startsAt: startsAt || new Date().toISOString(),
          ...(endsAt ? { endsAt } : {}),
        },
      },
    },
  );

  const responseJson = await response.json();
  const createResult = responseJson.data?.discountAutomaticAppCreate;
  const userErrors = createResult?.userErrors ?? [];

  if (responseJson.errors?.length) {
    return json({
      ok: false,
      error: responseJson.errors.map((item) => item.message).join(", "),
    });
  }

  if (userErrors.length > 0) {
    return json({
      ok: false,
      error: userErrors.map((item) => item.message).join(", "),
    });
  }

  return json({
    ok: true,
    discount: createResult?.automaticAppDiscount ?? null,
  });
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [startsAt, setStartsAt] = useState(getLocalDateTimeInputValue());
  const [endsAt, setEndsAt] = useState("");

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (fetcher.data?.ok) {
      shopify.toast.show("Discount created");
    }

    if (fetcher.data?.error) {
      shopify.toast.show(fetcher.data.error, {
        duration: 5000,
        isError: true,
      });
    }
  }, [fetcher.data, shopify]);

  const createDiscount = () =>
    fetcher.submit(
      {
        title,
        startsAt: toIsoUtc(startsAt),
        endsAt: endsAt ? toIsoUtc(endsAt) : "",
      },
      { method: "POST" },
    );

  return (
    <Page>
      <TitleBar title="Ambition Kids Discount App" />
      <Layout>
        <Layout.Section>
          <Card>
            <Box padding="500">
              <BlockStack gap="400">
                <Text as="h1" variant="headingLg">
                  Create automatic product discount
                </Text>
                <Text as="p" tone="subdued">
                  This creates the Shopify automatic discount record for function
                  handle <strong>{FUNCTION_HANDLE}</strong>.
                </Text>
                <FormLayout>
                  <TextField
                    label="Discount title"
                    value={title}
                    onChange={setTitle}
                    autoComplete="off"
                  />
                  <TextField
                    label="Starts at"
                    type="datetime-local"
                    value={startsAt}
                    onChange={setStartsAt}
                    autoComplete="off"
                  />
                  <TextField
                    label="Ends at (optional)"
                    type="datetime-local"
                    value={endsAt}
                    onChange={setEndsAt}
                    autoComplete="off"
                  />
                  <Button variant="primary" onClick={createDiscount} loading={isLoading}>
                    Create discount
                  </Button>
                </FormLayout>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card>
            <Box padding="500">
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Function setup
                </Text>
                <Text as="p">
                  <strong>Discount type:</strong> Automatic product discount
                </Text>
                <Text as="p">
                  <strong>Function handle:</strong> {FUNCTION_HANDLE}
                </Text>
                <Text as="p">
                  <strong>Behavior:</strong> Collection A unlocks fixed price
                  Rs.599 for Collection B products already in the cart.
                </Text>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        {fetcher.data?.error && (
          <Layout.Section>
            <Banner tone="critical" title="Discount creation failed">
              <p>{fetcher.data.error}</p>
            </Banner>
          </Layout.Section>
        )}

        {fetcher.data?.discount && (
          <Layout.Section>
            <Card>
              <Box padding="500">
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Created discount
                  </Text>
                  <pre
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      background: "#f6f6f7",
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 12,
                    }}
                  >
                    <code>{JSON.stringify(fetcher.data.discount, null, 2)}</code>
                  </pre>
                </BlockStack>
              </Box>
            </Card>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
}

function getLocalDateTimeInputValue() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function toIsoUtc(value) {
  return new Date(value).toISOString();
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}
