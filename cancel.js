const express = require('express');
const router = express.Router();

router.get('/cancel', (req, res) => {
  res.send('Payment cancelled. You have not been charged.');
});

module.exports = router;