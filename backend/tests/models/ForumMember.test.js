const mongoose = require('mongoose');
const ForumMember = require('../../models/ForumMember');

describe("ForumMember Model", () => {

    it("should create a valid ForumMember document with default createdAt", () => {
        const forumMemberData = {
            userId: new mongoose.Types.ObjectId(),
            forumId: new mongoose.Types.ObjectId(),
            joinedAt: "2023"
        };

        const forumMember = new ForumMember(forumMemberData);
        const error = forumMember.validateSync();
        expect(error).toBeUndefined();
        expect(forumMember.createdAt).toBeDefined();
        expect(forumMember.createdAt).toBeInstanceOf(Date);
    });

    it("should throw a validation error when userId is missing", () => {
        const forumMemberData = {
            forumId: new mongoose.Types.ObjectId(),
        };

        const forumMember = new ForumMember(forumMemberData);
        const error = forumMember.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when forumId is missing", () => {
        const forumMemberData = {
            userId: new mongoose.Types.ObjectId(),
            joinedAt: "2023"
        };

        const forumMember = new ForumMember(forumMemberData);
        const error = forumMember.validateSync();
        expect(error.errors.forumId).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const forumMemberData = {
            userId: new mongoose.Types.ObjectId(),
            forumId: new mongoose.Types.ObjectId(),
            createdAt: "invalidDate"
        };

        const forumMember = new ForumMember(forumMemberData);
        const error = forumMember.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });

    it("should throw a validation error when userId is invalid", () => {
        const forumMemberData = {
            userId: "invalidId",
            forumId: new mongoose.Types.ObjectId(),
        };

        const forumMember = new ForumMember(forumMemberData);
        const error = forumMember.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when forumId is invalid", () => {
        const forumMemberData = {
            userId: new mongoose.Types.ObjectId(),
            forumId: "invalidId",
        };

        const forumMember = new ForumMember(forumMemberData);
        const error = forumMember.validateSync();
        expect(error.errors.forumId).toBeDefined();
    });
});