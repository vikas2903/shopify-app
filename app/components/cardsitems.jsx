import React from 'react';

const CardItem = ({ shopFull, accessToken, keyy, shop, title, image, description, themeid, url }) => {
const code001 = `<div class="custom-section"><h2>Sample Section</h2></div>`;
 // Replace with your real section code

  const handleInstall = async () => {
    const sectionID = keyy; // Assuming keyy is the sectionID passed as prop
    const fileType = 'sections';
    const fileName = 'comparison-table'; // you can dynamically generate from sectionID too
    const filePath = `${fileType}/${fileName}.liquid`;

    alert("shopFull" + shopFull);
    alert("themeid" + themeid);
    alert("accessToken" + accessToken)

    if (sectionID === '001') {
      try {
        const response = await fetch(`https://${shopFull}/admin/api/2024-04/themes/${themeid}/assets.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
          },
          body: JSON.stringify({
            asset: {
              key: 'sections/comparison-table.liquid',
              value: code001,
            },
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(`✅ ${filePath} uploaded successfully!`);
        } else {
          console.error('Upload Error:', data);
          alert(`❌ Upload failed: ${JSON.stringify(data.errors || data)}`);
        }
      } catch (error) {
        console.error('Request Error:', error);
        alert('❌ An error occurred during upload.');
      }
    } else {
      alert(`⚠️ Section ID '${sectionID}' is not allowed.`);
    }
  };

  return (
    <div style={{
      borderRadius: '24px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      width: 'calc(100% - 40px)',
      margin: '20px',
      fontFamily: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', borderRadius: '20px', overflow: 'hidden', paddingTop: '15px' }}>
        <img
          src={image || 'https://cdn.shopify.com/s/files/1/0796/7847/2226/files/announcement-bar-removebg-preview.png?v=1754628891'}
          alt={title}
          style={{ width: '100%', objectFit: 'cover', borderRadius: '20px' }}
        />
      </div>

      <div style={{ width: '100%', padding: '10px 15px 15px' }}>
        <span style={{
          background: '#EAFBF2',
          color: '#3CB371',
          fontWeight: 500,
          fontSize: '13px',
          borderRadius: '8px',
          padding: '2px 12px',
          marginBottom: '8px',
          display: 'inline-block'
        }}>FREE</span>

        <div style={{ fontWeight: 600, fontSize: '1.18rem', margin: '10px 0 16px 0' }}>{title}</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => window.open(url, '_blank')} style={iconButtonStyle} aria-label="Preview">
              <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>

          <button onClick={handleInstall} style={installButtonStyle}>Install</button>
        </div>
      </div>
    </div>
  );
};

const iconButtonStyle = {
  background: '#F5F5F5',
  border: 'none',
  borderRadius: '50%',
  width: '38px',
  height: '38px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const installButtonStyle = {
  background: '#1976F6',
  color: '#fff',
  border: 'none',
  borderRadius: '24px',
  fontWeight: 600,
  fontSize: '1.1rem',
  padding: '10px 38px',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(25,118,246,0.08)',
};

export default CardItem;
