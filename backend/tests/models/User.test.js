const mongoose = require('mongoose');
const User = require('../../models/User');

describe("User Model", () => {

    it("should create a valid User document with default createdAt", () => {
        const userData = {
            name: "John Doe",
            phoneNumber: "1234567890",
            password: "securePassword",
            profilePicture: "https://example.com/profile.jpg"
        };

        const user = new User(userData);
        const error = user.validateSync();
        expect(error).toBeUndefined();
        expect(user.createdAt).toBeDefined();
        expect(user.createdAt).toBeInstanceOf(Date);
    });

    it("should create a valid User document without profilePicture", () => {
        const userData = {
            name: "Jane Doe",
            phoneNumber: "0987654321",
            password: "anotherPassword"
        };

        const user = new User(userData);
        const error = user.validateSync();
        expect(error).toBeUndefined();
        expect(user.profilePicture).toBeUndefined();
        expect(user.createdAt).toBeDefined();
        expect(user.createdAt).toBeInstanceOf(Date);
    });

    it("should throw a validation error when name is missing", () => {
        const userData = {
            phoneNumber: "1234567890",
            password: "securePassword"
        };

        const user = new User(userData);
        const error = user.validateSync();
        expect(error.errors.name).toBeDefined();
    });

    it("should throw a validation error when phoneNumber is missing", () => {
        const userData = {
            name: "John Doe",
            password: "securePassword"
        };

        const user = new User(userData);
        const error = user.validateSync();
        expect(error.errors.phoneNumber).toBeDefined();
    });

    it("should throw a validation error when password is missing", () => {
        const userData = {
            name: "John Doe",
            phoneNumber: "1234567890"
        };

        const user = new User(userData);
        const error = user.validateSync();
        expect(error.errors.password).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const userData = {
            name: "John Doe",
            phoneNumber: "1234567890",
            password: "securePassword",
            createdAt: "invalidDate"
        };

        const user = new User(userData);
        const error = user.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });
});