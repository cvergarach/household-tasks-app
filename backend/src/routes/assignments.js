const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/', assignmentController.getAll);
router.get('/date/:date', assignmentController.getByDate);
router.get('/week/:startDate', assignmentController.getWeek);
router.get('/month/:year/:month', assignmentController.getMonth);
router.get('/person/:personId', assignmentController.getByPerson);
router.post('/', assignmentController.create);
router.put('/:id', assignmentController.update);
router.put('/:id/complete', assignmentController.complete);
router.delete('/:id', assignmentController.delete);
router.delete('/task/:taskId', assignmentController.deleteByTask);

module.exports = router;
