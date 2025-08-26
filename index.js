const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use(require('./success'));
app.use(require('./cancel'));
app.use(require('./notify'));
app.use(require('./signature'));

app.get('/', (req, res) => {
  res.send('PayFast backend is running.');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});