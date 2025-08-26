const express = require('express');
const app = express();

app.use(express.json());

app.use(require('./success'));
app.use(require('./cancel'));
app.use(require('./notify'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});