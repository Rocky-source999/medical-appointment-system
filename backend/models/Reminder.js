const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    medicineName: { type: String, required: true },
    dosage: { type: String },
    frequency: { type: String, required: true }, // e.g. "twice daily"
    times: [{ type: String }], // e.g. ["08:00", "20:00"]
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
