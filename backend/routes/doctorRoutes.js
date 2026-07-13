const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, updateAvailability } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

router.get('/', getDoctors);
router.put('/availability', protect, updateAvailability);
router.get('/:id', getDoctorById);

module.exports = router;