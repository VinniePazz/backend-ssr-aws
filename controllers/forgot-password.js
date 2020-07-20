const User = require('../models/Customer');
const jwt = require('jsonwebtoken');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist',
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: '10m',
    });

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset link`,
      html: `
              <h1>Please use the following link to reset your password</h1>
              <p>${process.env.PUBLIC_URL}/auth/password/reset/${token}</p>
              <hr />
              <p>This email may contain sensetive information</p>
              <p>${process.env.PUBLIC_URL}</p>
          `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log('RESET PASSWORD LINK ERROR', err);
        return res.status(400).json({
          error: 'Database connection error on user password forgot request',
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            return res.json({
              message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
            });
          })
          .catch((err) => {
            return res.json({
              message: err.message,
            });
          });
      }
    });
  });
};
