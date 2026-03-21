const https = require('https');

async function testOptions() {
    try {
        console.log('Sending OPTIONS to live Render app...');
        const res = await fetch('https://learnflow.onrender.com/api/auth/register', {
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://learnflow-i7w1w1cde-surya192202s-projects.vercel.app',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type, Authorization',
                'Accept': '*/*, application/json'
            }
        });
        
        console.log('OPTIONS Status:', res.status);
        console.log('OPTIONS Headers:', Object.fromEntries(res.headers.entries()));

        console.log('\nSending GET to live Render health check...');
        const res2 = await fetch('https://learnflow.onrender.com/api/health', {
            method: 'GET',
            headers: {
                'Origin': 'https://learnflow-i7w1w1cde-surya192202s-projects.vercel.app',
                'Accept': '*/*, application/json'
            }
        });
        
        console.log('GET Health Status:', res2.status);
        console.log('GET Health Headers:', Object.fromEntries(res2.headers.entries()));
        console.log('Response body:', await res2.text());

    } catch(err) {
        console.error('Fetch error:', err);
    }
}
testOptions();
