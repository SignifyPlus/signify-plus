const MessageSocketUtils = require('../../../../webSockets/utils/messageSocketUtils');
const ControllerFactory = require('../../../../factories/controllerFactory');

//separate mocks for each method
const mockGetAllChats = jest.fn();
const mockFilterChat = jest.fn();
const mockCreateAndPostProcessChats = jest.fn();

jest.mock('../../../../factories/controllerFactory', () => ({
    getChatController: jest.fn(() => ({
        getAllChats: mockGetAllChats,
        filterChat: mockFilterChat,
        createAndPostProcessChats: mockCreateAndPostProcessChats,
    })),
}));

describe('MessageSocketUtils Unit Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call getAllChats when cacheChats is called', async () => {
        mockGetAllChats.mockResolvedValue(['chat1', 'chat2']);

        const result = await MessageSocketUtils.cacheChats();

        expect(mockGetAllChats).toHaveBeenCalled();
        expect(result).toEqual(['chat1', 'chat2']);
    });

    it('should call filterChat with correct parameters', async () => {
        mockFilterChat.mockResolvedValue('filteredChat');

        const cachedChats = ['chat1', 'chat2'];
        const targetPhoneNumbers = ['222'];
        const senderPhoneNumber = '111';

        const result = await MessageSocketUtils.filterChat(cachedChats, targetPhoneNumbers, senderPhoneNumber);

        expect(mockFilterChat).toHaveBeenCalledWith(
        cachedChats,
        ['222', '111'],
        );
        expect(result).toBe('filteredChat');
    });

    it('should call createAndPostProcessChats with correct parameters', async () => {
        mockCreateAndPostProcessChats.mockResolvedValue('newChat');

        const mainUserPhoneNumber = '111';
        const participants = ['222', '333'];

        const result = await MessageSocketUtils.createNewChat(mainUserPhoneNumber, participants);

        expect(mockCreateAndPostProcessChats).toHaveBeenCalledWith(
        mainUserPhoneNumber,
        participants,
        );
        expect(result).toBe('newChat');
    });
});