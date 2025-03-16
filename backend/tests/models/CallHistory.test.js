const mongoose = require('mongoose');
const CallHistory = require("../../models/CallHistory");

describe("CallHistory Model", () => {
    it("should create a valid CallHistory document with default values", () => {
        const callHistoryData = {
            callerId: new mongoose.Types.ObjectId(),
            recieverId: new mongoose.Types.ObjectId(),
            callType: "voice",
            callStatus: "accepted"
        };

        const callHistory = new CallHistory(callHistoryData);
        // Validate synchronously without saving to the database
        const error = callHistory.validateSync();
        expect(error).toBeUndefined();
        expect(callHistory.callDuration).toBe(0);
        expect(callHistory.createdAt).toBeDefined();
    });

    it("should throw a validation error when callerId is missing", () => {
        const callHistoryData = {
            recieverId: new mongoose.Types.ObjectId(),
            callType: "video",
            callStatus: "missed"
        };

        const callHistory = new CallHistory(callHistoryData);
        const error = callHistory.validateSync();
        expect(error.errors.callerId).toBeDefined();
    });
    
    it("should throw a validation error when recieverId is missing", () => {
        const callHistoryData = {
            callerId: new mongoose.Types.ObjectId(),
            callType: "voice",
            callStatus: "accepted"
        };
    
        const callHistory = new CallHistory(callHistoryData);
        const error = callHistory.validateSync();
        expect(error.errors.recieverId).toBeDefined();
    });

    it("should throw a validation error when callType is missing", () => {
        const callHistoryData = {
            callerId: new mongoose.Types.ObjectId(),
            recieverId: new mongoose.Types.ObjectId(),
            callStatus: "accepted"
        };

        const callHistory = new CallHistory(callHistoryData);
        const error = callHistory.validateSync();
        expect(error.errors.callType).toBeDefined();
    });

    it("should throw a validation error when callStatus is missing", () => {
        const callHistoryData = {
            callerId: new mongoose.Types.ObjectId(),
            recieverId: new mongoose.Types.ObjectId(),
            callType: "voice"
        };

        const callHistory = new CallHistory(callHistoryData);
        const error = callHistory.validateSync();
        expect(error.errors.callStatus).toBeDefined();
    });

    it("should throw validation errors for invalid enum values", () => {
        const callHistoryData = {
            callerId: new mongoose.Types.ObjectId(),
            recieverId: new mongoose.Types.ObjectId(),
            callType: "invalidType",
            callStatus: "invalidStatus" 
        };

        const callHistory = new CallHistory(callHistoryData);
        const error = callHistory.validateSync();
        expect(error.errors.callType).toBeDefined();
        expect(error.errors.callStatus).toBeDefined();
    });

    it("should throw a validation error for an invalid callerId", () => {
        const callHistoryData = {
            callerId: "invalidId",
            recieverId: new mongoose.Types.ObjectId(),
            callType: "voice",
            callStatus: "accepted"
        };
    
        const callHistory = new CallHistory(callHistoryData);
        const error = callHistory.validateSync();
        expect(error.errors.callerId).toBeDefined();
    });

    it("should throw a validation error for non-numeric callDuration", () => {
        const callHistoryData = {
            callerId: new mongoose.Types.ObjectId(),
            recieverId: new mongoose.Types.ObjectId(),
            callType: "voice",
            callStatus: "accepted",
            callDuration: "notANumber"
        };
    
        const callHistory = new CallHistory(callHistoryData);
        const error = callHistory.validateSync();
        expect(error.errors.callDuration).toBeDefined();
    });

    it("should throw a validation error for an invalid recieverId", () => {
        const callHistoryData = {
            callerId: new mongoose.Types.ObjectId(),
            recieverId: "invalidId",
            callType: "voice",
            callStatus: "accepted"
        };
    
        const callHistory = new CallHistory(callHistoryData);
        const error = callHistory.validateSync();
        expect(error.errors.recieverId).toBeDefined();
    });

    it("should throw a validation error for an invalid createdAt", () => {
        const callHistoryData = {
            callerId: new mongoose.Types.ObjectId(),
            recieverId: new mongoose.Types.ObjectId(),
            callType: "voice",
            callStatus: "accepted",
            createdAt: "notADate"
        };
    
        const callHistory = new CallHistory(callHistoryData);
        const error = callHistory.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});