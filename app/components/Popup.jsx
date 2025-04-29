import React from "react";
import { Page, Grid, LegacyCard } from "@shopify/polaris";


const Popup = () => {
  // $(".Click-here").on('click', function() {
  //     $(".custom-model-main").addClass('model-open');
  //   });
  //   $(".close-btn, .bg-overlay").click(function(){
  //     $(".custom-model-main").removeClass('model-open');
  //   });

  return (
    
    <>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>

      <div class="custom-model-main  model-open">
        <div class="custom-model-inner">
          <div class="close-btn">×</div>
          <div class="custom-model-wrap">
            <div class="pop-up-content-wrap">
              <div className="popup-header">
                <p>Offer Section</p>
              </div>

              <div className="popup-container">
                <div className="popup-left">
                  <div className="image-carsuel">
                    <div className="img-carosel">
                      <div className="img-item">
                        {" "}
                        <img
                          src="https://d1xgiem9kow01r.cloudfront.net/ehqp0662v3cmo2wdbl37diwiez4e"
                          alt=""
                        />
                      </div>
                      <div className="img-item">
                        {" "}
                        <img
                          src="https://d1xgiem9kow01r.cloudfront.net/ehqp0662v3cmo2wdbl37diwiez4e"
                          alt=""
                        />
                      </div>
                      <div className="img-item">
                        {" "}
                        <img
                          src="https://d1xgiem9kow01r.cloudfront.net/ehqp0662v3cmo2wdbl37diwiez4e"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>

                  <div class="Polaris-TextContainer">
                    <div class="section-description-container">
                      <ul>
                        <li>
                          <strong>Slider Layout</strong>: Adjust number of
                          visible slides, spacing, and width
                        </li>
                        <li class="whitespace-normal break-words">
                          <strong>Colors</strong>: Change background, text,
                          button, and navigation colors
                        </li>
                        <li class="whitespace-normal break-words">
                          <strong>Button</strong>: Modify text, link, size, and
                          style of the "View All" button
                        </li>
                        <li class="whitespace-normal break-words">
                          <strong>Typography</strong>: Select custom fonts and
                          adjust sizes for all text elements
                        </li>
                        <li class="whitespace-normal break-words">
                          <strong>Spacing</strong>: Fine-tune padding and
                          margins for the entire section
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="popup-right">test</div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-overlay"></div>
      </div>
    </>
  );
};

export default Popup;
