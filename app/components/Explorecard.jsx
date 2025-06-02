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
          onClick={() => popupvisible(item.id)}
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
       
              <div className="imgt-r">
                <div className="svg-wrapper"> 
                  <span onClick={() => popupvisible(item.id)} dangerouslySetInnerHTML={{ __html: loveSvg }} />
                  <span dangerouslySetInnerHTML={{ __html: eye }} />
                </div>
              </div>
            </div>

            <div className="img-bottom">
              <div className="imgb-l">
               
                <span>{item.title}</span>
                <span>Free</span>
              </div>
              <div className="imgb-r">
                <div className="svg-wrapper-imgb-r"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Popup />
    </>
  );
}

export default Explorecard;
