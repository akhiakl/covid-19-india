const express = require('express');
const router = express.Router();
const controller = require('./scrape.controller');

/* scrape the website */
router.get('/', controller.scrape);

module.exports = router;
