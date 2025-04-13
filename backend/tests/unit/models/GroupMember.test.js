const mongoose = require("mongoose");
const GroupMember = require("../../../models/GroupMember");

describe("GroupMember Model", () => {
    it("should create a valid GroupMember with default createdAt", () => {
        const data = {
            groupId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            joinedAt: "2024-01-01"
        };

        const member = new GroupMember(data);
        const error = member.validateSync();
        expect(error).toBeUndefined();
        expect(member.createdAt).toBeInstanceOf(Date);
    });

    //missing fields
    it("should throw a validation error when groupId is missing", () => {
        const data = {
            userId: new mongoose.Types.ObjectId()
        };

        const member = new GroupMember(data);
        const error = member.validateSync();
        expect(error.errors.groupId).toBeDefined();
    });

    it("should throw a validation error when userId is missing", () => {
        const data = {
            groupId: new mongoose.Types.ObjectId()
        };

        const member = new GroupMember(data);
        const error = member.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    //invalid fields
    it("should throw a validation error when groupId is invalid", () => {
        const data = {
            groupId: "not-an-id",
            userId: new mongoose.Types.ObjectId()
        };

        const member = new GroupMember(data);
        const error = member.validateSync();
        expect(error.errors.groupId).toBeDefined();
    });

    it("should throw a validation error when userId is invalid", () => {
        const data = {
            groupId: new mongoose.Types.ObjectId(),
            userId: "invalid-id"
        };

        const member = new GroupMember(data);
        const error = member.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error if joinedAt is invalid", () => {
        const data = {
            groupId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            joinedAt: { test: "invalid" }
        }

        const member = new GroupMember(data);
        const error = member.validateSync();
        expect(error.errors.joinedAt).toBeDefined();
    })

    it("should throw a validation error if createdAt is invalid", () => {
        const data = {
            groupId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            createdAt: "invalid-date"
        };

        const member = new GroupMember(data);
        const error = member.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});