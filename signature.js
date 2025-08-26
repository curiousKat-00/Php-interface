const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Helper to create the signature string
function createSignatureString(data, passphrase = '') {
  // Remove empty values and the signature field
  const filtered = Object.keys(data)
    .filter(key => data[key] !== '' && key !== 'signature')
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');
  if (passphrase) {
    return `${filtered}&passphrase=${encodeURIComponent(passphrase)}`;
  }
  return filtered;
}

router.post('/signature', (req, res) => {
  const data = req.body;
  const passphrase = ''; // Add your passphrase here if you use one

  const signatureString = createSignatureString(data, passphrase);
  const signature = crypto.createHash('md5').update(signatureString).digest('hex');
  res.json({ signature });
});

module.exports = router;