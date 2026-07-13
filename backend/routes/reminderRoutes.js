const express = require('express');
const router = express.Router();
const {
  createReminder,
  getMyReminders,
  updateReminder,
  deleteReminder
} = require('../controllers/reminderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('patient'), createReminder);
router.get('/', protect, authorize('patient'), getMyReminders);
router.put('/:id', protect, authorize('patient'), updateReminder);
router.delete('/:id', protect, authorize('patient'), deleteReminder);

module.exports = router;