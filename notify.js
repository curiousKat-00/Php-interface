const express = require('express');
const router = express.Router();

router.post('/notify', (req, res) => {
  // Here you would handle PayFast's IPN notification
  res.status(200).send('Notification received');
});

module.exports = router;