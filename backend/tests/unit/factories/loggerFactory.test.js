const LoggerFactory = require('../../../factories/loggerFactory');

describe('LoggerFactory Unit Test', () => {
    it('should set and get application logger correctly', () => {
        const mockLogger = { info: jest.fn(), error: jest.fn() };

        LoggerFactory.setApplicationLogger = mockLogger;

        const retrievedLogger = LoggerFactory.getApplicationLogger;
        expect(retrievedLogger).toBe(mockLogger);
    });

    it('should return null if application logger is not set', () => {
        LoggerFactory.setApplicationLogger = null;
        expect(LoggerFactory.getApplicationLogger).toBeNull();
    });
});