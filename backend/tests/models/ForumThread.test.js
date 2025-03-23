const mongoose = require('mongoose');
const ForumThread = require('../../models/ForumThread');

describe("ForumThread Model", () => {

    it("should create a valid ForumThread document with default createdAt", () => {
        const forumThreadData = {
            forumId: new mongoose.Types.ObjectId(),
            createdBy: new mongoose.Types.ObjectId(),
            title: "Sample Thread"
        };

        const forumThread = new ForumThread(forumThreadData);
        const error = forumThread.validateSync();
        expect(error).toBeUndefined();
        expect(forumThread.createdAt).toBeDefined();
        expect(forumThread.createdAt).toBeInstanceOf(Date);
    });

    it("should accept a valid custom createdAt", () => {
        const customDate = new Date("2022-01-01T00:00:00Z");
        const forumThreadData = {
            forumId: new mongoose.Types.ObjectId(),
            createdBy: new mongoose.Types.ObjectId(),
            title: "Custom Date Thread",
            createdAt: customDate
        };

        const forumThread = new ForumThread(forumThreadData);
        const error = forumThread.validateSync();
        expect(error).toBeUndefined();
        expect(forumThread.createdAt).toEqual(customDate);
    });

    // Missing fields

    it("should throw a validation error when forumId is missing", () => {
        const forumThreadData = {
            createdBy: new mongoose.Types.ObjectId(),
            title: "No Forum Id Thread"
        };

        const forumThread = new ForumThread(forumThreadData);
        const error = forumThread.validateSync();
        expect(error.errors.forumId).toBeDefined();
    });

    it("should throw a validation error when createdBy is missing", () => {
        const forumThreadData = {
            forumId: new mongoose.Types.ObjectId(),
            title: "No CreatedBy Thread"
        };

        const forumThread = new ForumThread(forumThreadData);
        const error = forumThread.validateSync();
        expect(error.errors.createdBy).toBeDefined();
    });

    it("should create a valid ForumThread document when title is missing", () => {
        const forumThreadData = {
            forumId: new mongoose.Types.ObjectId(),
            createdBy: new mongoose.Types.ObjectId()
        };

        const forumThread = new ForumThread(forumThreadData);
        const error = forumThread.validateSync();
        expect(error).toBeUndefined();
    });

    // Invalid values

    it("should throw a validation error when forumId is invalid", () => {
        const forumThreadData = {
            forumId: "invalidId",
            createdBy: new mongoose.Types.ObjectId(),
            title: "Invalid ForumId Thread"
        };

        const forumThread = new ForumThread(forumThreadData);
        const error = forumThread.validateSync();
        expect(error.errors.forumId).toBeDefined();
    });

    it("should throw a validation error when createdBy is invalid", () => {
        const forumThreadData = {
            forumId: new mongoose.Types.ObjectId(),
            createdBy: "invalidId",
            title: "Invalid CreatedBy Thread"
        };

        const forumThread = new ForumThread(forumThreadData);
        const error = forumThread.validateSync();
        expect(error.errors.createdBy).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const forumThreadData = {
            forumId: new mongoose.Types.ObjectId(),
            createdBy: new mongoose.Types.ObjectId(),
            title: "Invalid Date Thread",
            createdAt: "notADate"
        };

        const forumThread = new ForumThread(forumThreadData);
        const error = forumThread.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });

    it("should throw a validation error when title is of invalid type", () => {
        const forumThreadData = {
        forumId: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
        title: { text: "I am not a string" }
        };

        const forumThread = new ForumThread(forumThreadData);
        const error = forumThread.validateSync();
        expect(error.errors.title).toBeDefined();
    });
});