const User = require('../models/User');

// @desc  Get all doctors (with optional specialization filter/search)
// @route GET /api/doctors
const getDoctors = async (req, res, next) => {
  try {
    const { specialization, search } = req.query;
    const query = { role: 'doctor' };

    if (specialization) query.specialization = new RegExp(specialization, 'i');
    if (search) query.name = new RegExp(search, 'i');

    const doctors = await User.find(query).select('-password');
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

// @desc  Get single doctor by id
// @route GET /api/doctors/:id
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' }).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

// @desc  Update doctor availability (doctor only, own profile)
// @route PUT /api/doctors/availability
const updateAvailability = async (req, res, next) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can update availability' });
    }
    const { availability } = req.body;
    const doctor = await User.findByIdAndUpdate(
      req.user._id,
      { availability },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDoctors, getDoctorById, updateAvailability };