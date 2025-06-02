import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const Help = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();

    const emailParams = {
      email: formData.email,
      name: formData.name,
      message: formData.message,
      time: new Date().toLocaleString(),
    };

    const PUBLIC_KEY = 'XMsEZ-hlGcph6hZ_b';
    const SERVICE_ID = 'service_l6nwykh';
    const TEMPLATE_ID = 'template_shkdbn5';

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, emailParams, PUBLIC_KEY)
      .then(() => {
        alert('Ticket submitted successfully!');
        setFormData({ email: '', name: '', message: '' });
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to send ticket. Please try again.');
      });
  };

  return (
    <> 
    <div className='Polaris-Page Polaris-Page--fullWidth'>
      <h1>Help</h1>
    <div className="form-container">
      
      <div className="form-title">
        <h3><i className="fas fa-headset"></i> Support Ticket Form</h3>
      </div>

      <form onSubmit={sendEmail}>
        <div className="mb-4">
          <label htmlFor="email3" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email3"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ticketSubject" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="ticketSubject"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="issueDetails" className="form-label">Issue Details</label>
          <textarea
            className="form-control"
            id="issueDetails"
            name="message"
            rows="6"
            placeholder="Please describe your issue in detail. If needed, share video or screenshot links (Google Drive, Loom, etc.)"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-success">
          Submit Ticket <i className="fas fa-ticket-alt ms-1"></i>
        </button>
      </form>
    </div>
    </div>
    </>
  );
};

export default Help;
