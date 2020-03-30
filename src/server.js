const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: '../.env' });

const port = process.env.PORT || 8000;
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false,
});
mongoose.connection.on('error', (error) => {
  // eslint-disable-next-line no-console
  console.log(error);
  process.exit(1);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listing on port ${port}`);
}).on('error', (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
