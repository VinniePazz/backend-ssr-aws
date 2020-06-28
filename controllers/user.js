const User = require('../models/user');

exports.read = (req, res) => {
  const userId = req.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    user.hashed_password = undefined; // delete field for response
    user.salt = undefined;
    res.json(user);
  });
};
