const express = require('express');
const router = express.Router();

// import controller
const { generateGoogleUrl, googleLogin } = require('../controllers/google');

router.route('/').get(generateGoogleUrl);

router.route('/callback').post(googleLogin);

module.exports = router;
