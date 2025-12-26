const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/distribute', aiController.distribute);
router.post('/redistribute', aiController.redistribute);
router.post('/optimize', aiController.optimize);
router.get('/analyze-balance', aiController.analyzeBalance);
router.get('/statistics', aiController.getStatistics);

module.exports = router;
