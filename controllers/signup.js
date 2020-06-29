const User = require('../models/user');
const jwt = require('jsonwebtoken');
// sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
