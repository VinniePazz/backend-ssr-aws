const User = require('../models/Customer');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signin = (req, res) => {
  const { email, password } = req.body;
  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup',
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match',
      });
    }
    // generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken',
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '10m',
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      text: 'Activate your account',
      html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.PUBLIC_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.PUBLIC_URL}</p>
            `,
    };

    sgMail
      .send(emailData)
      .then((value) => {
        console.log(value);
      })
      .catch((reason) => {
        console.log(reason);
      });

    // for POSTMAN
    res.json({ token });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(400).json({
          error: 'Expired link. Try again',
        });
      }

      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: 'Something went wrong. Try later',
          });
        }

        user.password = newPassword; // extend with new password
        user.resetPasswordLink = ''; // extend with new password

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: 'Error resetting user password',
            });
          }
          res.json({
            message: `Great! Now you can login with your new password`,
          });
        });
      });
    });
  }
};
