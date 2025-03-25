const mongoose = require('mongoose');
const Reaction = require('../../models/Reaction');

describe("Reaction Model", () => {

    it("should create a valid Reaction document with default createdAt", () => {
        const reactionData = {
            messageId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            type: 'like'
        };
        
        const reaction = new Reaction(reactionData);
        const error = reaction.validateSync();
        expect(error).toBeUndefined();
        expect(reaction.createdAt).toBeDefined();
        expect(reaction.createdAt).toBeInstanceOf(Date);
    });

    it("should create a valid Reaction document with type 'love'", () => {
        const reactionData = {
            messageId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            type: 'love'
        };
        
        const reaction = new Reaction(reactionData);
        const error = reaction.validateSync();
        expect(error).toBeUndefined();
        expect(reaction.type).toBe('love');
    });

    // Missing fields

    it("should throw a validation error when messageId is missing", () => {
        const reactionData = {
            userId: new mongoose.Types.ObjectId(),
            type: 'laugh'
        };
        
        const reaction = new Reaction(reactionData);
        const error = reaction.validateSync();
        expect(error.errors.messageId).toBeDefined();
    });

    it("should throw a validation error when userId is missing", () => {
        const reactionData = {
            messageId: new mongoose.Types.ObjectId(),
            type: 'like'
        };
        
        const reaction = new Reaction(reactionData);
        const error = reaction.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    // Invalid values

    it("should throw a validation error when messageId is invalid", () => {
        const reactionData = {
            messageId: 'invalidId',
            userId: new mongoose.Types.ObjectId(),
            type: 'love'
        };
        
        const reaction = new Reaction(reactionData);
        const error = reaction.validateSync();
        expect(error.errors.messageId).toBeDefined();
    });

    it("should throw a validation error when userId is invalid", () => {
        const reactionData = {
            messageId: new mongoose.Types.ObjectId(),
            userId: 'invalidId',
            type: 'laugh'
        };
        
        const reaction = new Reaction(reactionData);
        const error = reaction.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when type is not one of the allowed values", () => {
        const reactionData = {
            messageId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            type: 'angry'
        };
        
        const reaction = new Reaction(reactionData);
        const error = reaction.validateSync();
        expect(error.errors.type).toBeDefined();
    });

    it("should allow type to be undefined when not provided", () => {
        const reactionData = {
            messageId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId()
        };
        
        const reaction = new Reaction(reactionData);
        const error = reaction.validateSync();
        expect(error).toBeUndefined();
        expect(reaction.type).toBeUndefined();
    });
});