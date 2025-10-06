#!/usr/bin/env node

const https = require('https');

const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY;
const BASE_URL = 'https://api.revenuecat.com/v1';

async function revenuecatRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Platform': 'stripe' // RevenueCat uses this even for Paddle integrations
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
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

async function listOfferings() {
  console.log('📦 Fetching RevenueCat offerings...\n');
  const response = await revenuecatRequest('/offerings');
  return response.offerings || [];
}

async function listProducts() {
  console.log('📦 Fetching RevenueCat products...\n');
  const response = await revenuecatRequest('/products');
  return response.products || [];
}

async function createOffering(identifier, metadata) {
  console.log(`🆕 Creating offering: ${identifier}...`);
  const response = await revenuecatRequest('/offerings', 'POST', {
    identifier,
    metadata
  });
  console.log(`✅ Created offering: ${response.offering.id}\n`);
  return response.offering;
}

async function main() {
  try {
    console.log('🚀 Setting up RevenueCat products for Paddle\n');
    console.log('═══════════════════════════════════════════════\n');

    // List existing products and offerings
    try {
      const products = await listProducts();
      console.log('Products found:', JSON.stringify(products, null, 2));
    } catch (e) {
      console.log('Note: Could not fetch products:', e.message);
    }

    const offerings = await listOfferings();
    console.log('\nOfferings found:', JSON.stringify(offerings, null, 2));

    // Look for Mystic and Ascended offerings
    const mysticOffering = offerings.find(o => 
      o.identifier?.toLowerCase().includes('mystic') || 
      o.display_name?.toLowerCase().includes('mystic')
    );
    
    const ascendedOffering = offerings.find(o => 
      o.identifier?.toLowerCase().includes('ascended') || 
      o.display_name?.toLowerCase().includes('ascended')
    );

    console.log('\n═══════════════════════════════════════════════\n');
    
    if (mysticOffering || ascendedOffering) {
      console.log('✨ FOUND EXISTING OFFERINGS\n');
      
      if (mysticOffering) {
        console.log('Mystic Offering:');
        console.log(JSON.stringify(mysticOffering, null, 2));
      }
      
      if (ascendedOffering) {
        console.log('\nAscended Offering:');
        console.log(JSON.stringify(ascendedOffering, null, 2));
      }
    } else {
      console.log('⚠️  No Mystic or Ascended offerings found in RevenueCat');
      console.log('\nPlease configure your products in the RevenueCat dashboard:');
      console.log('1. Go to https://app.revenuecat.com/');
      console.log('2. Navigate to your app');
      console.log('3. Go to Products section');
      console.log('4. Add your Paddle products (Mystic $12/month, Ascended $24/month)');
      console.log('5. Copy the Paddle price IDs from the product configuration');
    }

    console.log('\n═══════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nMake sure your REVENUECAT_API_KEY is correct and has proper permissions.');
    process.exit(1);
  }
}

main();
