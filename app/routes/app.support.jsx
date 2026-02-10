import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Button,
  OptionList,
  Select,
  Banner,
  Link,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import { useState, useEffect } from "react";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import QueryData from "../backend/modals/querydata.js";
import { adminNotificationEmail, userConfirmationEmail } from "../utils/emailTemplate.js";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return json({ shop: session.shop });
};

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const formData = await request.formData();
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const shop = (formData.get("shop") || "").toString().trim();
  const pagesRaw = formData.getAll("pages");
  const pages = Array.isArray(pagesRaw) ? pagesRaw : [pagesRaw].filter(Boolean);
  const block = (formData.get("block") || "").toString().trim();
  const address = (formData.get("address") || "").toString().trim();

  if (!name || !email || !shop) {
    return json({
      success: false,
      error: "Please fill in Name, Email, and Store URL.",
    });
  }

  const formDetails = { name, email, shop, pages, block, address };
  const pagesStr = Array.isArray(pages) ? pages.join(", ") : String(pages);

  try {
    if (process.env.MONGO_URI && mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    if (mongoose.connection.readyState === 1) {
      await QueryData.create(formDetails);
    }
  } catch (dbError) {
    console.error("Support form DB save error:", dbError);
  }

  const hasBrevo =
    process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASS;

  if (hasBrevo) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
          user: process.env.BREVO_SMTP_USER,
          pass: process.env.BREVO_SMTP_PASS,
        },
      });

      let adminHtml, userHtml;
      try {
        adminHtml = adminNotificationEmail({
          type: "support",
          shop,
          name,
          email,
          pagesStr,
          block,
          address,
        });
        userHtml = userConfirmationEmail({
          name,
          shop,
          pagesStr,
          block,
          address,
          type: "support",
        });
      } catch (templateError) {
        console.error("Support email template error:", templateError);
        adminHtml = `<h2>New Support Request from ${shop}</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Shop:</strong> ${shop}</p><p><strong>Pages:</strong> ${pagesStr}</p><p><strong>Block:</strong> ${block}</p><p><strong>Message:</strong><br/>${address}</p>`;
        userHtml = `<p>Hi ${name},</p><p>Thank you for contacting LayerUp support. We have received your request and will get back to you shortly.</p><p><strong>Shop:</strong> ${shop}</p><p><strong>Pages:</strong> ${pagesStr}</p><p><strong>Block:</strong> ${block}</p><p><strong>Message:</strong><br/>${address}</p><p>Best regards,<br/>LayerUp Team</p>`;
      }

      await transporter.sendMail({
        from: process.env.BREVO_FROM_EMAIL || `"Support" <${process.env.BREVO_SMTP_USER}>`,
        to: process.env.SUPPORT_ADMIN_EMAIL || process.env.BREVO_SMTP_USER,
        subject: `New Support Request from ${shop}`,
        html: adminHtml,
      });

      await transporter.sendMail({
        from: process.env.BREVO_FROM_EMAIL || `"LayerUp Support" <${process.env.BREVO_SMTP_USER}>`,
        to: email,
        subject: "We received your support request",
        html: userHtml,
      });
    } catch (emailError) {
      console.error("Support form email error:", emailError);
      return json({
        success: false,
        error: "Request saved but we could not send the confirmation email. We will still get back to you.",
      });
    }
  }

  return json({ success: true });
};

export default function SupportApp() {
  const { shop } = useLoaderData();
  const actionData = useActionData();

  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selected_list, setSelected_list] = useState(" ");
  const [address, setAddress] = useState("");
  const [sessionWarning, setSessionWarning] = useState(false);
  const [store, setStore] = useState(shop || "");

  const showSuccess = actionData?.success === true;

  const options = [
    { label: "Select Blocks", value: " " },
    { label: "Smart Announcement Bar", value: "smart-announcement-bar" },
    { label: "Subcategory List", value: "subcategory-list" },
    { label: "Multi variant section", value: "multi-variant-section" },
    { label: "Trust Badges", value: "trust-badges" },
    { label: "Offer Timer", value: "offer-timer" },
    { label: "Progress Bar", value: "progress-bar" },
    { label: "Featured Product Carousel", value: "featured-product-carousel" },
    { label: "Coupon Codes & Offers", value: "coupon-codes&Offers" },
    { label: "Other", value: "other" },
  ];

  useEffect(() => {
    if (shop && !store) setStore(shop);
  }, [shop, store]);

  useEffect(() => {
    const timer = setTimeout(() => setSessionWarning(true), 15 * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Page>
        <TitleBar title="Setup Request" />
 
        <Layout>
          <Layout.Section>
            <Card title="Support" style={{ padding: "40px 10px" }}>
              {showSuccess && (
                <Banner status="success" onDismiss={() => {}}>
                  Your support request was sent successfully. We'll get back to you shortly.
                </Banner>
              )}
              {actionData && !actionData.success && actionData.error && (
                <Banner title="Submission failed" status="critical" onDismiss={() => {}}>
                  {actionData.error}
                </Banner>
              )}
              {sessionWarning && (
                <Banner title="Session Warning" status="warning">
                  Your session may have expired. Please refresh the page before submitting to avoid login issues.
                </Banner>
              )}
              <form method="post" action="/app/support">
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      type="text"
                      label="Your Name"
                      name="name"
                      value={name}
                      onChange={setName}
                      autoComplete="off"
                    />
                    <TextField
                      type="email"
                      label="Email"
                      name="email"
                      value={email}
                      onChange={setEmail}
                      autoComplete="off"
                    />
                  </FormLayout.Group>

                  <FormLayout.Group>
                    <TextField
                      type="text"
                      label="Store URL"
                      name="shop"
                      value={store}
                      onChange={setStore}
                      placeholder="eg: your-store.myshopify.com"
                      autoComplete="off"
                    />
                  </FormLayout.Group>

                  <input type="hidden" name="block" value={selected_list} />

                  <OptionList
                    title="Checked your page getting Error to use"
                    onChange={setSelected}
                    options={[
                      { value: "homepage", label: "Homepage" },
                      { value: "collectionpage", label: "Collection Page" },
                      { value: "productpage", label: "Product Page" },
                      { value: "cart&cartdrawer page", label: "Cart & Cartdrawer page" },
                      { value: "wishlist", label: "Wishlist" },
                      { value: "other", label: "Other" },
                    ]}
                    selected={selected}
                    allowMultiple
                  />

                  {selected.map((page, index) => (
                    <input key={index} type="hidden" name="pages" value={page} />
                  ))}

                  <Select
                    label="Block causing issue"
                    options={options}
                    value={selected_list}
                    onChange={setSelected_list}
                    name="block"
                  />

                  <TextField
                    label="Message"
                    name="address"
                    value={address}
                    onChange={setAddress}
                    multiline={4}
                    autoComplete="off"
                  />

                  <Button
                    submit
                    size="large"
                    fullWidth={true}
                    style={{ background: "#000", color: "#fff" }}
                    variant="primary"
                  >
                    Submit
                  </Button>
                </FormLayout>
              </form>
            </Card>
          
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
}
