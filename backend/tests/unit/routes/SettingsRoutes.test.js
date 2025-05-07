const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
        post: mockPost,
        put: mockPut,
    }),
}));

const mockSettingsController = {
    getSettingsById: 'mockGetSettingsById',
    createDefaultAccessibilitySettings: 'mockCreateDefaultAccessibilitySettings',
    getSettingsByPhoneNumber: 'mockGetSettingsByPhoneNumber',
    updateAccessibilitySettings: 'mockUpdateAccessibilitySettings',
};

jest.mock('../../../factories/controllerFactory.js', () => ({
    getSettingsController: () => mockSettingsController,
}));

describe('SettingsRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockPost.mockClear();
        mockPut.mockClear();
        jest.resetModules();
    });

    it('should register GET /id/:id', () => {
        require('../../../routes/SettingsRoutes');
        expect(mockGet).toHaveBeenCalledWith('/id/:id', 'mockGetSettingsById');
    });

    it('should register POST /default/create', () => {
        require('../../../routes/SettingsRoutes');
        expect(mockPost).toHaveBeenCalledWith('/default/create', 'mockCreateDefaultAccessibilitySettings');
    });

    it('should register GET /:phoneNumber', () => {
        require('../../../routes/SettingsRoutes');
        expect(mockGet).toHaveBeenCalledWith('/:phoneNumber', 'mockGetSettingsByPhoneNumber');
    });

    it('should register PUT /update/', () => {
        require('../../../routes/SettingsRoutes');
        expect(mockPut).toHaveBeenCalledWith('/update/', 'mockUpdateAccessibilitySettings');
    });
});