const mongoose = require('mongoose');
const Media = require('../../models/Media');

describe("Media Model", () => {

    it("should create a valid Media document with default createdAt", () => {
        const mediaData = {
            userId: new mongoose.Types.ObjectId(),
            type: "image",
            media: [
                "https://s3.amazonaws.com/bucket/image.png",
                "https://s3.amazonaws.com/bucket/image2.png"
            ]
        };

        const media = new Media(mediaData);
        const error = media.validateSync();
        expect(error).toBeUndefined();
        expect(media.createdAt).toBeDefined();
        expect(media.createdAt).toBeInstanceOf(Date);
    });

    it("should create a valid Media document when only required fields are provided", () => {
        const mediaData = {
            userId: new mongoose.Types.ObjectId()
        };

        const media = new Media(mediaData);
        const error = media.validateSync();
        expect(error).toBeUndefined();
        expect(media.createdAt).toBeDefined();
        expect(media.createdAt).toBeInstanceOf(Date);
    });

    // Missing required fields

    it("should throw a validation error when userId is missing", () => {
        const mediaData = {
            type: "video",
            media: ["https://s3.amazonaws.com/bucket/video.mp4"]
        };

        const media = new Media(mediaData);
        const error = media.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    // Invalid fields

    it("should throw a validation error when userId is invalid", () => {
        const mediaData = {
            userId: "invalidId",
            type: "gif",
            media: ["https://s3.amazonaws.com/bucket/animation.gif"]
        };

        const media = new Media(mediaData);
        const error = media.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when type is not one of the allowed values", () => {
        const mediaData = {
            userId: new mongoose.Types.ObjectId(),
            type: "document",
            media: ["https://s3.amazonaws.com/bucket/file.doc"]
        };

        const media = new Media(mediaData);
        const error = media.validateSync();
        expect(error.errors.type).toBeDefined();
    });

    it("should throw a validation error when media array contains non-string elements", () => {
        const mediaData = {
            userId: new mongoose.Types.ObjectId(),
            type: "image",
            media: [{ not: "a string" }]
        };

        const media = new Media(mediaData);
        const error = media.validateSync();
        expect(error.errors['media.0']).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const mediaData = {
            userId: new mongoose.Types.ObjectId(),
            type: "video",
            media: ["https://s3.amazonaws.com/bucket/video.mp4"],
            createdAt: "invalidDate"
        };

        const media = new Media(mediaData);
        const error = media.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});