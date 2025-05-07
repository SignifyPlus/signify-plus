const AmazonConstants = require('../../../constants/amazonConstants');

describe('AmazonConstants', () => {
    it('should have PUBLIC_READ equal "public-read"', () => {
        expect(AmazonConstants.PUBLIC_READ).toBe('public-read');
    });

    it('should not allow modification of PUBLIC_READ', () => {
        const original = AmazonConstants.PUBLIC_READ;
        AmazonConstants.PUBLIC_READ = 'modified';
        expect(AmazonConstants.PUBLIC_READ).toBe(original);
    });
});
