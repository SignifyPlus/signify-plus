const EventConstants = require('../../../../constants/eventConstants');
const ControllerFactory = require('../../../../factories/controllerFactory');
const LoggerFactory = require('../../../../factories/loggerFactory');
const EventDispatcher = require('../../../../events/eventDispatcher');

jest.mock('../../../../constants/eventConstants', () => ({
    USER_AUTHENTICAITON_EVENT: 'USER_AUTHENTICAITON_EVENT',
    USER_AUTHENTICATION_UPDATE_EVENT: 'USER_AUTHENTICATION_UPDATE_EVENT',
}));

jest.mock('../../../../events/eventDispatcher', () => ({
    registerListener: jest.fn(),
    dispatchEvent: jest.fn(),
}));

jest.mock('../../../../factories/controllerFactory', () => ({
    getUserAuthenticationController: jest.fn(),
}));

jest.mock('../../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn() },
}));

describe('UserAuthenticationEvent', () => {
    let UserAuthenticationEvent;
    let controllerMock;

    beforeAll(() => {
        controllerMock = {
            createDefaultUserAuthenticationRecord: jest.fn().mockResolvedValue('created'),
            updateUserAuthenticationViaEvent: jest.fn().mockResolvedValue('updated'),
        };
        ControllerFactory.getUserAuthenticationController.mockReturnValue(controllerMock);

        UserAuthenticationEvent = require('../../../../events/services/userAuthenticationEvent');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('registers listeners on instantiation', () => {
        const instance = new UserAuthenticationEvent();
        expect(EventDispatcher.registerListener).toHaveBeenCalledWith(
            EventConstants.USER_AUTHENTICAITON_EVENT,
            expect.any(Function)
        );
        expect(EventDispatcher.registerListener).toHaveBeenCalledWith(
            EventConstants.USER_AUTHENTICATION_UPDATE_EVENT,
            expect.any(Function)
        );
    });

    it('createDefaultUserAuthenticationRecord calls controller and returns its response', async () => {
        const instance = new UserAuthenticationEvent();
        const result = await instance.createDefaultUserAuthenticationRecord('user123');
        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('Creating default user authentication record for the user user123')
        );
        expect(controllerMock.createDefaultUserAuthenticationRecord).toHaveBeenCalledWith('user123');
        expect(result).toBe('created');
    });

    it('updateUserAuthenticationRecord calls controller and returns its response', async () => {
        const instance = new UserAuthenticationEvent();
        const data = { userId: 'user123', isVerified: true, refreshToken: 'token' };
        const result = await instance.updateUserAuthenticationRecord(data);
        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('Updating user authentication record for the userId: user123')
        );
        expect(controllerMock.updateUserAuthenticationViaEvent).toHaveBeenCalledWith(data);
        expect(result).toBe('updated');
    });
});