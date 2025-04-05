const express = require('express');
const auth = require('../middleware/auth');
const evaluationController = require('../controllers/evaluationController');

const router = express.Router();

// Protect all routes
router.use(auth);

// Get all evaluations
router.get('/', evaluationController.getEvaluations);

// Get evaluation by ID
router.get('/:id', evaluationController.getEvaluation);

// Create new evaluation
router.post('/', evaluationController.createEvaluation);

// Update evaluation
router.put('/:id', evaluationController.updateEvaluation);

// Delete evaluation
router.delete('/:id', evaluationController.deleteEvaluation);

module.exports = router;
