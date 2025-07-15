
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
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";

// import { authenticate } from "../shopify.server";
import { json, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import nodemailer from "nodemailer";

import mongoose from "mongoose"; 
import QueryData from '../backend/modals/querydata.js'

// export const loader = async ({ request }) => {
//   const { session } = await authenticate.admin(request);
//   const shop = session.shop;
//   return json({ shop });
// };

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const shop = formData.get("shop");
  const pages = formData.getAll("pages");
  const block = formData.get("block");
  const address = formData.get("address");

  const formDetails = {
    name,
    email,
    shop,
    pages,
    block,
    address,
  };

  // ✅ Connect to MongoDB (add your Mongo URI in .env or here directly)
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI || "your-mongodb-connection-url");
  }

  // ✅ Save to database
  await QueryData.create(formDetails);


  // ✅ Then continue your email logic as before
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  const adminHtml = `
    <h2>New Support Request from ${shop}</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Shop:</strong> ${shop}</p>
    <p><strong>Pages:</strong> ${pages.join(", ")}</p>
    <p><strong>Block:</strong> ${block}</p>
    <p><strong>Message:</strong><br/> ${address}</p>
  `;

  const userHtml = `
    <h2>Hi ${name},</h2>
    <p>Thank you for contacting Digi Sidekick support. We have received your request and will get back to you shortly.</p>
    <h3>Your submitted details:</h3>
    <p><strong>Shop:</strong> ${shop}</p>
    <p><strong>Pages:</strong> ${pages.join(", ")}</p>
    <p><strong>Block:</strong> ${block}</p>
    <p><strong>Message:</strong><br/> ${address}</p>
    <p>Best regards,<br/>Digi Sidekick Team</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Support Form" <vikasprasad2903@gmail.com>`,
      to: "vikasprasad@digisidekick.com",
      cc: "suraj@digisidekick.com",
      subject: `New Support Request from ${shop}`,
      html: adminHtml,
    });

    await transporter.sendMail({
      from: `"Digi Sidekick Support" <vikasprasad2903@gmail.com>`,
      to: email,
      subject: `We received your support request`,
      html: userHtml,
    });

    // ✅ Redirect to thank-you page or same page with success query param
    return redirect("/app/support?success=true");
  } catch (error) {
    console.error("Email sending error:", error);
    return json({ success: false, error: "Failed to send email" });
  }
};

export default function SupportApp() {
  // const { shop } = useLoaderData();
  // const actionData = useActionData();
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selected_list, setSelected_list] = useState("d2c-announcementbar");
  const [address, setAddress] = useState("");
  const [sessionWarning, setSessionWarning] = useState(false);
  const [store, setstore] = useState("")

  const options = [
    { label: "Select Blocks", value: " " },
    { label: "Wishlist Page", value: "wishlist-page" },
    { label: "DS-Announcement Bar", value: "ds-announcement-bar" },
    { label: "DS-Scrolling Text", value: "ds-scrolling-text" },
    { label: "DS-Offer Slider", value: "ds-offer-slider" },
    { label: "DS-Offer Coupon Card", value: "ds-offer-coupon-card" },
    { label: "DS-Product Usp Icons", value: "ds-product-usp-icons" },
    { label: "DS-Image With Text", value: "ds-image-with-text" },
    { label: "DS-Subcollection List", value: "ds-subcollection-list" },
    { label: "DS-Cart Drawer Progress Bar", value: "ds-cart-drawer-progress-bar" },
    { label: "DS-Offer With Copy Code", value: "ds-Offer-with-copy-code" },
    { label: "DS-Recent View Products", value: "ds-recent-view-products" },
    { label: "DS-Whatsapp Floating Button", value: "ds-whatsapp-floating-button" },
    { label: "DS-Countdown Timer", value: "ds-countdown-timer" },
  ];

  useEffect(() => {
    // Check URL for success param and show alert
    if (window.location.search.includes("success=true")) {
      alert("Support request sent successfully! We also sent you a copy.");
      // Redirect to some other page after alert
      navigate("/app/", { replace: true });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSessionWarning(true);
    }, 15 * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Page fullWidth={true}>
        <TitleBar title="Setup Request" />

        <Button
          url="/app/support"
          variant="plain"
          icon={ArrowLeftIcon}
          style={{ color: "black" }}
        >
          Back
        </Button>

        <br />
        <br />

        <Layout>
          <Layout.Section>
            <Card title="Support App" style={{ padding: "40px 10px" }}>
              {sessionWarning && (
                <Banner title="Session Warning" status="warning">
                  Your session may have expired. Please refresh the page before submitting to avoid login issues.
                </Banner>
              )}
              <form method="post">
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
                      onChange={setstore}
                      placeholder="eg: d2c-apps.myshopify.com"
                      // readOnly
                    />
                  </FormLayout.Group>

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
            <br />
            <br />
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
}
