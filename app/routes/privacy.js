export const loader = () => {
  const html = `
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy Page</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Barlow", sans-serif;
        }

        .privacy-policy-wrapper h1 span {
            color: #1a73e9
        }

        .pag-width {
            width: 100%;
            max-width: 1300px;
            padding: 0 5rem;
            margin: auto;
            box-sizing: border-box;
            position: relative;
            z-index: 99;
        }

        .privacy-policy-wrapper h1 {
            font-size: 1.8rem;
            line-height: 2;
            font-family: "Barlow", sans-serif;
        }

        .privacy-policy-wrapper h3 {
            font-size: 1.4rem;
            line-height: 1.6;
        }

        .privacy-policy-wrapper p {
            font-size: 1.1rem;
            line-height: 1.4;
            margin-bottom: .6rem;
        }

        .privacy-policy-wrapper li {
            font-size: 1.1rem;
            line-height: 1.6;
        }

        .privacy-policy-wrapper ul {
            padding-left: 1.6rem;
            margin-bottom: .6rem;
        }

        .pag-width>hr {

            height: 6px;
            background: #1a73e9;
            border: none;
            margin-top: 2rem;
            outline: none;
        }

        .background-image:before {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            height: 100%;
            width: 100%;
            z-index: 9;
            background: url(https://cdn.shopify.com/s/files/1/0796/7847/2226/files/107480.jpg?v=1753077037);
            content: '';
            background-size: cover;
            background-repeat: no-repeat;
        }

        .background-image {
            position: relative;
            padding: 3rem 0;
        }

        .background-image:before {
            background-position: top;
        }

        @media(max-width:991px) {
            .pag-width {
                padding: 0 1rem;
            }
        }
    </style>
</head>

<body>
    <div class="background-image">
        <div class="pag-width">
            <div class="privacy-policy-container">
                <div class="privacy-policy-wrapper">
                    <h1><span>LayerUp</span> Privacy Policy</h1>
                    <p>LayerUp provides merchants who use Shopify to power
                        their
                        stores with a range of tools to enhance store
                        performance.
                        This Privacy Policy describes how personal
                        information
                        is
                        collected, used, and shared when you install or use
                        the
                        App
                        in connection with your Shopify-supported store.</p>

                    <h3>Personal Information the App Collects</h3>
                    <p>When you install the App, we are automatically able
                        to
                        access
                        certain types of information from your Shopify
                        account:</p>

                    <ul>
                        <li><b>Shop Name:</b> The name of your store (e.g.,
                            "d2c-apps.myshopify.com").</li>
                        <li><b>Store Theme Information:</b> We access the
                            store
                            theme to enable and manage app blocks like
                            announcement
                            bars, product sliders, and other customizable
                            elements.</li>
                        <li><b>API Access:</b> We request permission to read
                            and
                            write your store's theme for customizing and
                            enhancing
                            your store's user experience.</li>
                    </ul>

                    <p><b>We do not collect or store any personal customer
                            data</b>, order
                        information, or payment details from your store.</p>

                    <p>Additionally, we collect the following types of
                        personal
                        information from you as the store owner once you
                        have
                        installed the App:</p>
                    <ul>
                        <li><b>Store Owner Information:</b> Information
                            about
                            the
                            merchant using the app, such as the name, email
                            address,
                            phone number, and billing information.</li>
                    </ul>

                    <p>We collect personal information directly from you
                        through
                        your Shopify account or using the following
                        technologies:</p>
                    <ul>
                        <li>
                            <b>Cookies:</b> These are small data files
                            placed on
                            your device or computer that often include an
                            anonymous unique identifier. For more
                            information
                            about cookies and how to disable them, visit <a href="https://allaboutcookies.org"
                                target="_blank">allaboutcookies.org</a>
                        </li>

                        <li><b>Web Beacons, Tags, and Pixels:</b> These are
                            used
                            to track and analyze how users browse the
                            app.</li>
                    </ul>

                    <h3>How Do We Use Your Personal Information?</h3>
                    <p>We use the personal information we collect from you
                        to
                        provide the Service and operate the App.
                        Specifically,
                        we use this information to:</p>
                    <ul>
                        <li><b>Optimize the App: </b>To enhance and improve
                            the
                            app's features, ensuring it works as
                            expected.</li>
                        <li><b>rovide Information: </b>To send you relevant
                            product or service updates, promotions, or
                            notifications regarding the app.</li>
                    </ul>

                    <p>We <b>do not engage in any behavioral or targeted
                            advertising</b> using your data.</p>

                    <h3>Sharing Your Personal Information</h3>
                    <p>We <b>do not share, sell, or transmit any store
                            data.</b>
                        Since we don’t store sensitive data, there is
                        nothing to
                        share.</p>

                    <p>If necessary, we may share your personal information
                        to
                        comply with applicable laws and regulations, respond
                        to
                        subpoenas, or to protect our rights.</p>

                    <h3>Data Retention</h3>
                    <p>We will retain your store data as long as you are
                        using
                        the app. Once you uninstall the app, all your store
                        data
                        is immediately removed from our end. No further
                        retention is required.</p>

                    <h3>Changes</h3>
                    <p>We may update this privacy policy from time to time
                        in
                        order to reflect changes in our practices or for
                        legal
                        reasons.</p>

                    <h3>Contact</h3>
                    <p>For more information about our privacy practices, if
                        you
                        have questions, or if you would like to make a
                        complaint, please contact us by email at <a
                            href="mailto:support@digisidekick.com">support@digisidekick.com</a>

                    </p>
                </div>
            </div>
            <hr>
        </div>
    </div>
</body>

</html>
  `;
  
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
};
