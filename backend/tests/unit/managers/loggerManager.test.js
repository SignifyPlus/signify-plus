const LoggerManager = require('../../../managers/loggerManager');
const Pino = require('pino');

jest.mock('pino', () => jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
})));

describe('LoggerManager Unit Test', () => {
    let loggerManager;

    beforeEach(() => {
        loggerManager = new LoggerManager();
        jest.clearAllMocks();
    });

    it('should create a logger with correct log level', async () => {
        const logger = await loggerManager.createLogger('debug');
        
        expect(Pino).toHaveBeenCalledWith({
        level: 'debug',
        transport: {
            target: 'pino-pretty',
            options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            },
        },
        });

        expect(logger).toHaveProperty('info');
        expect(logger).toHaveProperty('error');
    });
});
