const mongoose = require('mongoose');
const Notification = require('../../models/Notification');

describe("Notification Model", () => {
    
    it("should create a valid Notification document with default createdAt", () => {
        const notificationData = {
            userId: new mongoose.Types.ObjectId(),
            isRead: false
        };

        const notification = new Notification(notificationData);
        const error = notification.validateSync();
        expect(error).toBeUndefined();
        expect(notification.createdAt).toBeDefined();
        expect(notification.createdAt).toBeInstanceOf(Date);
    });

    it("should create a valid Notification document when isRead is true", () => {
        const notificationData = {
            userId: new mongoose.Types.ObjectId(),
            isRead: true
        };

        const notification = new Notification(notificationData);
        const error = notification.validateSync();
        expect(error).toBeUndefined();
        expect(notification.isRead).toBe(true);
    });

    // Missing Fields

    it("should throw a validation error when userId is missing", () => {
        const notificationData = {
            isRead: false
        };

        const notification = new Notification(notificationData);
        const error = notification.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    // Invalid Fields

    it("should throw a validation error when userId is invalid", () => {
        const notificationData = {
            userId: "invalidId",
            isRead: false
        };

        const notification = new Notification(notificationData);
        const error = notification.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when isRead is invalid", () => {
        const notificationData = {
            userId: new mongoose.Types.ObjectId(),
            isRead: "invalidIsRead"
        };

        const notification = new Notification(notificationData);
        const error = notification.validateSync();
        expect(error.errors.isRead).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const notificationData = {
            userId: new mongoose.Types.ObjectId(),
            isRead: false,
            createdAt: "invalidDate"
        };

        const notification = new Notification(notificationData);
        const error = notification.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});