const express = require('express');
const router = express.Router();
const { placeCODOrder } = require('../controllers/codController');

router.post('/place', placeCODOrder);

module.exports = router;
