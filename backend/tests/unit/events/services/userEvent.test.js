const UserEvent = require('../../../../events/services/userEvent');
const EventDispatcher = require('../../../../events/eventDispatcher');
const LoggerFactory = require('../../../../factories/loggerFactory');
const ControllerFactory = require('../../../../factories/controllerFactory');
const EventConstants = require('../../../../constants/eventConstants');

jest.mock('../../../../events/eventDispatcher', () => ({
    registerListener: jest.fn(),
}));

jest.mock('../../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
    },
}));

const mockUpdateUserData = jest.fn();
jest.mock('../../../../factories/controllerFactory', () => ({
    getUserController: () => ({
        updateUserData: mockUpdateUserData,
    }),
}));

describe('UserEvent Unit Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register listener on instantiation', () => {
        new UserEvent();
        expect(EventDispatcher.registerListener).toHaveBeenCalledWith(
            EventConstants.UPDATE_USER_EVENT,
            expect.any(Function)
        );
    });

    it('should call logger and controller updateUserData on updateUserData', async () => {
        const userEvent = new UserEvent();
        const mockUserData = { _id: { toString: () => 'user123' } };

        mockUpdateUserData.mockResolvedValue('user-updated');

        const result = await userEvent.updateUserData(mockUserData);

        expect(LoggerFactory.getApplicationLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('Updating userData for the userId user123 via the user event...')
        );
        expect(mockUpdateUserData).toHaveBeenCalledWith(mockUserData);
        expect(result).toBe('user-updated');
    });
});
