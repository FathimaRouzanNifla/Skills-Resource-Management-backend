const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matching.controller');

router.get('/:projectId', matchingController.getMatchingPersonnel);

module.exports = router;