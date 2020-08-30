const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

// import controller
const { requireSignin } = require('../middlewares/requireSignin');
const { read, update } = require('../controllers/customer');

router.get('/:id', cookieParser(), read);
router.put('/update', requireSignin, update); // we don't need /:id anymore cause we have requireSignin middleware

module.exports = router;
