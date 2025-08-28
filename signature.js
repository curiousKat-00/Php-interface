const express = require('express');
const router = express.Router();
const cors = require('cors');
// Load environment variables from .env file for local development
require('dotenv').config();
const crypto = require('crypto');

// Configure CORS to allow requests from your React app
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

// Apply CORS middleware to the router
router.use(cors(corsOptions));

// Helper to create the signature string
function createSignatureString(data, passphrase) {
    // A custom function to encode values in a way that matches PHP's http_build_query.
    const customEncodeURIComponent = (str) => {
        const encoded = encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
            return '%' + c.charCodeAt(0).toString(16).toUpperCase();
        });
        return encoded.replace(/%20/g, '+');
    };

    // Create a copy of the data object to include the passphrase for sorting.
    const dataForSignature = { ...data };
    if (passphrase) {
        dataForSignature.passphrase = passphrase;
    }

    // Create parameter string
    const paramString = Object.keys(dataForSignature)
        .filter(key => dataForSignature[key] !== '' && dataForSignature[key] != null && key !== 'signature')
        .sort()
        .map(key => `${key}=${customEncodeURIComponent(String(dataForSignature[key]).trim())}`)
        .join('&');

    return paramString;
}

router.post('/signature', (req, res) => {
  const data = req.body;
  // Use the passphrase from environment variables, or an empty string if not set.
  // An empty string is correct if you have not set a passphrase in your PayFast account.
  const passphrase = process.env.PAYFAST_PASSPHRASE || '';

  const signatureString = createSignatureString(data, passphrase);

  const signature = crypto
    .createHash('md5')
    .update(signatureString)
    .digest('hex');

  res.json({ signature });
});

module.exports = router;
