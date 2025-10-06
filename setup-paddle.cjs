#!/usr/bin/env node

const https = require('https');

const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
// Auto-detect environment from API key prefix
const isLiveKey = PADDLE_API_KEY?.startsWith('pdl_live_');
const PADDLE_ENVIRONMENT = isLiveKey ? 'production' : 'sandbox';
const BASE_URL = PADDLE_ENVIRONMENT === 'production' 
  ? 'https://api.paddle.com'
  : 'https://sandbox-api.paddle.com';

console.log(`🔑 Using ${PADDLE_ENVIRONMENT} environment (detected from API key)`);

async function paddleRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function listProducts() {
  console.log('📦 Fetching existing products...\n');
  const response = await paddleRequest('/products');
  return response.data || [];
}

async function listPrices(productId) {
  const response = await paddleRequest(`/prices?product_id=${productId}`);
  return response.data || [];
}

async function createProduct(name, description) {
  console.log(`🆕 Creating product: ${name}...`);
  const response = await paddleRequest('/products', 'POST', {
    name,
    description,
    tax_category: 'standard'
  });
  console.log(`✅ Created product: ${response.data.id}\n`);
  return response.data;
}

async function createPrice(productId, amount, interval) {
  console.log(`💰 Creating price: $${amount}/${interval}...`);
  const response = await paddleRequest('/prices', 'POST', {
    product_id: productId,
    description: `${interval}ly subscription`,
    billing_cycle: {
      interval,
      frequency: 1
    },
    unit_price: {
      amount: (amount * 100).toString(), // Convert to cents
      currency_code: 'USD'
    }
  });
  console.log(`✅ Created price: ${response.data.id}\n`);
  return response.data;
}

async function main() {
  try {
    console.log(`🚀 Setting up Paddle products (${PADDLE_ENVIRONMENT})\n`);
    console.log('═══════════════════════════════════════════════\n');

    // List existing products
    const products = await listProducts();
    
    // Check for existing Mystic and Ascended products
    let mysticProduct = products.find(p => p.name === 'Mystic Plan');
    let ascendedProduct = products.find(p => p.name === 'Ascended Plan');

    // Create Mystic product if needed
    if (!mysticProduct) {
      mysticProduct = await createProduct(
        'Mystic Plan',
        'Enhanced spiritual features with 100 energy points per month and priority oracle readings'
      );
    } else {
      console.log(`✓ Mystic product exists: ${mysticProduct.id}\n`);
    }

    // Create Ascended product if needed
    if (!ascendedProduct) {
      ascendedProduct = await createProduct(
        'Ascended Plan',
        'Premium spiritual experience with unlimited energy, advanced oracle features, and exclusive content'
      );
    } else {
      console.log(`✓ Ascended product exists: ${ascendedProduct.id}\n`);
    }

    // Get prices for each product
    const mysticPrices = await listPrices(mysticProduct.id);
    const ascendedPrices = await listPrices(ascendedProduct.id);

    // Create Mystic monthly price if needed
    let mysticMonthlyPrice = mysticPrices.find(p => 
      p.billing_cycle?.interval === 'month' && 
      p.unit_price?.amount === '1200'
    );
    
    if (!mysticMonthlyPrice) {
      mysticMonthlyPrice = await createPrice(mysticProduct.id, 12, 'month');
    } else {
      console.log(`✓ Mystic monthly price exists: ${mysticMonthlyPrice.id}\n`);
    }

    // Create Ascended monthly price if needed
    let ascendedMonthlyPrice = ascendedPrices.find(p => 
      p.billing_cycle?.interval === 'month' && 
      p.unit_price?.amount === '2400'
    );
    
    if (!ascendedMonthlyPrice) {
      ascendedMonthlyPrice = await createPrice(ascendedProduct.id, 24, 'month');
    } else {
      console.log(`✓ Ascended monthly price exists: ${ascendedMonthlyPrice.id}\n`);
    }

    console.log('═══════════════════════════════════════════════\n');
    console.log('✨ CONFIGURATION COMPLETE\n');
    console.log('Add these environment variables to your Replit Secrets:\n');
    console.log(`PADDLE_PRICE_ID_MYSTIC=${mysticMonthlyPrice.id}`);
    console.log(`PADDLE_PRICE_ID_ASCENDED=${ascendedMonthlyPrice.id}`);
    console.log('\n═══════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
