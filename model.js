var YoloWatch = function(options) {
  return {
    getMeta: function(callback) {
      options.meta.findOne(
        {},
        { _id: 0 },
        function(err, doc) {
          if (err) return callback(err);
          else return callback(null, doc);
        }
      );
    },

    getRecent: function(count, callback) {
      if (count === 0) {
        return callback(null, {
          count: 0,
          tweets: []
        });
      }

      options.tweets.find({}, { _id: 0 })
        .limit(count)
        .sort({ timestamp: -1 })
        .toArray(function(err, docs) {
          if (err) return callback(err);

          var sanitized = docs.map(function(d) {
            return {
              type: 'tweet',
              timestamp: d.timestamp,
              text: d.text,
              screen_name: d.screen_name
            };
          });

          var wrapped = {
            count: sanitized.length,
            tweets: sanitized
          };

          return callback(null, wrapped);
      });
    },

    getCountForSpan: function(start, end, callback) {
      var query = {};
      if (start || end) query.timestamp = {};
      if (start) query.timestamp.$gte = start;
      if (end) query.timestamp.$lt = end;

      options.tweets.count(query, function(err, count) {
        if (err) return callback(err);

        var result = {
          type: 'count',
          start: start,
          end: end,
          count: count
        };

        return callback(null, result);
      });
    }
  }
}

module.exports = function(options, callback) {
  options.client.connect(options.path, function(err, db) {
    if (err) return callback(err);

    var modelOptions = {
      meta: db.collection('meta'),
      tweets: db.collection('tweets')
    };
    var model = YoloWatch(modelOptions);
    return callback(null, model);
  });
};
