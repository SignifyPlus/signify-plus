

const SettingsController = require('../../../controllers/SettingsController');
const ServiceFactory = require('../../../factories/serviceFactory');
const ExceptionHelper = require('../../../exception/ExceptionHelper');
const LoggerFactory = require('../../../factories/loggerFactory');
const SignifyResult = require('../../../dtos/SignifyResult');
const SignifyException = require('../../../exception/SignifyException');
const ControllerConstants = require('../../../constants/controllerConstants');

jest.mock('../../../factories/serviceFactory', () => ({
    getMongooseService: {
        getMongooseSession: jest.fn(),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction: jest.fn(),
    },
    getSettingsService: {
        getDocumentById: jest.fn(),
        getDocumentsByCustomFiltersQuery: jest.fn(),
        saveDocument: jest.fn(),
    },
    getUserService: {
        getDocumentByCustomFilters: jest.fn(),
    },
}));

jest.mock('../../../exception/ExceptionHelper', () => ({
    validate: jest.fn(),
}));

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
    },
}));

jest.mock('../../../dtos/SignifyResult', () => {
    return jest.fn().mockImplementation((data, exception) => ({
        data,
        exception,
    }));
});

jest.mock('../../../exception/SignifyException', () => {
    return jest.fn().mockImplementation((status, message) => ({
        status,
        message,
        loadResult: () => ({ error: message }),
    }));
});

jest.mock('../../../constants/controllerConstants', () => ({
    ASL_TRANSLATION_LANGUAGE_KEY: 'aslTranslationLanguage',
    ACCESSIBILITY_SETTINGS_ASL_TRANSLATE_DICT: { 'EN': 'English', 'ES': 'Spanish' },
}));

describe('SettingsController Unit Test', () => {
    let settingsController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        settingsController = new SettingsController();
        reqMock = { params: {}, body: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getSettingsById', () => {
        it('should return settings by ID', async () => {
        reqMock.params.id = 'settings-id';
        ServiceFactory.getSettingsService.getDocumentById.mockResolvedValue({ aslTranslationLanguage: 'EN' });
        ExceptionHelper.validate.mockResolvedValue(null);

        await settingsController.getSettingsById(reqMock, resMock);

        expect(ServiceFactory.getSettingsService.getDocumentById).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining({ aslTranslationLanguage: 'English' }));
        });
    });

    describe('getSettingsByPhoneNumber', () => {
        it('should return settings by phone number', async () => {
        reqMock.params.phoneNumber = '123456789';
        ExceptionHelper.validate.mockResolvedValue(null);
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'userId' });
        ServiceFactory.getSettingsService.getDocumentsByCustomFiltersQuery.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([{ aslTranslationLanguage: 'EN' }]),
        });

        await settingsController.getSettingsByPhoneNumber(reqMock, resMock);

        expect(ServiceFactory.getSettingsService.getDocumentsByCustomFiltersQuery).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(expect.any(Array));
        });
    });

    describe('createDefaultAccessibilitySettings', () => {
        it('should create default settings', async () => {
        reqMock.body.userId = 'userId';
        ServiceFactory.getSettingsService.saveDocument.mockResolvedValue({ id: 'settingsId' });

        await settingsController.createDefaultAccessibilitySettings(reqMock, resMock);

        expect(ServiceFactory.getSettingsService.saveDocument).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalled();
        });
    });

    describe('updateAccessibilitySettings', () => {
        it('should update accessibility settings', async () => {
        reqMock.body = {
            phoneNumber: '123',
            theme: 'dark',
            autoDownload: true,
            notificationEnabled: true,
            aslTranslationLanguage: 'EN',
            profilePicturePath: 'path/to/profile.jpg',
        };

        await settingsController.updateAccessibilitySettings(reqMock, resMock);

        expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining({
            phoneNumber: '123',
            theme: 'dark',
            autoDownload: true,
            notificationEnabled: true,
            aslTranslationLanguage: 'EN',
            profilePicturePath: 'path/to/profile.jpg',
        }));
        });
    });
});