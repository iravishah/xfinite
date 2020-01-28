const mongoose = require('mongoose');
const db = mongoose.connection;
const mongoUriBuilder = require('mongo-uri-builder');

const logger = global.logger;

/**
 *
 *
 * @param {*} mongo
 * @param {*} cb
 * @returns mongoose
 */
function connect(mongo, cb) {
  let options = mongo.options || opts;
  let uriStr = getConnStr(mongo, options);
  mongoose.connect(uriStr, function (err) {
    if (typeof (cb) === "function") {
      cb(err);
    }
    if (err) {
      logger.error('error in mongo db connection', err);
    }
  });

  db.on('connecting', function () {
    logger.log('connecting to Mongo DB...');
  });
  db.on('error', function (error) {
    logger.error('error in mongo db connection: ' + error);
  });
  db.on('connected', function () {
    logger.log('mongo db connected!');
  });
  db.once('open', function () {
    logger.log('mongo db connection opened!');
  });
  db.on('reconnected', function () {
    logger.log('mongo db reconnected!');
  });
  db.on('disconnected', function () {
    logger.error('mongo db disconnected!');
  });

  return mongoose;
}
/**
 *
 *
 * @param {*} mongo
 * @param {*} opts
 * @returns uri
 */
function getConnStr(mongo, opts) {
  logger.log(`db is: ${mongo.database}`);
  logger.log(`replicas: ${mongo.replicas}`);

  var connectionStr = mongoUriBuilder({
    username: encodeURIComponent(mongo.username),
    password: encodeURIComponent(mongo.password),
    host: mongo.replicas,
    database: mongo.database,
    options: opts
  });

  return connectionStr;
}

module.exports = {
  connect
}