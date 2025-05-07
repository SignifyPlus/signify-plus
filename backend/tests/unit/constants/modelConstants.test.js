const ModelConstants = require('../../../constants/modelConstants.js');

describe('ModelConstants Unit Test', () => {
    it('should have correct FORUM_DEFAULT_DESCRIPTION', () => {
        expect(ModelConstants.FORUM_DEFAULT_DESCRIPTION).toBe('Signify Forum');
    });

    it('should not allow modification of FORUM_DEFAULT_DESCRIPTION', () => {
        const original = ModelConstants.FORUM_DEFAULT_DESCRIPTION;
        ModelConstants.FORUM_DEFAULT_DESCRIPTION = 'Modified Description';
        expect(ModelConstants.FORUM_DEFAULT_DESCRIPTION).toBe(original);
    });
});
