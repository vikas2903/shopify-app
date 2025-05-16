import React from 'react';
import '../assets/style/popup.css';
import {Link} from 'react-router-dom';
import {ExploreContext} from '../context/Explorecontext.jsx';
import { useContext } from 'react';

function Popup() {
    const {showPopup, setShowPopup, exploreData, selectedId } = useContext(ExploreContext);

  
 const item = exploreData.find((item) => item.id === selectedId);

const eye = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" height="30" viewBox="0 0 312 312" width="30"><clipPath id="clip0_16_18"><path d="m0 0h312v312h-312z"/></clipPath><g clip-path="url(#clip0_16_18)"><rect fill="#000" height="312" rx="80" width="312"/><path d="m156.296 107.548c-4.779-.17-8.619-1.621-11.52-4.352-2.901-2.73-4.352-6.5705-4.352-11.5198.171-5.2907 1.963-9.5573 5.376-12.8 3.413-3.4133 7.765-5.0347 13.056-4.864 4.949.1707 8.789 1.6213 11.52 4.352 2.901 2.7307 4.267 6.5707 4.096 11.52-.171 5.12-1.877 9.3867-5.12 12.7998-3.243 3.243-7.595 4.864-13.056 4.864zm.256 129.792c-5.12 0-9.131-1.365-12.032-4.096-2.901-2.901-4.352-7.765-4.352-14.592 0-3.925.341-7.765 1.024-11.52.853-3.754 1.792-7.424 2.816-11.008 1.195-3.754 2.133-7.594 2.816-11.52.853-3.925 1.28-8.106 1.28-12.544 0-3.072-.427-5.973-1.28-8.704-.853-2.901-2.731-5.034-5.632-6.4-2.219-1.194-4.181-2.389-5.888-3.584-1.536-1.365-2.304-3.072-2.304-5.12 0-2.389 1.109-4.949 3.328-7.68 2.219-2.73 5.12-5.034 8.704-6.912 3.755-2.048 7.595-3.072 11.52-3.072 4.267 0 7.339 1.11 9.216 3.328 2.048 2.219 3.413 5.035 4.096 8.448.683 3.414 1.024 6.912 1.024 10.496 0 5.462-.427 10.838-1.28 16.128-.853 5.12-1.707 9.899-2.56 14.336-.683 3.243-1.195 6.23-1.536 8.96-.341 2.731-.512 5.291-.512 7.68 0 4.267 1.024 7.51 3.072 9.728 2.048 2.048 4.949 4.011 8.704 5.888 1.536.854 2.304 2.134 2.304 3.84 0 1.366-.683 3.499-2.048 6.4-1.365 2.902-3.755 5.547-7.168 7.936-3.243 2.39-7.68 3.584-13.312 3.584z" fill="#fff"/></g></svg>`;
const plus = `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_20" width="30" height="30" enable-background="new 0 0 2000 2000" viewBox="0 0 2000 2000"><path d="m1416.667 0h-833.334c-322.164 0-583.333 261.165-583.333 583.333v833.333c0 322.165 261.169 583.334 583.333 583.334h833.334c322.164 0 583.333-261.169 583.333-583.333v-833.334c0-322.168-261.169-583.333-583.333-583.333zm6.551 1083.333h-339.884v339.885c0 46.02-37.313 83.333-83.334 83.333s-83.333-37.313-83.333-83.333v-339.885h-339.884c-46.021 0-83.334-37.313-83.334-83.333s37.313-83.333 83.334-83.333h339.884v-339.885c0-46.02 37.313-83.333 83.333-83.333s83.334 37.313 83.334 83.333v339.885h339.884c46.02 0 83.333 37.313 83.333 83.333s-37.313 83.333-83.333 83.333z"/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>`;  
const close = `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_19"  width="30" height="30" enable-background="new 0 0 2000 2000" viewBox="0 0 2000 2000"><path d="m1416.667 0h-833.334c-322.163 0-583.333 261.165-583.333 583.333v833.333c0 322.165 261.17 583.334 583.333 583.334h833.334c322.164 0 583.333-261.169 583.333-583.333v-833.334c0-322.168-261.169-583.333-583.333-583.333zm-58.482 1240.331c32.542 32.542 32.542 85.312 0 117.854-32.542 32.541-85.307 32.541-117.849 0l-240.336-240.336-240.336 240.337c-32.542 32.541-85.307 32.541-117.849 0-32.542-32.542-32.542-85.312 0-117.854l240.336-240.332-240.335-240.336c-32.542-32.542-32.542-85.312 0-117.849 32.542-32.541 85.307-32.541 117.849 0l240.335 240.336 240.337-240.336c32.541-32.541 85.306-32.541 117.849 0 32.542 32.537 32.542 85.307 0 117.849l-240.337 240.336z"/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>`; 
  return (
    
   <>
   {showPopup && (

   

    <div className="popip-container" jsonData={selectedId}>
        <div className="popup-close" onClick={() => setShowPopup(false)} ><Link to="#"><span dangerouslySetInnerHTML={{__html: close}} /></Link> </div>
        <div className="popup-wrapper">
            <div className="popup-header">
                <div className="pop-header-wrapper">
                    <div className="pop-title">{item.title}</div>
                    <div className="pop-btn"> <Link to="https://d2c-apps.myshopify.com/"><span dangerouslySetInnerHTML={{__html: eye}} /></Link> <Link to="/"><span dangerouslySetInnerHTML={{__html: plus}} /></Link></div>
                </div>
            </div>
            <div className="popupbody">
                <div className="youtube-video">
                    {
                        item.youtube ? <span dangerouslySetInnerHTML={{__html: item.youtube}} />: <img src={item.image} alt="" width="100%" height="100%" />
                    }
                   
                </div>

                <div className="pop-content">
                    <span  dangerouslySetInnerHTML={{__html:item.popupcontent}} />
                </div>
            </div>
        </div>
    </div>


    )}
   </>
  )
}

export default Popup