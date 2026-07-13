const Reminder = require('../models/Reminder');

// @desc  Create a medicine reminder (patient)
// @route POST /api/reminders
const createReminder = async (req, res, next) => {
  try {
    const { medicineName, dosage, frequency, times, startDate, endDate, report } = req.body;
    if (!medicineName || !frequency || !times || !startDate || !endDate) {
      return res.status(400).json({
        message: 'medicineName, frequency, times, startDate and endDate are required'
      });
    }

    const reminder = await Reminder.create({
      patient: req.user._id,
      report,
      medicineName,
      dosage,
      frequency,
      times,
      startDate,
      endDate
    });

    res.status(201).json(reminder);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all reminders for logged-in patient
// @route GET /api/reminders
const getMyReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ patient: req.user._id }).sort({ startDate: 1 });
    res.json(reminders);
  } catch (error) {
    next(error);
  }
};

// @desc  Update a reminder (e.g. mark inactive, edit times)
// @route PUT /api/reminders/:id
const updateReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, patient: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    Object.assign(reminder, req.body);
    await reminder.save();
    res.json(reminder);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a reminder
// @route DELETE /api/reminders/:id
const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, patient: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReminder, getMyReminders, updateReminder, deleteReminder };