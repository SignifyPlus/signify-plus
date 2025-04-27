const SignifyException = require('../../../exception/SignifyException');

describe('SignifyException Unit Test', () => {
    it('should correctly assign status and message', () => {
        const exception = new SignifyException(404, 'Not Found');
        expect(exception.status).toBe(404);
        expect(exception.message).toBe('Not Found');
    });

    it('should return correct object from loadResult', () => {
        const exception = new SignifyException(500, 'Server Error');
        const result = exception.loadResult();
        expect(result).toEqual({
            StatusCode: 500,
            Message: 'Server Error',
        });
    });
});
