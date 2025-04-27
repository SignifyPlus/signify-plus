const mongoose = require('mongoose');
const MongooseService = require('../../../services/MongooseService');
const LoggerFactory = require('../../../factories/loggerFactory');

jest.mock('mongoose');

const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
};

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: mockLogger,
}));

describe('MongooseService', () => {
    let service;
    let mockSession;

    beforeEach(() => {
        service = new MongooseService();
        mockSession = {
            startTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            commitTransaction: jest.fn(),
        };
        jest.clearAllMocks();
    });

    test('connectToMongoDB logs success on connection', async () => {
        mongoose.connect.mockResolvedValue();

        await service.connectToMongoDB('mongodb://localhost/test');

        expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost/test');
        expect(mockLogger.info).toHaveBeenCalledWith('Connected to MongoDB');
    });

    test('connectToMongoDB logs error on failure', async () => {
        const error = new Error('connection failed');
        mongoose.connect.mockImplementation(() => Promise.reject(error));

        await service.connectToMongoDB('mongodb://localhost/test');

        expect(mockLogger.error).toHaveBeenCalledWith('MongoDB connection error:', error);
    });

    test('getMongooseSession returns a session', async () => {
        mongoose.startSession.mockResolvedValue(mockSession);

        const session = await service.getMongooseSession();

        expect(session).toBe(mockSession);
    });

    test('startMongooseTransaction starts transaction with valid session', async () => {
        await service.startMongooseTransaction(mockSession);

        expect(mockSession.startTransaction).toHaveBeenCalled();
    });

    test('startMongooseTransaction throws on invalid session', async () => {
        await expect(service.startMongooseTransaction(null)).rejects.toThrow();
    });

    test('abandonMongooseTransaction aborts transaction', async () => {
        await service.abandonMongooseTransaction(mockSession);

        expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    test('abandonMongooseTransaction throws on invalid session', async () => {
        await expect(service.abandonMongooseTransaction(undefined)).rejects.toThrow();
    });

    test('commitMongooseTransaction commits transaction', async () => {
        await service.commitMongooseTransaction(mockSession);

        expect(mockSession.commitTransaction).toHaveBeenCalled();
    });

    test('commitMongooseTransaction throws on invalid session', async () => {
        await expect(service.commitMongooseTransaction(null)).rejects.toThrow();
    });
});