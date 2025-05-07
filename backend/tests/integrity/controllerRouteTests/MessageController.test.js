const request = require('supertest');

jest.mock('../../../factories/serviceFactory', () => {
    const userSvc    = {
        getDocumentByCustomFilters: jest.fn(),
        getDocumentsByCustomFilters: jest.fn(),
    };
    const chatSvc    = {
        getDocumentByCustomFilters: jest.fn(),
        getDocumentsByCustomFiltersQuery: jest.fn(),
        saveDocument: jest.fn(),
        updateChatActivity: jest.fn(),
        getDocumentById: jest.fn(),
    };
    const messageSvc = {
        saveDocument: jest.fn(),
        getDocumentById: jest.fn(),
        getDocumentByCustomFilters: jest.fn(),
        deleteDocument: jest.fn(),
        softDeleteMessage: jest.fn(),
        editMessage: jest.fn(),
        pinMessage: jest.fn(),
        updateDocument: jest.fn(),
        getUnreadMessageCount: jest.fn(),
        getRepliesForMessage: jest.fn(),
    };
    const mongooseSvc = {
        getMongooseSession: jest.fn().mockResolvedValue({}),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction: jest.fn(),
    };
    return {
        get getUserService() { return userSvc; },
        get getChatService() { return chatSvc; },
        get getMessageService() { return messageSvc; },
        get getMongooseService(){ return mongooseSvc; },
    };
});

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const ServiceFactory = require('../../../factories/serviceFactory');
const app = require('../../security/expressApp');

const userSvc = ServiceFactory.getUserService;
const chatSvc = ServiceFactory.getChatService;
const messageSvc = ServiceFactory.getMessageService;

describe('MessageController integrity routes (all endpoints)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('POST /messages/create happy path', async () => {
        userSvc.getDocumentByCustomFilters.mockResolvedValue({ _id: 'u1' });
        userSvc.getDocumentsByCustomFilters.mockResolvedValue([{ _id: 'u2' }]);
        chatSvc.getDocumentByCustomFilters.mockResolvedValue(null);
        chatSvc.saveDocument.mockResolvedValue([{ _id: 'c1' }]);
        messageSvc.saveDocument.mockResolvedValue({ _id: 'm1', content: 'hi' });

        const res = await request(app)
        .post('/messages/create')
        .send({
            mainUserPhoneNumber: '+9055',
            targetUserPhoneNumbers: ['+9056'],
            message: 'hi',
        });

        expect(res.status).toBe(200);
        expect(res.body.content).toBe('hi');
        expect(messageSvc.saveDocument).toHaveBeenCalled();
    });

    it('POST /messages/delete returns 200 when within time window', async () => {
        userSvc.getDocumentByCustomFilters.mockResolvedValue({ _id: 'u1' });
        messageSvc.getDocumentByCustomFilters.mockResolvedValue({
            _id: 'm1',
            createdAt: new Date(),
            senderId: 'u1',
        });
        messageSvc.deleteDocument.mockResolvedValue();

        const res = await request(app)
        .delete('/messages/delete')
        .send({ senderPhoneNumber: '+9055', messageId: 'm1' });

        expect(res.status).toBe(200);
        expect(messageSvc.deleteDocument).toHaveBeenCalledWith({ _id: 'm1' });
    });

    it('POST /messages/forward duplicates message to new chat', async () => {
        userSvc.getDocumentByCustomFilters.mockResolvedValue({ _id: 'u1' });
        messageSvc.getDocumentById.mockResolvedValue({ _id: 'm1', content: 'hi' });
        userSvc.getDocumentsByCustomFilters.mockResolvedValue([{ _id: 'u2' }]);
        chatSvc.getDocumentByCustomFilters.mockResolvedValue(null);
        chatSvc.saveDocument.mockResolvedValue([{ _id: 'c2' }]);
        messageSvc.saveDocument.mockResolvedValue({ _id: 'm2', chatId: 'c2' });

        const res = await request(app)
        .post('/messages/forward')
        .send({
            senderPhoneNumber: '+9055',
            messageId: 'm1',
            targetUserPhoneNumbers: ['+9056'],
        });

        expect(res.status).toBe(200);
        expect(messageSvc.saveDocument).toHaveBeenCalled();
    });

    it('POST /messages/pin sets pin flag', async () => {
        userSvc.getDocumentByCustomFilters.mockResolvedValue({ _id: 'u1' });
        messageSvc.getDocumentById.mockResolvedValue({
            _id: 'm1',
            chatId: 'c1',
            isDeleted: false,
        });
        chatSvc.getDocumentById.mockResolvedValue({
            _id: 'c1',
            mainUserId: 'u1',
            participants: [],
        });
        messageSvc.pinMessage.mockResolvedValue();

        const res = await request(app)
        .post('/messages/pin')
        .send({
            userPhoneNumber: '+9055',
            messageId: 'm1',
            isPinned: true,
        });

        expect(res.status).toBe(200);
        expect(messageSvc.pinMessage).toHaveBeenCalledWith('m1', true);
    });

    it('POST /messages/readToggle updates isRead', async () => {
        userSvc.getDocumentByCustomFilters.mockResolvedValue({ _id: 'u1' });
        messageSvc.getDocumentById.mockResolvedValue({
            _id: 'm1',
            isDeleted: false,
            receiverIds: ['u1'],
        });
        messageSvc.updateDocument.mockResolvedValue();

        const res = await request(app)
        .post('/messages/read-status')
        .send({
            userPhoneNumber: '+9055',
            messageId: 'm1',
            isRead: true,
        });

        expect(res.status).toBe(200);
        expect(messageSvc.updateDocument).toHaveBeenCalledWith(
        { _id: 'm1' },
        { isRead: true },
        );
    });

    it('GET /messages/unreadCount/:phone returns summary counts', async () => {
        userSvc.getDocumentByCustomFilters.mockResolvedValue({ _id: 'u1' });
        chatSvc.getDocumentsByCustomFiltersQuery.mockReturnValue({
            lean: () => [{ _id: 'c1' }, { _id: 'c2' }],
        });
        messageSvc.getUnreadMessageCount
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(2);

        const res = await request(app).get(
            '/messages/unread-count/+9055'
        );

        expect(res.status).toBe(200);
        expect(res.body.totalUnreadCount).toBe(5);
        expect(messageSvc.getUnreadMessageCount).toHaveBeenCalledTimes(2);
    });

    it('GET /messages/replies/:id returns threaded replies', async () => {
        messageSvc.getDocumentById.mockResolvedValue({ _id: 'p1', content: 'hi' });
        messageSvc.getRepliesForMessage.mockResolvedValue([
            { _id: 'r1', content: 'reply' },
        ]);

        const res = await request(app).get('/messages/replies/p1');
        expect(res.status).toBe(200);
        expect(res.body.replies.length).toBe(1);
        expect(messageSvc.getRepliesForMessage).toHaveBeenCalledWith('p1');
    });
});