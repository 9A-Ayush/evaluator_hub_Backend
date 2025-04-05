const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// Protect all routes with auth middleware
router.use(auth);

// Get all reports
router.get('/', reportController.getAllReports);

// Get single report
router.get('/:id', reportController.getReportById);

// Create new report
router.post('/', reportController.createReport);

// Update report
router.put('/:id', reportController.updateReport);

// Delete report
router.delete('/:id', reportController.deleteReport);

// Download report as PDF
router.get('/:id/download', reportController.downloadReport);

module.exports = router;
