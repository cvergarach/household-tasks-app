const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/test', emailController.sendTest);
router.post('/send-daily', emailController.sendDaily);
router.post('/send-weekly', emailController.sendWeekly);
router.post('/send-monthly', emailController.sendMonthly);
router.get('/history', emailController.getHistory);

module.exports = router;
