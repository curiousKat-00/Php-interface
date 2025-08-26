const express = require('express');
const router = express.Router();

router.get('/success', (req, res) => {
  res.send('Payment successful! Thank you for your purchase.');
});

module.exports = router;