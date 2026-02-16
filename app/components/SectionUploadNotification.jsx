import React from 'react';
import { Modal, Text, Button, BlockStack } from '@shopify/polaris';

const SectionUploadNotification = ({ open, onClose, section, shopFull, themeId }) => {
  if (!open || !section) return null;

  const shopName = shopFull ? shopFull.split('.')[0] : '';
  const customizeUrl = shopFull && themeId 
    ? `https://${shopFull}/admin/themes/${themeId}/editor?context=sections&template=index`
    : null;

  const handleOpenCustomize = () => {
    if (customizeUrl) {
      window.open(customizeUrl, '_blank');
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="✅ Section Uploaded Successfully!"
      primaryAction={{
        content: 'Open Customize',
        onAction: handleOpenCustomize,
      }}
      secondaryActions={[
        {
          content: 'Close',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          <Text as="p" variant="bodyMd">
            The section <strong>"{section.title}"</strong> has been uploaded to your theme.
          </Text>
          
          <div style={{ 
            backgroundColor: '#F5F5F5', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #E0E0E0'
          }}>
            <Text as="p" variant="bodyMd" fontWeight="semibold" style={{ marginBottom: '8px' }}>
              Next Steps:
            </Text>
            <ol style={{ margin: 0, paddingLeft: '20px', color: '#6B7280' }}>
              <li style={{ marginBottom: '8px' }}>
                Click <strong>"Open Customize"</strong> to open the theme editor
              </li>
              <li style={{ marginBottom: '8px' }}>
                In the theme editor, click <strong>"Add section"</strong>
              </li>
              <li style={{ marginBottom: '8px' }}>
                Search for <strong>"{section.sectionName}"</strong> in the search box
              </li>
              <li>
                Click on the section to add it to your page
              </li>
            </ol>
          </div>

          {customizeUrl && (
            <Text as="p" variant="bodySm" tone="subdued">
              Or manually navigate to: <br />
              <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                {customizeUrl}
              </code>
            </Text>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

export default SectionUploadNotification;
