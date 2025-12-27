const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

// Email configuration routes
router.get('/email', configController.getConfig);
router.post('/email', configController.updateConfig);
router.post('/email/test', configController.testConfig);
router.get('/email/presets', configController.getPresets);

module.exports = router;
