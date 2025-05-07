const mongoose = require("mongoose");
const Group = require("../../../models/Group");

describe("Group Model", () => {
    it("should create a valid Group document with default createdAt", () => {
        const groupData = {
            groupName: "Study Buddies",
            createdBy: new mongoose.Types.ObjectId(),
        };

        const group = new Group(groupData);
        const error = group.validateSync();
        expect(error).toBeUndefined();
        expect(group.createdAt).toBeInstanceOf(Date);
    });

    it("should accept optional profilePicture", () => {
        const groupData = {
            groupName: "With Picture",
            createdBy: new mongoose.Types.ObjectId(),
            profilePicture: "image.png",
        };

        const group = new Group(groupData);
        const error = group.validateSync();

        expect(error).toBeUndefined();
        expect(group.profilePicture).toBe("image.png");
    });

    //missing fields
    it("should throw a validation error when groupName is missing", () => {
        const groupData = {
            createdBy: new mongoose.Types.ObjectId(),
        };

        const group = new Group(groupData);
        const error = group.validateSync();
        expect(error.errors.groupName).toBeDefined();
    });

    it("should throw a validation error when createdBy is missing", () => {
        const groupData = {
            groupName: "Team Alpha",
        };

        const group = new Group(groupData);
        const error = group.validateSync();
        expect(error.errors.createdBy).toBeDefined();
    });

    //invalid fields
    it("should throw a validation error when createdBy is invalid", () => {
        const groupData = {
            groupName: "Team Beta",
            createdBy: "not-an-object-id",
        };

        const group = new Group(groupData);
        const error = group.validateSync();
        expect(error.errors.createdBy).toBeDefined();
    });

    it("should throw a validation error when groupName is invalid", () => {
        const groupData = {
            groupName:  { text: "Not a string" },
            createdBy: new mongoose.Types.ObjectId(),
        };
    
        const group = new Group(groupData);
        const error = group.validateSync();
        expect(error.errors.groupName).toBeDefined();
    });

    it("should throw a validation error when profilePicture is invalid", () => {
        const groupData = {
            groupName: "Photo Group",
            createdBy: new mongoose.Types.ObjectId(),
            profilePicture: { url: "https://example.com/image.jpg" },
        };

        const group = new Group(groupData);
        const error = group.validateSync();
        expect(error.errors.profilePicture).toBeDefined();
    });

    it("should throw a validation error if createdAt is invalid", () => {
        const groupData = {
            groupName: "Time Travel Club",
            createdBy: new mongoose.Types.ObjectId(),
            createdAt: "not-a-date",
        };

        const group = new Group(groupData);
        const error = group.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});