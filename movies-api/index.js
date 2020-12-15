const express = require('express');
const helmet = require('helmet');
const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies.js');

const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middleware/errorHandlers');

const notFoundHandle = require('./utils/middleware/notFoundHandler');

app.use(helmet());

// body parser
app.use(express.json());

// routes
moviesApi(app);

// catch 404
app.use(notFoundHandle);

// errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

/* app.get('/', function (req, res) {
  res.send('hello world');
});

app.get('/json', function (req, res) {
  res.json({ hello: 'word' });
});
 */
app.listen(config.port, function () {
  // eslint-disable-next-line no-console
  console.log(`listening http://localhost:${config.port}`);
});
