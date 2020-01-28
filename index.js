const express = require('express');
const helmet = require('helmet');
const app = express();
const bodyParser = require('body-parser');

const loadConfig = require('./lib/config');
const Logger = require('./logger/logger');

config = global.config = loadConfig()
logger = global.logger = new Logger(config);

const routes = require('./routes/routes');
const { connect } = require('./db/connect');

app.use(helmet());
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(routes())

if (config.environment != 'test') {
  connect(config.mongo);
}

app.listen(config.port, () => logger.log(`api server started on port ${config.port}`));