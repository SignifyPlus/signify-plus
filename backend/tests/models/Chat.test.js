const mongoose = require('mongoose');
const Chat = require("../../models/Chat");

describe("Chat Model", () => {
    it("should create a valid Chat document with default createdAt", () => {
        const chatData = {
            mainUserId: new mongoose.Types.ObjectId(),
            participants: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
        };
        
        const chat = new Chat(chatData);
        const error = chat.validateSync();
        expect(error).toBeUndefined();
        expect(chat.createdAt).toBeDefined();
        expect(chat.createdAt).toBeInstanceOf(Date);
    });

    it("should throw a validation error when mainUserId is missing", () => {
        const chatData = {
            participants: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
        };

        const chat = new Chat(chatData);
        const error = chat.validateSync();
        expect(error.errors.mainUserId).toBeDefined();
    });

    it("should throw a validation error when participants is missing", () => {
        const chatData = {
            mainUserId: new mongoose.Types.ObjectId()
        };

        const chat = new Chat(chatData);
        const error = chat.validateSync();
        expect(error.errors.participants).toBeDefined();
    });

    it("should throw a validation error for an invalid mainUserId", () => {
        const chatData = {
            mainUserId: "invalidId",
            participants: [new mongoose.Types.ObjectId()]
        };

        const chat = new Chat(chatData);
        const error = chat.validateSync();
        expect(error.errors.mainUserId).toBeDefined();
    });

    it("should throw a validation error for an invalid participant id", () => {
        const chatData = {
            mainUserId: new mongoose.Types.ObjectId(),
            participants: ["invalidId", new mongoose.Types.ObjectId()]
        };

        const chat = new Chat(chatData);
        const error = chat.validateSync();
        expect(error.errors["participants.0"]).toBeDefined();
    });

    it("should throw a validation error for an invalid createdAt", () => {
        const chatData = {
            mainUserId: new mongoose.Types.ObjectId(),
            participants: [new mongoose.Types.ObjectId()],
            createdAt: "invalidDate"
        };
    
        const chat = new Chat(chatData);
        const error = chat.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});