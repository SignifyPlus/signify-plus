const mongoose = require('mongoose');
const Contact = require("../../models/Contact");

describe("Contact Model", () => {
    it("should create a valid Contact document with default createdAt", () => {
        const contactData = {
            userId: new mongoose.Types.ObjectId(),
            contactUserId: new mongoose.Types.ObjectId(),
            status: true
        };

        const contact = new Contact(contactData);
        const error = contact.validateSync();
        expect(error).toBeUndefined();
        expect(contact.createdAt).toBeDefined();
        expect(contact.createdAt).toBeInstanceOf(Date);
    });

    it("should throw a validation error when userId is missing", () => {
        const contactData = {
            contactUserId: new mongoose.Types.ObjectId(),
            status: true
        };

        const contact = new Contact(contactData);
        const error = contact.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when contactUserId is missing", () => {
        const contactData = {
            userId: new mongoose.Types.ObjectId(),
            status: true
        };

        const contact = new Contact(contactData);
        const error = contact.validateSync();
        expect(error.errors.contactUserId).toBeDefined();
    });

    it("should throw a validation error when status is missing", () => {
        const contactData = {
            userId: new mongoose.Types.ObjectId(),
            contactUserId: new mongoose.Types.ObjectId()
        };

        const contact = new Contact(contactData);
        const error = contact.validateSync();
        expect(error.errors.status).toBeDefined();
    });

    it("should throw a validation error for an invalid userId", () => {
        const contactData = {
            userId: "invalidId",
            contactUserId: new mongoose.Types.ObjectId(),
            status: true
        };

        const contact = new Contact(contactData);
        const error = contact.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error for an invalid contactUserId", () => {
        const contactData = {
            userId: new mongoose.Types.ObjectId(),
            contactUserId: "invalidId",
            status: true
        };

        const contact = new Contact(contactData);
        const error = contact.validateSync();
        expect(error.errors.contactUserId).toBeDefined();
    });

    it("should throw a validation error when status is not a boolean", () => {
        const contactData = {
            userId: new mongoose.Types.ObjectId(),
            contactUserId: new mongoose.Types.ObjectId(),
            status: "notABoolean"
        };

        const contact = new Contact(contactData);
        const error = contact.validateSync();
        expect(error.errors.status).toBeDefined();
    });

    it("should throw a validation error for an invalid createdAt", () => {
        const contactData = {
            userId: new mongoose.Types.ObjectId(),
            contactUserId: new mongoose.Types.ObjectId(),
            status: true,
            createdAt: "invalidDate"
        };

        const contact = new Contact(contactData);
        const error = contact.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});