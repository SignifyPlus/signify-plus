const UserController = require('../../../controllers/UserController');
const ServiceFactory = require('../../../factories/serviceFactory');
const LoggerFactory = require('../../../factories/loggerFactory');
const Encrypt = require('../../../utilities/encrypt');
const ExceptionHelper = require('../../../exception/ExceptionHelper');
const EventDispatcher = require('../../../events/eventDispatcher');
const SignifyException = require('../../../exception/SignifyException');
const SignifyResult = require('../../../dtos/SignifyResult');
const ControllerConstants = require('../../../constants/controllerConstants');
const EventConstants = require('../../../constants/eventConstants');

jest.mock('../../../factories/serviceFactory', () => ({
    getUserService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
        getDocumentByCustomFilters: jest.fn(),
        saveDocument: jest.fn(),
        deleteDocument: jest.fn(),
        deleteDocumentById: jest.fn(),
        updateDocument: jest.fn(),
    },
    getMongooseService: {
        getMongooseSession: jest.fn(),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction: jest.fn(),
    },
}));

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
    },
}));

jest.mock('../../../utilities/encrypt', () => ({
    encrypt: jest.fn(),
    compare: jest.fn(),
}));

jest.mock('../../../exception/ExceptionHelper', () => ({
    validate: jest.fn(),
}));

jest.mock('../../../events/eventDispatcher', () => ({
    dispatchEvent: jest.fn(),
}));

jest.mock('../../../exception/SignifyException', () => {
    return jest.fn().mockImplementation((status, message) => ({
        status,
        message,
        loadResult: () => ({ error: message }),
    }));
});

jest.mock('../../../dtos/SignifyResult', () => {
    return jest.fn().mockImplementation((data, exception) => ({
        data,
        exception,
    }));
});

jest.mock('../../../constants/controllerConstants', () => ({
    SALT_ROUND_FOR_USERS_CONTROLLER: 10,
    ZERO_INDEX: 0,
}));

jest.mock('../../../constants/eventConstants', () => ({
    ACCESSIBILITY_SETTINGS_EVENT: 'ACCESSIBILITY_SETTINGS_EVENT',
}));

describe('UserController Unit Test', () => {
    let userController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        userController = new UserController();
        reqMock = { params: {}, query: {}, body: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should fetch all users', async () => {
        const mockUsers = [{ id: '1' }];
        ServiceFactory.getUserService.getDocuments.mockResolvedValue(mockUsers);

        await userController.getAllUsers(reqMock, resMock);

        expect(resMock.json).toHaveBeenCalledWith(mockUsers);
        });
    });

    describe('getUserById', () => {
        it('should fetch a user by ID', async () => {
        const mockUser = { id: '1' };
        reqMock.params.id = '1';
        ServiceFactory.getUserService.getDocumentById.mockResolvedValue(mockUser);

        await userController.getUserById(reqMock, resMock);

        expect(resMock.json).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('getUserByPhoneNumber', () => {
        it('should fetch a user by phone number', async () => {
        const mockUser = { id: '1' };
        reqMock.params.phoneNumber = '123456789';
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue(mockUser);
        ExceptionHelper.validate.mockResolvedValue(null);

        await userController.getUserByPhoneNumber(reqMock, resMock);

        expect(resMock.json).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('getUserByPhoneNumberForLogin', () => {
        it('should login user with correct phone number and password', async () => {
        const mockUser = { password: 'hashedPassword' };
        reqMock.body.phoneNumber = '123456789';
        reqMock.body.password = 'password';
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue(mockUser);
        ExceptionHelper.validate.mockResolvedValue(null);
        Encrypt.compare.mockResolvedValue(true);

        await userController.getUserByPhoneNumberForLogin(reqMock, resMock);

        expect(resMock.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return error if password does not match', async () => {
        const mockUser = { password: 'hashedPassword' };
        reqMock.body.phoneNumber = '123456789';
        reqMock.body.password = 'wrongpassword';
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue(mockUser);
        ExceptionHelper.validate.mockResolvedValue(null);
        Encrypt.compare.mockResolvedValue(false);

        await userController.getUserByPhoneNumberForLogin(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(401);
        expect(resMock.json).toHaveBeenCalledWith({ error: expect.stringContaining("Passwords don't match!") });
        });
    });

    describe('createUser', () => {
        it('should create a new user and dispatch event', async () => {
        const mockUser = [{ _id: '123' }];
        reqMock.body = { name: 'John', phoneNumber: '123456789', password: 'password' };
        Encrypt.encrypt.mockResolvedValue('encryptedPassword');
        ServiceFactory.getUserService.saveDocument.mockResolvedValue(mockUser);

        await userController.createUser(reqMock, resMock);

        expect(EventDispatcher.dispatchEvent).toHaveBeenCalled();
        expect(resMock.json).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user based on query', async () => {
        const mockResponse = { deletedCount: 1 };
        reqMock.query = { name: 'John' };
        ServiceFactory.getUserService.deleteDocument.mockResolvedValue(mockResponse);

        await userController.deleteUser(reqMock, resMock);

        expect(resMock.json).toHaveBeenCalledWith(mockResponse);
        });
    });

    describe('deleteUserById', () => {
        it('should delete a user by ID', async () => {
        const mockResponse = { deletedCount: 1 };
        reqMock.params.id = '123';
        ServiceFactory.getUserService.deleteDocumentById.mockResolvedValue(mockResponse);

        await userController.deleteUserById(reqMock, resMock);

        expect(resMock.json).toHaveBeenCalledWith(mockResponse);
        });
    });

    describe('updateUserData', () => {
        it('should update user data and return SignifyResult', async () => {
        const updatedData = { id: '1', name: 'Updated Name' };
        ServiceFactory.getUserService.updateDocument.mockResolvedValue(updatedData);

        const result = await userController.updateUserData({ _id: '1', name: 'Updated Name' });

        expect(result.data).toEqual(updatedData);
        });
    });
});