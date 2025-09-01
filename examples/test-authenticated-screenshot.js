// Example usage of authenticated browser automation
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/browserless/auth';

// Example 1: Take authenticated screenshot of dashboard
async function screenshotDashboard() {
  try {
    const response = await axios.post(`${API_BASE}/screenshot`, {
      path: '/',
      options: {
        viewport: { width: 1920, height: 1080 },
        bypassAuth: true
      }
    });

    if (response.data.success) {
      console.log('✅ Dashboard screenshot captured');
      console.log(`👤 Authenticated as: ${response.data.data.metadata.user.name}`);
      
      // Save screenshot (you could save this to file)
      const screenshotData = response.data.data.screenshot;
      console.log(`📸 Screenshot size: ${screenshotData.length} characters`);
    }
  } catch (error) {
    console.error('❌ Screenshot failed:', error.response?.data || error.message);
  }
}

// Example 2: Test user flow - login and navigate
async function testUserJourney() {
  try {
    const response = await axios.post(`${API_BASE}/test-flow`, {
      steps: [
        { action: 'goto', path: '/' },
        { action: 'wait', timeout: 2000 },
        { action: 'screenshot' },
        { action: 'goto', path: '/oracle' },
        { action: 'wait', timeout: 2000 },
        { action: 'screenshot' },
        { action: 'goto', path: '/starmap' },
        { action: 'wait', timeout: 2000 },
        { action: 'screenshot' }
      ],
      options: {
        viewport: { width: 1200, height: 800 }
      }
    });

    if (response.data.success) {
      console.log('✅ User journey completed');
      console.log(`📊 Steps: ${response.data.data.logs.length}`);
      console.log(`📸 Screenshots: ${response.data.data.screenshots.length}`);
      response.data.data.logs.forEach(log => console.log(`   ${log}`));
    }
  } catch (error) {
    console.error('❌ User journey failed:', error.response?.data || error.message);
  }
}

// Example 3: Generate PDF report
async function generateReport() {
  try {
    const response = await axios.post(`${API_BASE}/pdf`, {
      path: '/oracle',
      options: {
        viewport: { width: 1920, height: 1080 }
      }
    });

    if (response.data.success) {
      console.log('✅ PDF report generated');
      console.log(`📄 PDF size: ${response.data.data.pdf.length} characters`);
    }
  } catch (error) {
    console.error('❌ PDF generation failed:', error.response?.data || error.message);
  }
}

// Example 4: Scrape user data
async function scrapeUserData() {
  try {
    const response = await axios.post(`${API_BASE}/scrape`, {
      path: '/profile/25531750',
      selectors: [
        '[data-testid="user-name"]',
        '[data-testid="energy-display"]',
        '[data-testid="aura-level"]'
      ]
    });

    if (response.data.success) {
      console.log('✅ User data scraped');
      console.log('📊 Scraped data:', response.data.data.data);
    }
  } catch (error) {
    console.error('❌ Scraping failed:', error.response?.data || error.message);
  }
}

// Run examples
console.log('🧪 Testing authenticated browser automation...\n');

screenshotDashboard()
  .then(() => testUserJourney())
  .then(() => generateReport())
  .then(() => scrapeUserData())
  .then(() => console.log('\n🎉 All examples completed!'));