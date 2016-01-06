module.exports = function(options) {
  var router = options.express();

  router.get('/meta', function(req, res, next) {
    options.model.getMeta(function(err, data) {
      if (err) return next();
      else return res.json({ data: data });
    });
  });

  router.get('/count', function(req, res, next) {
    options.model.getCountForSpan(undefined, undefined, function(err, data) {
      if (err) return next();
      else return res.json({ data: data });
    });
  });

  router.get('/count/from/:from/to/:to', function(req, res, next) {
    var from = parseInt(req.params.from);
    var to = parseInt(req.params.to);
    if (!(from || to)) return next();

    options.model.getCountForSpan(from, to, function(err, data) {
      if (err) return next();
      else return res.json({ data: data });
    });
  });

  router.get('/count/since/:start', function(req, res, next) {
    var start = parseInt(req.params.start);
    if (start !== 0 && !start) return next();

    options.model.getCountForSpan(start, undefined, function(err, data) {
      if (err) return next();
      else return res.json({ data: data });
    });
  });

  router.get('/count/until/:end', function(req, res, next) {
    var end = parseInt(req.params.end);
    if (end !== 0 && !end) return next();

    options.model.getCountForSpan(undefined, end, function(err, data) {
      if (err) return next();
      else return res.json({ data: data });
    });
  });

  router.get('/recent/:count', function(req, res, next) {
    var count =
      Math.min(parseInt(req.params.count), options.endpoints.max_tweet_count) || 0;
    options.model.getRecent(count, function(err, data) {
      if (err) return next();
      else return res.json({ data: data });
    });
  });

  return router;
};
