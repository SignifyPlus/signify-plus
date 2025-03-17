const mongoose = require('mongoose');
const ChannelSubscriber = require("../../models/ChannelSubscriber");

describe("ChannelSubscriber Model", () => {

    it("should create a valid ChannelSubscriber document with default subscribedAt", () => {
        const subscriberData = {
            channelId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            status: true
        };
        
        const subscriber = new ChannelSubscriber(subscriberData);
        const error = subscriber.validateSync();
        expect(error).toBeUndefined();
        expect(subscriber.subscribedAt).toBeDefined();
        expect(subscriber.subscribedAt).toBeInstanceOf(Date);
    });

    it("should throw a validation error when channelId is missing", () => {
        const subscriberData = {
            userId: new mongoose.Types.ObjectId(),
            status: true
        };
        
        const subscriber = new ChannelSubscriber(subscriberData);
        const error = subscriber.validateSync();
        expect(error.errors.channelId).toBeDefined();
    });

    it("should throw a validation error when userId is missing", () => {
        const subscriberData = {
            channelId: new mongoose.Types.ObjectId(),
            status: true
        };
        
        const subscriber = new ChannelSubscriber(subscriberData);
        const error = subscriber.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when status is missing", () => {
        const subscriberData = {
            channelId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId()
        };
        
        const subscriber = new ChannelSubscriber(subscriberData);
        const error = subscriber.validateSync();
        expect(error.errors.status).toBeDefined();
    });

    it("should throw a validation error for an invalid channelId", () => {
        const subscriberData = {
            channelId: "invalidId",
            userId: new mongoose.Types.ObjectId(),
            status: true
        };
        
        const subscriber = new ChannelSubscriber(subscriberData);
        const error = subscriber.validateSync();
        expect(error.errors.channelId).toBeDefined();
    });

    it("should throw a validation error for an invalid userId", () => {
        const subscriberData = {
            channelId: new mongoose.Types.ObjectId(),
            userId: "invalidId",
            status: true
        };
        
        const subscriber = new ChannelSubscriber(subscriberData);
        const error = subscriber.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when subscribedAt is invalid", () => {
        const subscriberData = {
            channelId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            status: true,
            subscribedAt: "invalidDate"
        };
        
        const subscriber = new ChannelSubscriber(subscriberData);
        const error = subscriber.validateSync();
        expect(error.errors.subscribedAt).toBeDefined();
    });

    it("should throw a validation error when status is not a boolean", () => {
        const subscriberData = {
            channelId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            status: "notBoolean"
        };
        
        const subscriber = new ChannelSubscriber(subscriberData);
        const error = subscriber.validateSync();
        expect(error.errors.status).toBeDefined();
    });
});