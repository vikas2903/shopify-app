import { useEffect } from "react";

export default function Root() {
  // useEffect(() => {
  //   // Prevent duplicate script injection
  //   if (document.getElementById("zsiqscript")) return;

  //   // Set Zoho global object
  //   window.$zoho = window.$zoho || {};
  //   window.$zoho.salesiq = window.$zoho.salesiq || {
  //     ready: function () {
  //       console.log("Zoho SalesIQ is ready");
  //     },
  //   };

  //   // Create the script element
  //   const script = document.createElement("script");
  //   script.id = "zsiqscript";
  //   script.src =
  //     "https://salesiq.zohopublic.in/widget?wc=siq2084c27fe220c816892dec0d99a9092a03d9399a0a187b9968460a97f4233ff0";
  //   script.defer = true;

  //   document.body.appendChild(script);
  // }, []);

  return null;
}
