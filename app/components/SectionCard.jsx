import React, { useState } from 'react';
import { Button, Card, Banner } from '@shopify/polaris';
import { ExternalIcon } from '@shopify/polaris-icons';

const SectionCard = ({ section, shopFull, themeId, accessToken, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleUpload = async () => {
    if (!shopFull || !themeId || !accessToken) {
      alert('⚠️ Missing shop information. Please refresh the page.');
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const fileName = `${section.sectionName}.liquid`;
      const filePath = `sections/${fileName}`;

      const response = await fetch(
        `https://${shopFull}/admin/api/2024-07/themes/${themeId}/assets.json`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
          },
          body: JSON.stringify({
            asset: {
              key: filePath,
              value: section.liquidCode,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUploadStatus('success');
        setIsUploading(false);
        
        // Call success callback to show notification
        if (onUploadSuccess) {
          onUploadSuccess(section);
        }
      } else {
        console.error('Upload Error:', data);
        setUploadStatus('error');
        setIsUploading(false);
        alert(`❌ Upload failed: ${JSON.stringify(data.errors || data)}`);
      }
    } catch (error) {
      console.error('Request Error:', error);
      setUploadStatus('error');
      setIsUploading(false);
      alert('❌ An error occurred during upload.');
    }
  };

  const openCustomize = () => {
    const shopName = shopFull.split('.')[0];
    const customizeUrl = `https://${shopFull}/admin/themes/${themeId}/editor?context=sections&template=index`;
    window.open(customizeUrl, '_blank');
  };

  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden' }}>
          <img
            src={section.image}
            alt={section.title}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            {section.title}
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>
            {section.description}
          </p>
        </div>

        {uploadStatus === 'success' && (
          <Banner status="success" onDismiss={() => setUploadStatus(null)} style={{ marginBottom: '12px' }}>
            <p>✅ Section uploaded successfully!</p>
          </Banner>
        )}

        {uploadStatus === 'error' && (
          <Banner status="critical" onDismiss={() => setUploadStatus(null)} style={{ marginBottom: '12px' }}>
            <p>❌ Upload failed. Please try again.</p>
          </Banner>
        )}

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            primary
            onClick={handleUpload}
            loading={isUploading}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Section'}
          </Button>
          
          {uploadStatus === 'success' && (
            <Button
              onClick={openCustomize}
              icon={ExternalIcon}
            >
              Open Customize
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SectionCard;
