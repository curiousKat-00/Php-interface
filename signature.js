const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Helper to create the signature string
function createSignatureString(data, passphrase = '') {
    // A custom function to encode values in a way that matches PHP's rawurlencode.
    // This is often required for payment gateway signature generation.
    const customEncodeURIComponent = (str) => {
        // encodeURIComponent misses !, ', (, ), and *
        return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
            return '%' + c.charCodeAt(0).toString(16).toUpperCase();
        });
    };

    // Create parameter string
    const paramString = Object.keys(data)
        // Filter out empty values, nulls, and the signature
        .filter(key => data[key] !== '' && data[key] != null && key !== 'signature')
        .sort()
        .map(key => `${key}=${customEncodeURIComponent(String(data[key]).trim())}`)
        .join('&');

    // Add passphrase if present
    if (passphrase) {
        return `${paramString}&passphrase=${customEncodeURIComponent(passphrase.trim())}`;
    }
    return paramString;
}

router.post('/signature', (req, res) => {
  const data = req.body;
  const passphrase = ''; // Add your passphrase here if you use one

  const signatureString = createSignatureString(data, passphrase);
  const signature = crypto.createHash('md5').update(signatureString).digest('hex');
  res.json({ signature });
});

module.exports = router;