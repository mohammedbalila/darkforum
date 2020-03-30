const express = require('express');
const passport = require('passport');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes');
const {
  handler: errorHandler,
  converter,
  notFound,
} = require('./middleware/error');
const passportConfig = require('./config/passport');
// const { removeUnConfirmed } = require('./utils');

const app = express();

passportConfig(passport);
app.use(passport.initialize());
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '3mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '3mb' }));
app.use(morgan('common'));

app.use('/media', express.static(path.join(__dirname, '../media')));
app.use('/api', router);

// format error then handle it
app.use(converter);
app.use(notFound);
app.use(errorHandler);

// setInterval(removeUnConfirmed, 1200 * 60);

module.exports = app;
