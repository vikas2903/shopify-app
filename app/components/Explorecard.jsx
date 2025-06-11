import React from "react";
import {ExploreContext} from "../context/Explorecontext.jsx";
import {useContext} from "react";
import Popup from '../components/Popup.jsx';

function Explorecard() {
  const {exploreData, setShowPopup, setSelectedId} = useContext(ExploreContext);

  if (!exploreData || !Array.isArray(exploreData)) {
    return <div>No data available</div>;
  }

  function popupvisible(id) {
    if (id) {
      setSelectedId(id);
      setShowPopup(true);
    }
  }

  const loveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" fill="none"><path fill="#000000" fill-rule="evenodd" d="M8 3.517a1 1 0 011.62-.784l5.348 4.233a1 1 0 010 1.568l-5.347 4.233A1 1 0 018 11.983v-1.545c-.76-.043-1.484.003-2.254.218-.994.279-2.118.857-3.506 1.99a.993.993 0 01-1.129.096.962.962 0 01-.445-1.099c.415-1.5 1.425-3.141 2.808-4.412C4.69 6.114 6.244 5.241 8 5.042V3.517zm1.5 1.034v1.2a.75.75 0 01-.75.75c-1.586 0-3.066.738-4.261 1.835a8.996 8.996 0 00-1.635 2.014c.878-.552 1.695-.916 2.488-1.138 1.247-.35 2.377-.33 3.49-.207a.75.75 0 01.668.745v1.2l4.042-3.2L9.5 4.55z" clip-rule="evenodd"/></svg>`;
  const eye = `<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="16px" height="16px" viewBox="0 0 24 24">

<g data-name="Layer 2">

<g data-name="eye">

<rect width="24" height="24" opacity="0"/>

<circle cx="12" cy="12" r="1.5"/>

<path d="M21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 0 0 0-1zm-9.87 4a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5z"/>
 
</g>

</g>

</svg>`;
  return (
    <>
    
      {exploreData.map((item) => (
        <div
          className="explore-card"
          key={item.id}
         
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              popupvisible(item.id);
            }
          }}
        >
          <div className="img">
            <img src={item.image} alt={item.title} />

            <div className="img-title">
       
             
            </div>

            <div className="img-bottom">
              <div className="imgb-l">
               
                <span>{item.title}</span>
                <span className="cta-image">
                  {/* <span className="svg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g id="eye"><circle r="256" fill="#0063ff" cy="256" cx="256"/><path d="m512 256c0 141.38-114.62 256-256 256a255.52 255.52 0 0 1 -200-96.17h4.59c180.12 0 326.14-146 326.14-326.14a327.19 327.19 0 0 0 -4.91-56.69 255.9 255.9 0 0 1 130.18 223z" fill="#005add" opacity=".7"/><path d="m254.79 322.71a256 256 0 0 1 -153.27-51 6.29 6.29 0 0 1 .09-10.11l2-1.47a256.28 256.28 0 0 1 304.39 1.46 6.29 6.29 0 0 1 0 10.07 256 256 0 0 1 -153.21 51.05zm-138.72-56a240.16 240.16 0 0 0 128.81 43.29 44.1 44.1 0 0 1 3.12-86.57 243.34 243.34 0 0 0 -131.93 43.26zm145.54-43.27a44.1 44.1 0 0 1 3.09 86.56 240.15 240.15 0 0 0 128.83-43.28 243.27 243.27 0 0 0 -131.92-43.3zm-6.82 12.05a31.52 31.52 0 1 0 31.52 31.51 31.56 31.56 0 0 0 -31.52-31.53zm151.9 3.66a6.32 6.32 0 0 1 -2.8-.65c-49-24.42-99.91-36.8-151.22-36.8a309.83 309.83 0 0 0 -58.67 5.56c-52.15 10.11-84.94 30.68-85.26 30.88a6.28 6.28 0 0 1 -6.78-10.58c.6-.39 60.77-38.28 151.81-38.28 52.81 0 105.22 12.77 155.77 37.94a6.28 6.28 0 0 1 -2.8 11.91z" fill="#fff"/></g></g></g></svg></span>
                  <span className="svg"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 512 512" data-name="Layer 1"><path style={{fill: '#0061ff'}} d="m255.747.442c141.384 0 256.007 114.587 256.007 255.958s-114.623 256.04-256.007 256.04-255.999-114.658-255.999-256.04 114.623-255.958 255.999-255.958zm0 185.686a14.038 14.038 0 1 0 -14.036-14.039 14.053 14.053 0 0 0 14.036 14.039zm0-43.076a29.038 29.038 0 1 0 29.037 29.037 29.068 29.068 0 0 0 -29.037-29.037zm14.04 197.741v-104.932a14.038 14.038 0 1 0 -28.076 0v104.932a14.038 14.038 0 1 0 28.076 0zm-14.04-133.971a29.069 29.069 0 0 0 -29.036 29.039v104.932a29.037 29.037 0 1 0 58.073 0v-104.932a29.069 29.069 0 0 0 -29.037-29.039zm0 194.621c79.958 0 145-65.046 145-145s-65.043-145-145-145-145 65.048-145 145 65.046 145 145 145zm0-305c-88.224 0-160 71.777-160 160s71.774 160 160 160 160-71.774 160-160-71.773-160.002-159.998-160.002z" fill="#2196f3" fill-rule="evenodd"/></svg></span>
                  <span className="svg"><svg xmlns="http://www.w3.org/2000/svg" height="512" viewBox="0 0 512 512" width="512"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g id="_19" data-name="19"><circle cx="256" cy="256" fill="#008fcc" r="256"/><path d="m273.5 326.14h-35.27v-52.09h-52.37v-35.82h52.37v-52.37h35.27v52.37h52.64v35.82h-52.64z" fill="#fff"/></g></g></g></svg></span>
                   */}
                  <span onClick={() => popupvisible(item.id)} className="unicode">&#x1F441;</span>
                  <span onClick={()=>{ window.open(`https://d2c-apps.myshopify.com/`, '_blank');}} className="unicode">&#x2139;</span>
                  <span onClick={() =>{window.open(`https://d2c-apps.myshopify.com/admin/themes/173246185506/editor?context=sections&template=product`, '_blank');}} className="unicode">+</span></span>
              </div>
              {/* <div className="imgb-r"> 
                <div className="svg-wrapper-imgb-r"></div>
              </div> */}
            </div>
          </div>
        </div>
      ))}
      <Popup />
    </>
  );
}

export default Explorecard;
