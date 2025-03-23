const mongoose = require('mongoose');
const Message = require('../../models/Message');

describe("Message Model", () => {

    it("should create a valid Message document with default createdAt", () => {
        const messageData = {
            senderId: new mongoose.Types.ObjectId(),
            receiverIds: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
            chatId: new mongoose.Types.ObjectId(),
            mediaId: new mongoose.Types.ObjectId(),
            messageType: "text",
            content: "Hello, world!",
            status: true
        };

        const message = new Message(messageData);
        const error = message.validateSync();
        expect(error).toBeUndefined();
        expect(message.createdAt).toBeDefined();
        expect(message.createdAt).toBeInstanceOf(Date);
    });

    it("should create a valid Message document when optional fields are omitted", () => {
        const messageData = {
            senderId: new mongoose.Types.ObjectId(),
            receiverIds: [new mongoose.Types.ObjectId()],
            chatId: new mongoose.Types.ObjectId(),
            content: "Hello, world!"
        };

        const message = new Message(messageData);
        const error = message.validateSync();
        expect(error).toBeUndefined();
        expect(message.createdAt).toBeDefined();
        expect(message.createdAt).toBeInstanceOf(Date);
    });

    // Missing Fields

    it("should throw a validation error when senderId is missing", () => {
        const messageData = {
            receiverIds: [new mongoose.Types.ObjectId()],
            chatId: new mongoose.Types.ObjectId(),
            content: "Hello, world!"
        };

        const message = new Message(messageData);
        const error = message.validateSync();
        expect(error.errors.senderId).toBeDefined();
    });

    it("should throw a validation error when receiverIds is missing", () => {
        const messageData = {
            senderId: new mongoose.Types.ObjectId(),
            chatId: new mongoose.Types.ObjectId(),
            content: "Hello, world!"
        };

        const message = new Message(messageData);
        const error = message.validateSync();
        expect(error.errors.receiverIds).toBeDefined();
    });

    it("should throw a validation error when chatId is missing", () => {
        const messageData = {
            senderId: new mongoose.Types.ObjectId(),
            receiverIds: [new mongoose.Types.ObjectId()],
            content: "Hello, world!"
        };

        const message = new Message(messageData);
        const error = message.validateSync();
        expect(error.errors.chatId).toBeDefined();
    });

    it("should throw a validation error when content is missing", () => {
        const messageData = {
            senderId: new mongoose.Types.ObjectId(),
            receiverIds: [new mongoose.Types.ObjectId()],
            chatId: new mongoose.Types.ObjectId()
        };

        const message = new Message(messageData);
        const error = message.validateSync();
        expect(error.errors.content).toBeDefined();
    });

    // Invalid Fields

    it("should throw a validation error when senderId is invalid", () => {
        const messageData = {
            senderId: "invalidId",
            receiverIds: [new mongoose.Types.ObjectId()],
            chatId: new mongoose.Types.ObjectId(),
            content: "Hello, world!"
        };

        const message = new Message(messageData);
        const error = message.validateSync();
        expect(error.errors.senderId).toBeDefined();
    });

    it("should throw a validation error when chatId is invalid", () => {
        const messageData = {
            senderId: new mongoose.Types.ObjectId(),
            receiverIds: [new mongoose.Types.ObjectId()],
            chatId: "invalidId",
            content: "Hello, world!"
        };

        const message = new Message(messageData);
        const error = message.validateSync();
        expect(error.errors.chatId).toBeDefined();
    });

    it("should throw a validation error when receiverIds contains an invalid ObjectId", () => {
        const messageData = {
            senderId: new mongoose.Types.ObjectId(),
            receiverIds: ["invalidId", new mongoose.Types.ObjectId()],
            chatId: new mongoose.Types.ObjectId(),
            content: "Hello, world!"
        };

        const message = new Message(messageData);
        const error = message.validateSync();
        expect(error.errors['receiverIds.0']).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const messageData = {
            senderId: new mongoose.Types.ObjectId(),
            receiverIds: [new mongoose.Types.ObjectId()],
            chatId: new mongoose.Types.ObjectId(),
            content: "Hello, world!",
            createdAt: "notADate"
        };

        const message = new Message(messageData);
        const error = message.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});