const MessageEvent = require('../../../../events/services/messageEvent');
const EventDispatcher = require('../../../../events/eventDispatcher');
const ControllerFactory = require('../../../../factories/controllerFactory');
const EventConstants = require('../../../../constants/eventConstants');

jest.mock('../../../../events/eventDispatcher', () => ({
    registerListener: jest.fn(),
}));

const mockPostMessageToDb = jest.fn();
jest.mock('../../../../factories/controllerFactory', () => ({
    getMessageController: () => ({
        postMessageToDb: mockPostMessageToDb,
    }),
}));

describe('MessageEvent Unit Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register listener on instantiation', () => {
        new MessageEvent();
        expect(EventDispatcher.registerListener).toHaveBeenCalledWith(
        EventConstants.MESSAGE_INGEST_EVENT,
        expect.any(Function)
        );
    });

    it('should call postMessageToDb with correct parameters on ingestMessage', async () => {
        const messageEvent = new MessageEvent();
        const mockMessage = {
            senderPhoneNumber: '1234567890',
            targetPhoneNumbers: ['0987654321', '1122334455'],
            message: 'Hello world!',
            chatId: 'chat123',
        };

        mockPostMessageToDb.mockResolvedValue('message-stored');

        const result = await messageEvent.ingestMessage(mockMessage);

        expect(mockPostMessageToDb).toHaveBeenCalledWith(
            '1234567890',
            ['0987654321', '1122334455'],
            'Hello world!',
            'chat123'
        );
        expect(result).toBe('message-stored');
    });
});
