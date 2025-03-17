const mongoose = require('mongoose');
const Channel = require("../../models/Channel");

describe("Channel Model", () => {
    it("should create a valid Channel document with default createdAt", () => {
        const channelData = {
            channelName: "General",
            createdBy: new mongoose.Types.ObjectId()
        };
        
        const channel = new Channel(channelData);
        const error = channel.validateSync();
        expect(error).toBeUndefined();
        expect(channel.createdAt).toBeDefined();
    });

    it("should throw a validation error when channelName is missing", () => {
        const channelData = {
            createdBy: new mongoose.Types.ObjectId()
        };
        
        const channel = new Channel(channelData);
        const error = channel.validateSync();
        expect(error.errors.channelName).toBeDefined();
    });

    it("should throw a validation error when createdBy is missing", () => {
        const channelData = {
            channelName: "General"
        };
        
        const channel = new Channel(channelData);
        const error = channel.validateSync();
        expect(error.errors.createdBy).toBeDefined();
    });

    it("should throw a validation error when createdBy is invalid", () => {
        const channelData = {
            channelName: "General",
            createdBy: "invalidId"
        };
        
        const channel = new Channel(channelData);
        const error = channel.validateSync();
        expect(error.errors.createdBy).toBeDefined();
    });

    it("should set createdAt as a valid Date when not provided", () => {
        const channelData = {
            channelName: "General",
            createdBy: new mongoose.Types.ObjectId()
        };
        
        const channel = new Channel(channelData);
        expect(channel.createdAt).toBeInstanceOf(Date);
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const channelData = {
            channelName: "General",
            createdBy: new mongoose.Types.ObjectId(),
            createdAt: "invalidDate"
        };
        
        const channel = new Channel(channelData);
        const error = channel.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});