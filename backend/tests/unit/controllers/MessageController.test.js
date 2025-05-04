const MessageController = require('../../../controllers/MessageController');
const ServiceFactory = require('../../../factories/serviceFactory');
const ExceptionHelper = require('../../../exception/ExceptionHelper');
const SignifyException = require('../../../exception/SignifyException');
const LoggerFactory = require('../../../factories/loggerFactory');
const TimeUtils = require('../../../utilities/timeUtils');
const CommonUtils = require('../../../utilities/commonUtils');
const mongoose = require('mongoose');

jest.mock('../../../factories/serviceFactory');
const mockedUserSvc = {
    getDocumentByCustomFilters: jest.fn(),
    getDocumentsByCustomFilters: jest.fn(),
};
ServiceFactory.getUserService = mockedUserSvc;
jest.mock('../../../exception/ExceptionHelper');
jest.mock('../../../exception/SignifyException');
jest.mock('../../../factories/loggerFactory');
jest.mock('../../../utilities/timeUtils');
jest.mock('../../../utilities/commonUtils');

describe('MessageController (unit)', () => {
    let controller, req, res;

    beforeEach(() => {
        controller = new MessageController();
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('postMessage', () => {
    it('returns 400 if mainUserPhoneNumber is missing', async () => {
        ExceptionHelper.validate.mockResolvedValueOnce('early');
        await controller.postMessage(req, res);
        expect(ExceptionHelper.validate).toHaveBeenCalledWith(
            undefined, 400,
            expect.stringContaining('mainUserPhoneNumber is required'),
            res
        );
    });

    it('returns 400 if targetUserPhoneNumbers is missing', async () => {
        ExceptionHelper.validate
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce('early2');
        req.body.mainUserPhoneNumber = '+901234';
        await controller.postMessage(req, res);
        expect(ExceptionHelper.validate).toHaveBeenNthCalledWith(
            2, undefined, 400,
            expect.stringContaining('targetUserPhoneNumbers is required'),
            res
        );
        });
    });

    describe('deleteMessage', () => {
        it('returns 400 if senderPhoneNumber is missing', async () => {
        ExceptionHelper.validate.mockResolvedValueOnce('err');
        await controller.deleteMessage(req, res);
        expect(ExceptionHelper.validate).toHaveBeenCalledWith(
            undefined, 400,
            expect.stringContaining('senderPhoneNumber is required'),
            res
        );
        });
    });

    describe('softDeleteMessage', () => {
        it('returns 400 if messageId is missing', async () => {
        ExceptionHelper.validate
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce('err2');
        req.body.senderPhoneNumber = '+901234';
        await controller.softDeleteMessage(req, res);
        expect(ExceptionHelper.validate).toHaveBeenNthCalledWith(
            2, undefined, 400,
            expect.stringContaining('messageId is not provided'),
            res
        );
        });
    });

    describe('editMessage', () => {
        it('returns 400 if newContent is missing', async () => {
        ExceptionHelper.validate
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce('err3');
        req.body.senderPhoneNumber = '+901234';
        req.body.messageId = 'm1';
        await controller.editMessage(req, res);
        expect(ExceptionHelper.validate).toHaveBeenNthCalledWith(
            3, undefined, 400,
            expect.stringContaining('newContent is required'),
            res
        );
        });
    });

    describe('forwardMessage', () => {
        it('returns 400 if targetUserPhoneNumbers is missing', async () => {
        ExceptionHelper.validate
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce('err4');
        req.body.senderPhoneNumber = '+901234';
        req.body.messageId = 'm1';
        await controller.forwardMessage(req, res);
        expect(ExceptionHelper.validate).toHaveBeenNthCalledWith(
            3, undefined, 400,
            expect.stringContaining('targetUserPhoneNumbers is required'),
            res
        );
        });
    });

    describe('pinMessage', () => {
        it('returns 400 if isPinned is missing', async () => {
        ExceptionHelper.validate
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce('err5');
        req.body.userPhoneNumber = '+901234';
        req.body.messageId = 'm1';
        await controller.pinMessage(req, res);
        expect(ExceptionHelper.validate).toHaveBeenNthCalledWith(
            3, false, 400,
            expect.stringContaining('isPinned (boolean) is required'),
            res
        );
        });
    });

    describe('toggleMessageReadStatus', () => {
        it('returns 400 if isRead is missing', async () => {
        ExceptionHelper.validate
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce('err6');
        req.body.userPhoneNumber = '+901234';
        req.body.messageId = 'm1';
        await controller.toggleMessageReadStatus(req, res);
        expect(ExceptionHelper.validate).toHaveBeenNthCalledWith(
            3, false, 400,
            expect.stringContaining('isRead (boolean) is required'),
            res
        );
        });
    });

    describe('getUnreadMessageCount', () => {
        it('returns 400 if userPhoneNumber param is missing', async () => {
        ExceptionHelper.validate.mockResolvedValueOnce('err7');
        await controller.getUnreadMessageCount(req, res);
        expect(ExceptionHelper.validate).toHaveBeenCalledWith(
            undefined, 400,
            expect.stringContaining('userPhoneNumber is required'),
            res
        );
        });
    });

    describe('getMessageReplies', () => {
        it('returns 400 if messageId param is missing', async () => {
        ExceptionHelper.validate.mockResolvedValueOnce('err8');
        await controller.getMessageReplies(req, res);
        expect(ExceptionHelper.validate).toHaveBeenCalledWith(
            undefined, 400,
            expect.stringContaining('messageId is not provided'),
            res
        );
        });
    });
});