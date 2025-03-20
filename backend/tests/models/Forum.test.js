const mongoose = require('mongoose');
const Forum = require('../../models/Forum');

describe("Forum Model", () => {
    it("should create a valid Forum document", () => {
        const forumData = {
            forumName: "General Discussion",
            forumDescription: "A forum for general topics",
            forumStatus: true,
            createdBy: new mongoose.Types.ObjectId()
        };

        const forum = new Forum(forumData);
        const error = forum.validateSync();
        expect(error).toBeUndefined();
        expect(forum.createdAt).toBeDefined();
        expect(forum.createdAt).toBeInstanceOf(Date);
    });

    it("should throw a validation error when forumName is missing", () => {
        const forumData = {
            forumDescription: "A forum for general topics",
            forumStatus: true,
            createdBy: new mongoose.Types.ObjectId()
        };

        const forum = new Forum(forumData);
        const error = forum.validateSync();
        expect(error.errors.forumName).toBeDefined();
    });

    it("should throw a validation error when forumDescription is missing", () => {
        const forumData = {
            forumName: "General Discussion",
            forumStatus: true,
            createdBy: new mongoose.Types.ObjectId()
        };

        const forum = new Forum(forumData);
        const error = forum.validateSync();
        expect(error.errors.forumDescription).toBeDefined();
    });

    it("should throw a validation error when forumStatus is missing", () => {
        const forumData = {
            forumName: "General Discussion",
            forumDescription: "A forum for general topics",
            createdBy: new mongoose.Types.ObjectId()
        };

        const forum = new Forum(forumData);
        const error = forum.validateSync();
        expect(error.errors.forumStatus).toBeDefined();
    });

    it("should throw a validation error when createdBy is missing", () => {
        const forumData = {
            forumName: "General Discussion",
            forumDescription: "A forum for general topics",
            forumStatus: true
        };

        const forum = new Forum(forumData);
        const error = forum.validateSync();
        expect(error.errors.createdBy).toBeDefined();
    });

    it("should throw a validation error when forumName is invalid", () => {
        const forumData = {
            forumName: {},
            forumDescription: "A forum for general topics",
            forumStatus: true,
            createdBy: new mongoose.Types.ObjectId()
        };

        const forum = new Forum(forumData);
        const error = forum.validateSync();
        expect(error.errors.forumName).toBeDefined();
    });

    it("should throw a validation error when forumDescription is invalid", () => {
        const forumData = {
            forumName: "General Discussion",
            forumDescription: {},
            forumStatus: true,
            createdBy: new mongoose.Types.ObjectId()
        };

        const forum = new Forum(forumData);
        const error = forum.validateSync();
        expect(error.errors.forumDescription).toBeDefined();
    });

    it("should throw a validation error when forumStatus is invalid", () => {
        const forumData = {
            forumName: "General Discussion",
            forumDescription: "A forum for general topics",
            forumStatus: {},
            createdBy: new mongoose.Types.ObjectId()
        };

        const forum = new Forum(forumData);
        const error = forum.validateSync();
        expect(error.errors.forumStatus).toBeDefined();
    });

    it("should throw a validation error when createdBy is invalid", () => {
        const forumData = {
            forumName: "General Discussion",
            forumDescription: "A forum for general topics",
            forumStatus: true,
            createdBy: "invalidId"
        };

        const forum = new Forum(forumData);
        const error = forum.validateSync();
        expect(error.errors.createdBy).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const forumData = {
            forumName: "General Discussion",
            forumDescription: "A forum for general topics",
            forumStatus: true,
            createdBy: new mongoose.Types.ObjectId(),
            createdAt: "invalidDate"
        };

        const forum = new Forum(forumData);
        const error = forum.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});