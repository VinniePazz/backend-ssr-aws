const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.activation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err) {
      if (err) {
        console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
        return res.status(401).json({
          error: 'Expired link. Signup again',
        });
      }

      const { name, email, password } = jwt.decode(token);

      const user = new User({ name, email, password });

      user.save((err, user) => {
        if (err) {
          console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
          return res.status(401).json({
            error: 'Error saving user in database. Try signup again',
          });
        }
        return res.json({
          message: 'Signup success. Please signin.',
        });
      });
    });
  } else {
    return res.json({
      message: 'Something went wrong. Try again.',
    });
  }
};
