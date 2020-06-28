const express = require('express');
const router = express.Router();

// import controller
const { requireSignin } = require('../middlewares/requireSignin');
const { read } = require('../controllers/user');

router.get('/:id', requireSignin, read);

module.exports = router;
