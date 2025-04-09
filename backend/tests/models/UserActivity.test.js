const mongoose = require("mongoose");
const UserActivity = require("../../models/UserActivity");

describe("UserActivity Model", () => {

    it("should create a valid UserActivity document with default createdAt", () => {
        const activityData = {
            userId: new mongoose.Types.ObjectId(),
            type: "login"
        };

        const activity = new UserActivity(activityData);
        const error = activity.validateSync();
        expect(error).toBeUndefined();
        expect(activity.createdAt).toBeDefined();
        expect(activity.createdAt).toBeInstanceOf(Date);
    });

    it("should accept a valid custom createdAt value", () => {
        const customDate = new Date("2023-01-01T00:00:00Z");
        const activityData = {
            userId: new mongoose.Types.ObjectId(),
            type: "logout",
            createdAt: customDate
        };

        const activity = new UserActivity(activityData);
        const error = activity.validateSync();
        expect(error).toBeUndefined();
        expect(activity.createdAt).toEqual(customDate);
    });

    it("should throw a validation error when userId is missing", () => {
        const activityData = {
            type: "login"
        };

        const activity = new UserActivity(activityData);
        const error = activity.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when type is missing", () => {
        const activityData = {
            userId: new mongoose.Types.ObjectId()
        };

        const activity = new UserActivity(activityData);
        const error = activity.validateSync();
        expect(error.errors.type).toBeDefined();
    });

    it("should throw a validation error when userId is invalid", () => {
        const activityData = {
            userId: "invalidId",
            type: "login"
        };

        const activity = new UserActivity(activityData);
        const error = activity.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when type is invalid", () => {
        const activityData = {
            userId: new mongoose.Types.ObjectId(),
            type: null
        };
    
        const activity = new UserActivity(activityData);
        const error = activity.validateSync();
        expect(error.errors.type).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const activityData = {
            userId: new mongoose.Types.ObjectId(),
            type: "login",
            createdAt: "invalidDate"
        };
    
        const activity = new UserActivity(activityData);
        const error = activity.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });

});