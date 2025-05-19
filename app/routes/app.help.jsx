import React from 'react';
import Faq from '../components/Faq';
 
  const Help = () => {

    return(
        <>
   
        <div className="form-container">
     
            <div className="card-pattern"></div>
            <div className="form-title">
                <h3><i className="fas fa-headset"></i> Support Ticket Form</h3>
            </div>
          
            <form>
                <div className="mb-4">
                    <label for="email3" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email3" required />
                    <div className="form-text mt-2">We'll use this to contact you regarding your ticket.</div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <label for="product" className="form-label">Product</label>
                        <select className="form-select" id="product" required>
                            <option value="" selected disabled>Select a product</option>
                            <option value="product1">Offer Carosel Widgets</option>
                            <option value="product2">Whatsapp Button</option>
                            <option value="product3">Product Usp Images</option>
                            <option disabled value="product3">Comming soon.</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-4">
                        <label for="priority" className="form-label">Priority</label>
                        <select className="form-select" id="priority" required>
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>
                <div className="mb-4">
                    <label for="ticketSubject" className="form-label">Subject</label>
                    <input type="text" className="form-control" id="ticketSubject" required />
                </div>
                <div className="mb-4">
                    <label for="issueDetails" className="form-label">Issue Details</label>
                    <textarea className="form-control" id="issueDetails" rows="6" required placeholder="Please describe your issue in detail..."></textarea>
                </div>
                <div className="mb-4">
                    <label for="formFile" className="form-label">Attachments</label>
                    <input className="form-control" type="file" id="formFile" multiple />
                    <div className="form-text mt-2">Upload screenshots, logs, or other helpful files (max 5MB each).</div>
                </div>
                <button type="submit" className="btn btn-success">Submit Ticket <i className="fas fa-ticket-alt ms-1"></i></button>
            </form>
        </div>

        <Faq />

        </>
    )
}


export default Help;