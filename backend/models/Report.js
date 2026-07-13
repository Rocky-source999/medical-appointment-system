const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    title: { type: String, required: true },
    diagnosis: { type: String },
    symptoms: [{ type: String }],
    prescribedMedicines: [
      {
        name: String,
        dosage: String,
        frequency: String, // e.g. "twice daily"
        durationDays: Number
      }
    ],
    rawNotes: { type: String }, // free-text notes to be summarized
    summary: { type: String } // auto-generated summary
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);