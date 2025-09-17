import express from 'express';
import { builder } from '@builder.io/sdk';

// Initialize Builder.io with API key
builder.init(process.env.BUILDER_API_KEY!);

export const builderRoutes = express.Router();

// Builder.io webhook endpoint for content updates
builderRoutes.post('/webhook', async (req, res) => {
  try {
    // Handle Builder.io content updates
    const { data } = req.body;
    console.log('📝 Builder.io content updated:', data);
    
    // You can add custom logic here to handle content updates
    // For example, clearing cache, triggering builds, etc.
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Builder.io webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Builder.io preview endpoint
builderRoutes.get('/preview', (req, res) => {
  const { model, url } = req.query;
  
  // Return preview configuration for Builder.io
  res.json({
    success: true,
    model,
    url,
    previewUrl: `http://localhost:5000${url || '/'}`,
    editUrl: `https://builder.io/content/${model}`
  });
});

// Builder.io model endpoints
builderRoutes.get('/models', (req, res) => {
  res.json({
    models: [
      {
        name: 'page',
        type: 'page',
        urlPath: '/',
        schema: [
          { name: 'title', type: 'string', required: true },
          { name: 'description', type: 'text', required: false },
          { name: 'content', type: 'blocks', required: false }
        ]
      },
      {
        name: 'component',
        type: 'component',
        schema: [
          { name: 'name', type: 'string', required: true },
          { name: 'props', type: 'object', required: false }
        ]
      }
    ]
  });
});

// Builder.io content API proxy
builderRoutes.get('/content/:model', async (req, res) => {
  try {
    const { model } = req.params;
    const { url } = req.query;
    
    const content = await builder.get(model, {
      url: url as string || '/',
      // Add any additional options here
    }).promise();
    
    res.json(content);
  } catch (error) {
    console.error(`❌ Error fetching Builder content for model ${req.params.model}:`, error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

export default builderRoutes;