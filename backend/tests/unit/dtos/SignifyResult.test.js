const SignifyResult = require('../../../dtos/SignifyResult');

describe('SignifyResult Unit Test', () => {
    it('should create a result with only data (OK case)', () => {
        const result = new SignifyResult('Success!', null);
        expect(result.data).toBe('Success!');
        expect(result.exception).toBe(null);
    });

    it('should create a result with only exception (Error case)', () => {
        const result = new SignifyResult(null, 'Something went wrong');
        expect(result.data).toBe(null);
        expect(result.exception).toBe('Something went wrong');
    });

    it('should create a result with both data and exception (Edge case)', () => {
        const result = new SignifyResult('Partial success', 'Minor issue');
        expect(result.data).toBe('Partial success');
        expect(result.exception).toBe('Minor issue');
    });

    it('should create a result with no arguments (Empty case)', () => {
        const result = new SignifyResult();
        expect(result.data).toBe(null);
        expect(result.exception).toBe(null);
    });
});