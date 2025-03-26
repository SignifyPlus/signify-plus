const mongoose = require('mongoose');
const Settings = require('../../models/Settings');

describe("Settings Model", () => {

    it("should create a valid Settings document with default values", () => {
        const settingsData = {
            userId: new mongoose.Types.ObjectId()
        };

        const settings = new Settings(settingsData);
        const error = settings.validateSync();
        expect(error).toBeUndefined();
        expect(settings.theme).toBe('Light');
        expect(settings.autoDownload).toBe(false);
        expect(settings.notificationEnabled).toBe(true);
        expect(settings.createdAt).toBeDefined();
        expect(settings.createdAt).toBeInstanceOf(Date);
        expect(settings.updatedAt).toBeDefined();
        expect(settings.updatedAt).toBeInstanceOf(Date);
    });

    it("should accept a valid theme value 'Dark'", () => {
        const settingsData = {
            userId: new mongoose.Types.ObjectId(),
            theme: 'Dark'
        };

        const settings = new Settings(settingsData);
        const error = settings.validateSync();
        expect(error).toBeUndefined();
        expect(settings.theme).toBe('Dark');
    });

    // Missing fields

    it("should throw a validation error when userId is missing", () => {
        const settingsData = {
            theme: 'Dark'
        };

        const settings = new Settings(settingsData);
        const error = settings.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    // Invalid fields

    it("should throw a validation error when userId is invalid", () => {
        const settingsData = {
            userId: "invalidId"
        };
        const settings = new Settings(settingsData);
        const error = settings.validateSync();
        expect(error.errors.userId).toBeDefined();
    });

    it("should throw a validation error when theme is invalid", () => {
        const settingsData = {
            userId: new mongoose.Types.ObjectId(),
            theme: 'Blue'
        };

        const settings = new Settings(settingsData);
        const error = settings.validateSync();
        expect(error.errors.theme).toBeDefined();
    });

    it("should throw a validation error when createdAt is invalid", () => {
        const settingsData = {
        userId: new mongoose.Types.ObjectId(),
        createdAt: "notADate"
        };

        const settings = new Settings(settingsData);
        const error = settings.validateSync();
        expect(error.errors.createdAt).toBeDefined();
    });

    it("should throw a validation error when updatedAt is invalid", () => {
            const settingsData = {
            userId: new mongoose.Types.ObjectId(),
            updatedAt: "notADate"
        };

        const settings = new Settings(settingsData);
        const error = settings.validateSync();
        expect(error.errors.updatedAt).toBeDefined();
    });

    it("should accept valid custom createdAt and updatedAt values", () => {
            const customCreatedAt = new Date('2022-01-01T00:00:00Z');
            const customUpdatedAt = new Date('2022-02-01T00:00:00Z');
            const settingsData = {
            userId: new mongoose.Types.ObjectId(),
            createdAt: customCreatedAt,
            updatedAt: customUpdatedAt
        };
    
        const settings = new Settings(settingsData);
        const error = settings.validateSync();
        expect(error).toBeUndefined();
        expect(settings.createdAt).toEqual(customCreatedAt);
        expect(settings.updatedAt).toEqual(customUpdatedAt);
    });

});