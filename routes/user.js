const express = require('express');
const router = express.Router();

// import controller
const { requireSignin } = require('../middlewares/requireSignin');
const { read, update } = require('../controllers/user');

router.get('/:id', requireSignin, read);
router.put('/update', requireSignin, update); // we don't need /:id anymore cause we have requireSignin middleware

module.exports = router;
