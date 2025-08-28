const express = require('express');
const router = express.Router();
const cors = require('cors');
// Load environment variables from .env file
require('dotenv').config();
const crypto = require('crypto');

// Configure CORS to allow requests from your React app
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // For legacy browser support
};

// Apply CORS middleware to the router
router.use(cors(corsOptions));

// Helper to create the signature string
function createSignatureString(data, passphrase) {
    // A custom function to encode values in a way that matches PHP's http_build_query.
    // This is often required for payment gateway signature generation.
    const customEncodeURIComponent = (str) => {
        // encodeURIComponent misses some characters and encodes spaces as %20.
        // PayFast expects spaces to be encoded as '+' and other special characters
        // to be encoded in a way that matches PHP's rawurlencode.
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
        // Filter out empty values, nulls, and the signature
        .filter(key => dataForSignature[key] !== '' && dataForSignature[key] != null && key !== 'signature')
        .sort()
        .map(key => `${key}=${customEncodeURIComponent(String(dataForSignature[key]).trim())}`)
        .join('&');

    return paramString;
}

router.post('/signature', (req, res) => {
  const data = req.body;
  const passphrase = process.env.PAYFAST_PASSPHRASE;

  // It's crucial to have a passphrase for security.
  if (!passphrase) {
    console.error('FATAL: PAYFAST_PASSPHRASE is not set in the environment variables.');
    return res.status(500).json({
      error: 'Server configuration error: Payment passphrase is not set.',
    });
  }
  
  const signatureString = createSignatureString(data, passphrase);

  const signature = crypto
    .createHash('md5')
    .update(signatureString)
    .digest('hex');

  res.json({ signature });
});

module.exports = router;
