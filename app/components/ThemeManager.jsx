import React, { useState, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import {
  Card,
  Button,
  Text,
  Banner,
  Spinner,
  Modal,
  TextField,
  Select,
  List,
  Badge,
  Layout,
  BlockStack,
  InlineStack
} from '@shopify/polaris';

const ThemeManager = ({ themeId, shop }) => {
  const fetcher = useFetcher();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetContent, setAssetContent] = useState('');
  const [assetKey, setAssetKey] = useState('');
  const [operation, setOperation] = useState('');

  const handleOperation = (op, data = {}) => {
    const formData = new FormData();
    formData.append('operation', op);
    formData.append('themeId', themeId);
    
    // Add additional data based on operation
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    fetcher.submit(formData, { method: 'post' });
  };

  const openModal = (type, asset = null) => {
    setModalType(type);
    setShowModal(true);
    
    if (asset) {
      setSelectedAsset(asset);
      setAssetKey(asset.key);
      setAssetContent(asset.value || '');
    } else {
      setSelectedAsset(null);
      setAssetKey('');
      setAssetContent('');
    }
  };

  const handleModalSubmit = () => {
    const data = {
      assetKey,
      content: assetContent
    };
    
    handleOperation(modalType, data);
    setShowModal(false);
  };

  const getAssetType = (key) => {
    if (key.endsWith('.liquid')) return 'Liquid Template';
    if (key.endsWith('.css')) return 'Stylesheet';
    if (key.endsWith('.js')) return 'JavaScript';
    if (key.endsWith('.json')) return 'JSON';
    if (key.includes('sections/')) return 'Section';
    if (key.includes('snippets/')) return 'Snippet';
    if (key.includes('templates/')) return 'Template';
    return 'Asset';
  };

  const getAssetIcon = (key) => {
    if (key.endsWith('.liquid')) return '📄';
    if (key.endsWith('.css')) return '🎨';
    if (key.endsWith('.js')) return '⚡';
    if (key.endsWith('.json')) return '📋';
    if (key.includes('sections/')) return '🧩';
    if (key.includes('snippets/')) return '📝';
    if (key.includes('templates/')) return '📋';
    return '📁';
  };

  return (
    <BlockStack gap="500">
      <Card>
        <div style={{ padding: '16px' }}>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h3">Theme Operations</Text>
            <Text variant="bodyMd" as="p" color="subdued">
              Manage your theme assets and sections
            </Text>
          </BlockStack>
        </div>
      </Card>

      <Card>
        <div style={{ padding: '16px' }}>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h4">Quick Actions</Text>
            <Layout>
              <Layout.Section oneThird>
                <Button
                  onClick={() => handleOperation('get_sections')}
                  loading={fetcher.state === 'submitting'}
                  fullWidth
                >
                  Get Sections
                </Button>
              </Layout.Section>
              <Layout.Section oneThird>
                <Button
                  onClick={() => openModal('create_asset')}
                  variant="primary"
                  fullWidth
                >
                  Create Asset
                </Button>
              </Layout.Section>
              <Layout.Section oneThird>
                <Button
                  onClick={() => handleOperation('get_asset', { assetKey: 'layout/theme.liquid' })}
                  fullWidth
                >
                  View Layout
                </Button>
              </Layout.Section>
            </Layout>
          </BlockStack>
        </div>
      </Card>

      {/* Display Results */}
      {fetcher.data && (
        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h4">Results</Text>
              
              {fetcher.data.success ? (
                <Banner status="success" title="Operation Successful">
                  <p>{fetcher.data.message || 'Operation completed successfully'}</p>
                </Banner>
              ) : (
                <Banner status="critical" title="Operation Failed">
                  <p>{fetcher.data.error || 'An error occurred'}</p>
                </Banner>
              )}

              {/* Display Assets */}
              {fetcher.data.assets && (
                <div style={{ marginTop: '16px' }}>
                  <Text variant="headingSm" as="h5">Theme Assets</Text>
                  <List type="bullet">
                    {fetcher.data.assets.map((asset, index) => (
                      <List.Item key={index}>
                        <InlineStack align="center" gap="200">
                          <Text variant="bodyMd">{getAssetIcon(asset.key)} {asset.key}</Text>
                          <Badge status="info">{getAssetType(asset.key)}</Badge>
                          <Button
                            size="slim"
                            onClick={() => openModal('update_asset', asset)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="slim"
                            variant="plain"
                            onClick={() => handleOperation('delete_asset', { assetKey: asset.key })}
                          >
                            Delete
                          </Button>
                        </InlineStack>
                      </List.Item>
                    ))}
                  </List>
                </div>
              )}

              {/* Display Sections */}
              {fetcher.data.sections && (
                <div style={{ marginTop: '16px' }}>
                  <Text variant="headingSm" as="h5">Theme Sections</Text>
                  <List type="bullet">
                    {fetcher.data.sections.map((section, index) => (
                      <List.Item key={index}>
                        <InlineStack align="center" gap="200">
                          <Text variant="bodyMd">🧩 {section.key}</Text>
                          <Badge status="success">Section</Badge>
                          <Button
                            size="slim"
                            onClick={() => openModal('update_asset', section)}
                          >
                            Edit
                          </Button>
                        </InlineStack>
                      </List.Item>
                    ))}
                  </List>
                </div>
              )}

              {/* Display Single Asset */}
              {fetcher.data.asset && (
                <div style={{ marginTop: '16px' }}>
                  <Text variant="headingSm" as="h5">Asset Content</Text>
                  <div style={{ 
                    backgroundColor: '#f6f6f7', 
                    padding: '12px', 
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}>
                    <pre>{fetcher.data.asset.value}</pre>
                  </div>
                </div>
              )}
            </BlockStack>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {fetcher.state === 'submitting' && (
        <Card>
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <InlineStack align="center" gap="200">
              <Spinner size="small" />
              <Text variant="bodyMd">Processing...</Text>
            </InlineStack>
          </div>
        </Card>
      )}

      {/* Modal for Asset Operations */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'create_asset' ? 'Create New Asset' : 'Edit Asset'}
        primaryAction={{
          content: modalType === 'create_asset' ? 'Create' : 'Update',
          onAction: handleModalSubmit,
          loading: fetcher.state === 'submitting'
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setShowModal(false)
          }
        ]}
      >
        <Modal.Section>
          <BlockStack gap="200">
            <TextField
              label="Asset Key"
              value={assetKey}
              onChange={setAssetKey}
              placeholder="e.g., sections/announcement-bar.liquid"
              helpText="The path and filename for the asset"
            />
            <TextField
              label="Content"
              value={assetContent}
              onChange={setAssetContent}
              multiline={10}
              placeholder="Enter the asset content here..."
              helpText="The content of the asset (Liquid, CSS, JS, etc.)"
            />
          </BlockStack>
        </Modal.Section>
      </Modal>
    </BlockStack>
  );
};

export default ThemeManager;