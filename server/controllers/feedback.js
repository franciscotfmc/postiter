var mongoose = require('mongoose'),
  Feedback = mongoose.model('Feedback');

exports.create = function(req, res, next) {
  var feed = {};
  feed.text = req.body.text;
  feed.user = {
    name: req.user.name,
    email: req.user.email,
  };

  var feedback = new Feedback(feed);

  feedback.save(function(err) {
    if (err) return res.json(400, err);
    return res.json(200);
  });
};
