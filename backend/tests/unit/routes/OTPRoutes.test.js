const mockGet = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
    }),
}));

jest.mock('../../../factories/controllerFactory.js', () => ({}));

describe('OTPRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        jest.resetModules();
    });

    it('should load OTPRoutes without error', () => {
        expect(() => require('../../../routes/OTPRoutes')).not.toThrow();
    });
});