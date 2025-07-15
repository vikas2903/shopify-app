import {
  Page,
  Layout,
  Card,
  DataTable,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import QueryData from "../backend/modals/querydata.js";  

export const loader = async () => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI || "your-mongodb-url");
  }

  const queries = await QueryData.find().sort({ createdAt: -1 }).lean();

  return json({ queries });
};

export default function SupportQueries() {
  const { queries } = useLoaderData();

  // Prepare rows for DataTable
  const rows = queries.map((q) => [
    q.name,
    q.email,
    q.shop,
    q.block,
    q.pages?.join(", "),
    q.address,
    q.createdAt ? new Date(q.createdAt).toLocaleString() : "",
    // Last column: Reply button
    <Button
      size="slim"
      onClick={() => window.location.href = `mailto:${q.email}?subject=Reply to your support query`}
    >
      Reply
    </Button>,
  ]);

  return (
    <Page fullWidth={true}>
      <TitleBar title="Support Queries" />

      <Layout>
        <Layout.Section >
          <Card>
            <DataTable
              columnContentTypes={[
                "text",
                "text",
                "text",
                "text",
                "text",
                "text",
                "text",
                "text",
              ]}
              headings={[
                "Name",
                "Email",
                "Shop",
                "Block",
                "Pages",
                "Message",
                "Created At",
                "Reply",
              ]}
              rows={rows}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
