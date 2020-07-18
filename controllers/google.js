// const { OAuth2Client } = require('google-auth-library');
// const User = require('../models/user');
const jwt = require('jsonwebtoken');

const { google } = require('googleapis');

const cookieOptions = {
  httpOnly: false,
  sameSite: false,
  signed: false,
  secure: process.env.NODE_ENV === 'development' ? false : true, // HTTPS header
};

const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

const googleUrl = auth.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/user.phonenumbers.read',
  ],
});

exports.generateGoogleUrl = (req, res) => {
  try {
    console.log(googleUrl);
    res.json({ googleUrl });
  } catch (error) {
    console.error(error);
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const code = req.body.code;
    const { tokens } = await auth.getToken(code);
    console.log(tokens);
    auth.setCredentials(tokens);

    const { data: user } = await google
      .people({ version: 'v1', auth })
      .people.get({
        resourceName: 'people/me',
        personFields: 'phoneNumbers,emailAddresses,names,photos,',
      });

    console.log(user);
    const userName = user.names[0].displayName;

    const token = jwt.sign({ userName: userName }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.cookie('token', token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false });
  }
};

// const client = new OAuth2Client(process.env.G_CLIENT_ID);
// exports.googleLogin = (req, res) => {
//   const { idToken } = req.body;

//   client
//     .verifyIdToken({ idToken, audience: process.env.G_CLIENT_ID })
//     .then((response) => {
//       const { email_verified, name, email } = response.payload;
//       if (email_verified) {
//         User.findOne({ email }).exec((err, user) => {
//           if (user) {
//             const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//               expiresIn: '7d',
//             });
//             const { _id, email, name, role } = user;
//             return res.json({
//               token,
//               user: { _id, email, name, role },
//             });
//           } else {
//             let password = email + process.env.JWT_SECRET;
//             user = new User({ name, email, password });
//             user.save((err, data) => {
//               if (err) {
//                 console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
//                 return res.status(400).json({
//                   error: 'User signup failed with google',
//                 });
//               }
//               const token = jwt.sign(
//                 { _id: data._id },
//                 process.env.JWT_SECRET,
//                 { expiresIn: '7d' }
//               );
//               const { _id, email, name, role } = data;
//               return res.json({
//                 token,
//                 user: { _id, email, name, role },
//               });
//             });
//           }
//         });
//       } else {
//         return res.status(400).json({
//           error: 'Google login failed. Try again',
//         });
//       }
//     });
// };
