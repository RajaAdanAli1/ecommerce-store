const https = require('https');
const http = require('http');

console.log('🔍 Checking your current IP addresses...\n');

// Function to get IP from a service
const getIP = (url, isHTTPS = true) => {
  return new Promise((resolve, reject) => {
    const client = isHTTPS ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const ip = data.trim();
          resolve(ip);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
};

// Check multiple IP services
const checkIPs = async () => {
  const services = [
    { name: 'ipinfo.io', url: 'https://ipinfo.io/ip' },
    { name: 'httpbin.org', url: 'https://httpbin.org/ip' },
    { name: 'icanhazip.com', url: 'https://icanhazip.com' },
    { name: 'whatismyipaddress.com', url: 'https://bot.whatismyipaddress.com' }
  ];

  console.log('📍 Your IP addresses from different services:');
  console.log('=' .repeat(50));

  for (const service of services) {
    try {
      let ip;
      if (service.name === 'httpbin.org') {
        const response = await getIP(service.url);
        ip = JSON.parse(response).origin;
      } else {
        ip = await getIP(service.url);
      }
      
      console.log(`✅ ${service.name}: ${ip}`);
    } catch (error) {
      console.log(`❌ ${service.name}: Failed to fetch`);
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('💡 Instructions:');
  console.log('1. Copy any of the IP addresses above');
  console.log('2. Go to MongoDB Atlas → Network Access');
  console.log('3. Click "Add IP Address"');
  console.log('4. Paste your IP address');
  console.log('5. Add a comment like "My Development IP"');
  console.log('6. Click "Confirm"');
  console.log('7. Wait for the status to show "Active"');
  console.log('\n🔄 Then restart your Node.js app with: npm run dev');
};

checkIPs().catch(console.error);
