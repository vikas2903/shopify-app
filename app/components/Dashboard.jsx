import React from "react";
import "../assets/style/dashboard.css";
import { Link } from "@remix-run/react";
import  Explorecard from "../components/Explorecard.jsx";  
import "../assets/style/card.css";




function Dashboard() {


  return (
    <>
      <div className="dashboard-wrapper">
        <div className="dashboard-section-01 dashboard-item">
          <div className="dashboard-left">
            <div className="info-wrapper">
              <h2>
                Ds-App Dashboard – <br />
                Your Storefront, Your Style
              </h2>
              <p>
                Easily manage and customize your UI blocks. Select, configure,
                and preview extensions to enhance your store’s design and
                functionality—no coding needed. Start building a unique shopping
                experience with just a few clicks.
              </p>

              <div className="dashboard-btn">
                <Link to="/app/explore" className="dashboard-btn-custom">
                  Explore Blocks
                </Link>
              </div>
            </div>
          </div>
          <div className="dashboard-right">
            <div className="dshboard-image">
              <img
                src="https://cdn.shopify.com/s/files/1/0796/7847/2226/files/bg-remove-app-image.png?v=1749469415"
                alt="dashboard image"
              />
            </div>
          </div>
        </div>

        <div className="dashboard-section-02 dashboard-item">
          <div className="dahboard-blocks">
 
            <div className="blcoks-item">
              <div className="title-transpose">Total Available Blocks</div>
              <div className="block-info">11</div>
            </div>

              <div className="blcoks-item">
              <div className="title-transpose"> Free / Premium Blocks</div>
              <div className="block-info">11/0 </div>
            </div>

               <div className="blcoks-item">
              <div className="title-transpose"> Most Used Block</div>
              <div className="block-info">06</div>
            </div>

          </div>
        </div>

        {/* <div className="dashboard-section-5">
          <div className="dsh-announcement-alert">
            <p>We have added Progress bar ui , its available at explore section</p>
          </div>
        </div> */} 

        <div className="dashboard-section-03 dashboard-item dashboard-item-slider">
          <h2 className="dashboard-heading">Ds-App Dashboard - Blocks</h2>
          <div className="dashboard-item-slider-grid">
            <Explorecard limit="5" /> 
            </div> 
            <div className="dsh-btn">
              <Link to="/app/explore" >
                View All Blocks
              </Link>
            </div>
        </div>

        <div className="dashboard-section-04">
          <div className="dsh-announcement">
            <div className="announcement-item">
              <p><span>DS</span> <p className="bgg">Cart drawer progress bar has been added. Just enable it in the product page blocks.</p></p>
            </div>

            {/* <div className="announcement-item">
              <p><span>DS</span> <p className="bgg">We have added Progress bar ui , its available at explore section</p></p>
            </div> */}

          </div>
        </div> 


        

        
      
    </div>
    </>
  );
}

export default Dashboard;
