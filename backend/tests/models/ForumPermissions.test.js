const mongoose = require('mongoose');
const ForumPermissions = require('../../models/ForumPermissions');

describe("ForumPermissions Model", () => {

    it("should create a valid ForumPermissions document with default createdAt", () => {
        const forumPermissionsData = {
            forumId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            canPost: true,
            canModerate: false
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error).toBeUndefined();
        expect(forumPermissions.createdAt).toBeDefined();
        expect(forumPermissions.createdAt).toBeInstanceOf(Date);
    });

    it("should accept a valid custom createdAt", () => {
        const customDate = new Date('2020-01-01');
        const forumPermissionsData = {
            forumId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            canPost: false,
            canModerate: true,
            createdAt: customDate
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error).toBeUndefined();
        expect(forumPermissions.createdAt).toEqual(customDate);
    });

    // Missing fields

    it("should throw a validation error when forumId is missing", () => {
        const forumPermissionsData = {
            userId: new mongoose.Types.ObjectId(),
            canPost: true,
            canModerate: false,
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error.errors.forumId).toBeDefined();
    });

    it("should throw a validation error when userId is missing", () => {
        const forumPermissionsData = {
            forumId: new mongoose.Types.ObjectId(),
            canPost: true,
            canModerate: false,
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when canPost is missing", () => {
        const forumPermissionsData = {
            forumId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            canModerate: true,
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error.errors.canPost).toBeDefined();
    });

    it("should throw a validation error when canModerate is missing", () => {
        const forumPermissionsData = {
            forumId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            canPost: false,
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error.errors.canModerate).toBeDefined();
    });

    // Invalid field types

    it("should throw a validation error when forumId is invalid", () => {
        const forumPermissionsData = {
            forumId: "invalidId",
            userId: new mongoose.Types.ObjectId(),
            canPost: true,
            canModerate: true,
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error.errors.forumId).toBeDefined();
    });

    it("should throw a validation error when userId is invalid", () => {
        const forumPermissionsData = {
        forumId: new mongoose.Types.ObjectId(),
        userId: "invalidId",
        canPost: true,
        canModerate: true,
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when canPost is not a boolean", () => {
        const forumPermissionsData = {
            forumId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            canPost: "notBoolean",
            canModerate: true,
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error.errors.canPost).toBeDefined();
    });

    it("should throw a validation error when canModerate is not a boolean", () => {
        const forumPermissionsData = {
            forumId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            canPost: false,
            canModerate: "notBoolean",
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error.errors.canModerate).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const forumPermissionsData = {
            forumId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            canPost: true,
            canModerate: true,
            createdAt: "invalidDate"
        };

        const forumPermissions = new ForumPermissions(forumPermissionsData);
        const error = forumPermissions.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});