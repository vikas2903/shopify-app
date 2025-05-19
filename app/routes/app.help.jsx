import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const Help = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    message: '',
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    let base64File = null;
    if (file) {
      base64File = await convertFileToBase64(file);
    }

    const emailParams = {
      email: formData.email,
      name: formData.name,
      message: formData.message,
      time: new Date().toLocaleString(),
      attachment: base64File, // Required by EmailJS for sending files
    };

    const PUBLIC_KEY = 'XMsEZ-hlGcph6hZ_b';
    const SERVICE_ID = 'service_l6nwykh';
    const TEMPLATE_ID = 'template_shkdbn5';

    emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams, PUBLIC_KEY)
      .then(() => {
        alert('Ticket submitted successfully!');
        setFormData({ email: '', name: '', message: '' });
        setFile(null);
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to send ticket. Please try again.');
      });
  };

  return (
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
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="formFile" className="form-label">Attachments</label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={handleFileChange}
          />
          <div className="form-text mt-2">
            Upload screenshots, logs, or other helpful files (max 5MB each).
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          Submit Ticket <i className="fas fa-ticket-alt ms-1"></i>
        </button>
      </form>
    </div>
  );
};

export default Help;
