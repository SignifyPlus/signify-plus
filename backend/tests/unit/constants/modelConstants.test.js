const ModelConstants = require('../../../constants/modelConstants.js');

describe('ModelConstants Unit Test', () => {
    it('should have correct FORUM_DEFAULT_DESCRIPTION', () => {
        expect(ModelConstants.FORUM_DEFAULT_DESCRIPTION).toBe('Signify Forum');
    });
});
