const ServerConstants = require('../../../constants/serverConstants.js');

describe('ServerConstants Unit Test', () => {
    it('should have correct LOG_LEVEL_DEBUG', () => {
        expect(ServerConstants.LOG_LEVEL_DEBUG).toBe('debug');
    });

    it('should have correct LOG_LEVEL_INFOR', () => {
        expect(ServerConstants.LOG_LEVEL_INFOR).toBe('info');
    });

    it('should not allow modification of constants', () => {
        const origDebug = ServerConstants.LOG_LEVEL_DEBUG;
        const origInfo  = ServerConstants.LOG_LEVEL_INFOR;

        ServerConstants.LOG_LEVEL_DEBUG = 'modified';
        ServerConstants.LOG_LEVEL_INFOR = 'modified';

        expect(ServerConstants.LOG_LEVEL_DEBUG).toBe(origDebug);
        expect(ServerConstants.LOG_LEVEL_INFOR).toBe(origInfo);
    });
});