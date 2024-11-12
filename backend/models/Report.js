const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
    reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User being reported
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who reported
    reason: { type: String, enum: ['Harassment', 'Spam', 'Inappropriate Content'], required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;