const Appointment = require('../models/Appointment');

// @desc  Book a new appointment (patient)
// @route POST /api/appointments
const bookAppointment = async (req, res, next) => {
  try {
    const { doctor, date, timeSlot, reason } = req.body;
    if (!doctor || !date || !timeSlot) {
      return res.status(400).json({ message: 'doctor, date and timeSlot are required' });
    }

    // Prevent double booking of the same doctor/date/slot
    const clash = await Appointment.findOne({
      doctor,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });
    if (clash) {
      return res.status(409).json({ message: 'This slot is already booked. Please choose another.' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date,
      timeSlot,
      reason
    });

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc  Get appointments for logged-in user (patient sees own, doctor sees own)
// @route GET /api/appointments
const getMyAppointments = async (req, res, next) => {
  try {
    const filter = req.user.role === 'doctor' ? { doctor: req.user._id } : { patient: req.user._id };
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone age gender')
      .populate('doctor', 'name specialization consultationFee')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc  Update appointment status (doctor confirms/completes/cancels)
// @route PUT /api/appointments/:id/status
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const isOwnerDoctor = req.user.role === 'doctor' && appointment.doctor.toString() === req.user._id.toString();
    const isOwnerPatient = req.user.role === 'patient' && appointment.patient.toString() === req.user._id.toString();

    if (!isOwnerDoctor && !isOwnerPatient) {
      return res.status(403).json({ message: 'Not authorized to modify this appointment' });
    }
    // Patients may only cancel; doctors may confirm/complete/cancel
    if (isOwnerPatient && status !== 'cancelled') {
      return res.status(403).json({ message: 'Patients can only cancel appointments' });
    }

    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc  Cancel/delete appointment
// @route DELETE /api/appointments/:id
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const isOwner =
      appointment.patient.toString() === req.user._id.toString() ||
      appointment.doctor.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: 'Not authorized' });

    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = { bookAppointment, getMyAppointments, updateAppointmentStatus, cancelAppointment };