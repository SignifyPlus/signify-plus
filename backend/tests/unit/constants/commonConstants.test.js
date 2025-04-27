const CommonConstants = require('../../../constants/commonConstants.js');

describe('CommonConstants Unit Test', () => {
    it('should have BUFFER_ENCODING as utf-8', () => {
        expect(CommonConstants.BUFFER_ENCODING).toBe('utf-8');
    });

    it('should have BASE_64 as base64', () => {
        expect(CommonConstants.BASE_64).toBe('base64');
    });

    it('should have FIRST_ENTRY as 0', () => {
        expect(CommonConstants.FIRST_ENTRY).toBe(0);
    });
});