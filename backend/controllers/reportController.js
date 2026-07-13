const Report = require('../models/Report');
const { generateReportSummary } = require('../utils/reportSummary');

// @desc  Create a report (doctor, tied to a patient/appointment)
// @route POST /api/reports
const createReport = async (req, res, next) => {
  try {
    const { patient, appointment, title, diagnosis, symptoms, prescribedMedicines, rawNotes } = req.body;
    if (!patient || !title) {
      return res.status(400).json({ message: 'patient and title are required' });
    }

    const reportData = {
      patient,
      appointment,
      doctor: req.user.role === 'doctor' ? req.user._id : req.body.doctor,
      title,
      diagnosis,
      symptoms,
      prescribedMedicines,
      rawNotes
    };

    reportData.summary = generateReportSummary(reportData);

    const report = await Report.create(reportData);
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

// @desc  Get reports for logged-in patient, or reports authored by logged-in doctor
// @route GET /api/reports
const getMyReports = async (req, res, next) => {
  try {
    const filter = req.user.role === 'doctor' ? { doctor: req.user._id } : { patient: req.user._id };
    const reports = await Report.find(filter)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

// @desc  Get a single report by id
// @route GET /api/reports/:id
const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization');
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const isOwner =
      report.patient._id.toString() === req.user._id.toString() ||
      (report.doctor && report.doctor._id.toString() === req.user._id.toString());
    if (!isOwner) return res.status(403).json({ message: 'Not authorized' });

    res.json(report);
  } catch (error) {
    next(error);
  }
};

// @desc  Regenerate summary for an existing report (e.g. after edits)
// @route POST /api/reports/:id/summary
const regenerateSummary = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.summary = generateReportSummary(report);
    await report.save();
    res.json({ summary: report.summary });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReport, getMyReports, getReportById, regenerateSummary };