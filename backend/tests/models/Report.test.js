const mongoose = require('mongoose');
const Report = require('../../models/Report');

describe("Report Model", () => {

    it("should create a valid Report document with default status and createdAt", () => {
        const reportData = {
            reportedUserId: new mongoose.Types.ObjectId(),
            reportedBy: new mongoose.Types.ObjectId(),
            reason: 'Harassment'
        };

        const report = new Report(reportData);
        const error = report.validateSync();
        expect(error).toBeUndefined();
        expect(report.status).toBe('pending');
        expect(report.createdAt).toBeDefined();
        expect(report.createdAt).toBeInstanceOf(Date);
    });

    it("should create a valid Report document with a custom status", () => {
        const reportData = {
            reportedUserId: new mongoose.Types.ObjectId(),
            reportedBy: new mongoose.Types.ObjectId(),
            reason: 'Spam',
            status: 'reviewed'
        };

        const report = new Report(reportData);
        const error = report.validateSync();
        expect(error).toBeUndefined();
        expect(report.status).toBe('reviewed');
    });

    // Missing fields

    it("should throw a validation error when reportedUserId is missing", () => {
        const reportData = {
            reportedBy: new mongoose.Types.ObjectId(),
            reason: 'Spam'
        };

        const report = new Report(reportData);
        const error = report.validateSync();
        expect(error.errors.reportedUserId).toBeDefined();
    });

    it("should throw a validation error when reportedBy is missing", () => {
        const reportData = {
            reportedUserId: new mongoose.Types.ObjectId(),
            reason: 'Spam'
        };

        const report = new Report(reportData);
        const error = report.validateSync();
        expect(error.errors.reportedBy).toBeDefined();
    });

    it("should throw a validation error when reason is missing", () => {
        const reportData = {
            reportedUserId: new mongoose.Types.ObjectId(),
            reportedBy: new mongoose.Types.ObjectId()
        };

        const report = new Report(reportData);
        const error = report.validateSync();
        expect(error.errors.reason).toBeDefined();
    });

    // Invalid fields

    it("should throw a validation error when reportedUserId is invalid", () => {
        const reportData = {
            reportedUserId: "invalidId",
            reportedBy: new mongoose.Types.ObjectId(),
            reason: 'Harassment'
        };

        const report = new Report(reportData);
        const error = report.validateSync();
        expect(error.errors.reportedUserId).toBeDefined();
    });

    it("should throw a validation error when reportedBy is invalid", () => {
        const reportData = {
            reportedUserId: new mongoose.Types.ObjectId(),
            reportedBy: "invalidId",
            reason: 'Harassment'
        };

        const report = new Report(reportData);
        const error = report.validateSync();
        expect(error.errors.reportedBy).toBeDefined();
    });

    it("should throw a validation error when reason is invalid", () => {
        const reportData = {
            reportedUserId: new mongoose.Types.ObjectId(),
            reportedBy: new mongoose.Types.ObjectId(),
            reason: 'Offensive'
        };

        const report = new Report(reportData);
        const error = report.validateSync();
        expect(error.errors.reason).toBeDefined();
    });

    it("should throw a validation error when status is invalid", () => {
        const reportData = {
            reportedUserId: new mongoose.Types.ObjectId(),
            reportedBy: new mongoose.Types.ObjectId(),
            reason: 'Spam',
            status: 'closed'
        };

        const report = new Report(reportData);
        const error = report.validateSync();
        expect(error.errors.status).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const reportData = {
            reportedUserId: new mongoose.Types.ObjectId(),
            reportedBy: new mongoose.Types.ObjectId(),
            reason: 'Inappropriate Content',
            createdAt: "notADate"
        };

        const report = new Report(reportData);
        const error = report.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});