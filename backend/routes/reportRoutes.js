const express = require('express');
const router = express.Router();
const {
  createReport,
  getMyReports,
  getReportById,
  regenerateSummary
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('doctor', 'admin'), createReport);
router.get('/', protect, getMyReports);
router.get('/:id', protect, getReportById);
router.post('/:id/summary', protect, authorize('doctor', 'admin'), regenerateSummary);

module.exports = router;