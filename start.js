var config = require('./config');
var logger = require('winston');
logger.level = config.logger_level || 'info';

logger.debug('Building data model.');

var MongoClient = require('mongodb').MongoClient;
require('./model')({
  client: MongoClient,
  path: config.db_path
}, function(err, model) {
  if (err) throw err;

  startServer(model);
});

function startServer(model) {
  logger.info('Starting API server.');
  var express = require('express');
  var app = require('./server')({
    express: express,
    logger: logger,
    model: model,
    endpoints: config.endpoints
  });

  var port = config.port || 8081;
  var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;

    logger.info("API server listening at 'http://%s:%s'.", host, port);
  });
}
