/**
 * Generates a concise, structured summary of a medical report from its
 * structured fields + free-text notes. This is template/extractive based
 * so it works fully offline without any external AI API.
 *
 * If you want a more natural-language summary, you can swap this out for
 * a call to the Anthropic API (see README for an example snippet).
 */
function generateReportSummary(report) {
  const parts = [];

  parts.push(`Report: ${report.title}.`);

  if (report.symptoms && report.symptoms.length) {
    parts.push(`Reported symptoms: ${report.symptoms.join(', ')}.`);
  }

  if (report.diagnosis) {
    parts.push(`Diagnosis: ${report.diagnosis}.`);
  }

  if (report.prescribedMedicines && report.prescribedMedicines.length) {
    const meds = report.prescribedMedicines
      .map((m) => `${m.name}${m.dosage ? ` (${m.dosage})` : ''} - ${m.frequency || 'as directed'}${m.durationDays ? ` for ${m.durationDays} day(s)` : ''}`)
      .join('; ');
    parts.push(`Prescribed medicines: ${meds}.`);
  }

  if (report.rawNotes) {
    // naive extractive summary: first 2 sentences of raw notes
    const sentences = report.rawNotes.split(/(?<=[.!?])\s+/).filter(Boolean);
    const extract = sentences.slice(0, 2).join(' ');
    if (extract) parts.push(`Notes: ${extract}`);
  }

  parts.push('This summary was auto-generated from the recorded report data and is not a substitute for reviewing the full record with your doctor.');

  return parts.join(' ');
}

module.exports = { generateReportSummary };