const ServerConstants = require('../../../constants/serverConstants.js');

describe('ServerConstants Unit Test', () => {
    it('should have correct LOG_LEVEL_DEBUG', () => {
        expect(ServerConstants.LOG_LEVEL_DEBUG).toBe('debug');
    });

    it('should have correct LOG_LEVEL_INFOR', () => {
        expect(ServerConstants.LOG_LEVEL_INFOR).toBe('info');
    });
});