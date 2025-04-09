const mongoose = require('mongoose');
const ThreadComment = require('../../models/ThreadComment');

describe("ThreadComment Model", () => {

    it("should create a valid ThreadComment document with default createdAt", () => {
        const threadCommentData = {
            threadId: new mongoose.Types.ObjectId(),
            commentId: new mongoose.Types.ObjectId(),
        };

        const threadComment = new ThreadComment(threadCommentData);
        const error = threadComment.validateSync();
        expect(error).toBeUndefined();
        expect(threadComment.createdAt).toBeDefined();
        expect(threadComment.createdAt).toBeInstanceOf(Date);
    });

    it("should throw a validation error when threadId is missing", () => {
        const threadCommentData = {
            commentId: new mongoose.Types.ObjectId(),
        };

        const threadComment = new ThreadComment(threadCommentData);
        const error = threadComment.validateSync();
        expect(error.errors.threadId).toBeDefined();
    });

    it("should throw a validation error when commentId is missing", () => {
        const threadCommentData = {
            threadId: new mongoose.Types.ObjectId(),
        };

        const threadComment = new ThreadComment(threadCommentData);
        const error = threadComment.validateSync();
        expect(error.errors.commentId).toBeDefined();
    });

    it("should throw a validation error when threadId is invalid", () => {
        const threadCommentData = {
            threadId: "invalidId",
            commentId: new mongoose.Types.ObjectId(),
        };

        const threadComment = new ThreadComment(threadCommentData);
        const error = threadComment.validateSync();
        expect(error.errors.threadId).toBeDefined();
    });

    it("should throw a validation error when commentId is invalid", () => {
        const threadCommentData = {
            threadId: new mongoose.Types.ObjectId(),
            commentId: "invalidId"
        };

        const threadComment = new ThreadComment(threadCommentData);
        const error = threadComment.validateSync();
        expect(error.errors.commentId).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const threadCommentData = {
            threadId: new mongoose.Types.ObjectId(),
            commentId: new mongoose.Types.ObjectId(),
            createdAt: "invalidDate"
        };

        const threadComment = new ThreadComment(threadCommentData);
        const error = threadComment.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });


});