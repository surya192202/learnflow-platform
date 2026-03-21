const express = require('express');
const cors = require('cors');

const app = express();
const origin = 'https://learnflow-eta.vercel.app';

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.post('/api/auth/register', (req, res) => res.json({ ok: 1 }));

app.listen(3123, async () => {
    try {
        const res = await fetch('http://localhost:3123/api/auth/register', {
            method: 'OPTIONS',
            headers: {
                'Origin': origin,
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        });
        console.log('OPTIONS Status:', res.status);
        console.log('OPTIONS Headers:', Object.fromEntries(res.headers.entries()));
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
});
