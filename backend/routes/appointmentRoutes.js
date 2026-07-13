const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/', protect, getMyAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;