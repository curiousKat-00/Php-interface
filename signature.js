const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Helper to create the signature string
function createSignatureString(data, passphrase = '') {
  // Sort keys alphabetically
  const keys = Object.keys(data).sort();
  let signatureString = keys
    .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
    .join('&');
  if (passphrase) {
    signatureString += `&passphrase=${encodeURIComponent(passphrase)}`;
  }
  return signatureString;
}

router.post('/signature', (req, res) => {
  const data = req.body;
  const passphrase = ''; // Optional: add your passphrase here if you use one

  const signatureString = createSignatureString(data, passphrase);
  const signature = crypto.createHash('md5').update(signatureString).digest('hex');
  res.json({ signature });
});

module.exports = router;