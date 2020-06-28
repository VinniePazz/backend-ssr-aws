const expressJwt = require('express-jwt');

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET, // add req.user with jwt payload
});
