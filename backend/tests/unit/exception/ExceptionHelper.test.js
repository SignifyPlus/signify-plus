const ExceptionHelper = require('../../../exception/ExceptionHelper');
const SignifyException = require('../../../exception/SignifyException');

jest.mock('../../../exception/SignifyException');

describe('ExceptionHelper Unit Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a SignifyException if field is undefined', async () => {
        const mockSignifyException = { status: 400, loadResult: jest.fn().mockReturnValue('error') };
        SignifyException.mockImplementation(() => mockSignifyException);

        const result = await ExceptionHelper.validate(undefined, 400, 'Field is missing');

        expect(result).toBe(mockSignifyException);
        expect(SignifyException).toHaveBeenCalledWith(400, 'Field is missing');
    });

    it('should return a SignifyException if field is null', async () => {
        const mockSignifyException = { status: 404, loadResult: jest.fn().mockReturnValue('error') };
        SignifyException.mockImplementation(() => mockSignifyException);

        const result = await ExceptionHelper.validate(null, 404, 'Not found');

        expect(result).toBe(mockSignifyException);
        expect(SignifyException).toHaveBeenCalledWith(404, 'Not found');
    });

    it('should send a response if response object is provided', async () => {
        const mockJson = jest.fn();
        const mockStatus = jest.fn(() => ({ json: mockJson }));
        const mockResponse = { status: mockStatus };

        const mockSignifyException = { status: 400, loadResult: jest.fn().mockReturnValue('error-result') };
        SignifyException.mockImplementation(() => mockSignifyException);

        await ExceptionHelper.validate(null, 400, 'Validation failed', mockResponse);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith('error-result');
    });

    it('should return null if field is valid', async () => {
        const result = await ExceptionHelper.validate('valid-data', 400, 'Should not trigger error');

        expect(result).toBeNull();
    });
});