const Customer = require('../models/Customer');

exports.read = (req, res) => {
  const userId = req.params.id;
  // User.findById(userId).exec((err, user) => {
  //   if (err || !user) {
  //     return res.status(400).json({
  //       error: 'User not found',
  //     });
  //   }
  //   console.log(user);

  //   user.hashed_password = undefined;
  //   user.salt = undefined;
  //   res.json({ user });
  // });

  console.log(req.cookies);

  res.cookie('cookieName', 'cookievalue', {
    maxAge: 900000,
    httpOnly: true,
    path: '/',
    secure: false,
    signed: false,
  });
  res.json({});
};

exports.update = (req, res) => {
  const { name, password } = req.body;
  if (!name && !password) {
    return res.status(400).json({
      error: 'Nothing to change. Provide new password or name',
    });
  }
  // we have _id from express-jwt middleware JWT payload
  Customer.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    if (name) {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password should be min 6 characters long',
        });
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log('USER UPDATE ERROR', err);
        return res.status(400).json({
          error: 'User update failed',
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
