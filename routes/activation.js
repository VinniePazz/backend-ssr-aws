const express = require('express');
const router = express.Router();

// import controller
const { activation } = require('../controllers/activation');

router.post('/', activation);

module.exports = router;
