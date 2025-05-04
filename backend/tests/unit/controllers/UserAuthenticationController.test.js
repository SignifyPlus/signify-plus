

const UserAuthenticationController = require('../../../controllers/UserAuthenticationController');
const ServiceFactory = require('../../../factories/serviceFactory');
const ExceptionHelper = require('../../../exception/ExceptionHelper');
const LoggerFactory = require('../../../factories/loggerFactory');
const SignifyException = require('../../../exception/SignifyException');
const SignifyResult = require('../../../dtos/SignifyResult');

jest.mock('../../../factories/serviceFactory');
jest.mock('../../../exception/ExceptionHelper');
jest.mock('../../../factories/loggerFactory');
jest.mock('../../../exception/SignifyException');

describe('UserAuthenticationController (unit)', () => {
    let controller;
    let mockReq;
    let mockRes;
    let mockSession;

    beforeEach(() => {
        controller = new UserAuthenticationController();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockSession = {};

        ServiceFactory.getMongooseService = {
            getMongooseSession: jest.fn().mockResolvedValue(mockSession),
            startMongooseTransaction: jest.fn(),
            commitMongooseTransaction: jest.fn(),
            abandonMongooseTransaction: jest.fn(),
        };

        ExceptionHelper.validate = jest.fn().mockResolvedValue(null);
        LoggerFactory.getApplicationLogger = { info: jest.fn(), error: jest.fn() };
        SignifyException.mockImplementation((status, message) => ({
        status,
            loadResult: () => ({ error: message }),
        }));

        ServiceFactory.getUserService = {
            getDocumentByCustomFilters: jest.fn(),
        };
        ServiceFactory.getUserAuthenticationService = {
            getDocumentByCustomFilters: jest.fn(),
            saveDocument: jest.fn(),
            updateDocument: jest.fn(),
        };
    });

    describe('getUserAuthenticationRecord', () => {
        it('returns 400 if user not found', async () => {
            mockReq.params.phoneNumber = '+100';
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue(null);
            ExceptionHelper.validate.mockResolvedValueOnce('early');
            const result = await controller.getUserAuthenticationRecord(mockReq, mockRes);
            expect(ExceptionHelper.validate).toHaveBeenCalledWith(
                null, 400, expect.stringContaining('User does not exist'), mockRes
            );
            expect(result).toBe('early');
        });

        it('returns 400 if auth record missing', async () => {
            mockReq.params.phoneNumber = '+100';
            const dummyUser = { _id: 'u1' };
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue(dummyUser);
            ExceptionHelper.validate.mockResolvedValueOnce(null).mockResolvedValueOnce('noRecord');
            ServiceFactory.getUserAuthenticationService.getDocumentByCustomFilters.mockResolvedValue(null);
            const result = await controller.getUserAuthenticationRecord(mockReq, mockRes);
            expect(ExceptionHelper.validate).toHaveBeenCalledWith(
                null, 400, expect.stringContaining('does not exist in the database'), mockRes
            );
            expect(result).toBe('noRecord');
        });

        it('returns auth record on success', async () => {
            mockReq.params.phoneNumber = '+100';
            const user = { _id: 'u1' };
            const record = { userId: 'u1', isVerified: true };
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue(user);
            ExceptionHelper.validate.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            ServiceFactory.getUserAuthenticationService.getDocumentByCustomFilters.mockResolvedValue(record);
            await controller.getUserAuthenticationRecord(mockReq, mockRes);
            expect(mockRes.json).toHaveBeenCalledWith(record);
        });
    });

    describe('createDefaultUserAuthenticationRecord', () => {
        it('returns exception result if userId missing', async () => {
            const result = await controller.createDefaultUserAuthenticationRecord(null);
            expect(result.data).toBeNull();
            expect(result.exception).toBeDefined();
        });

        it('saves and returns new record', async () => {
            const saved = { userId: 'u2' };
            ServiceFactory.getUserAuthenticationService.saveDocument.mockResolvedValue(saved);
            ExceptionHelper.validate.mockResolvedValueOnce(null);
            const result = await controller.createDefaultUserAuthenticationRecord('u2');
            expect(ServiceFactory.getUserAuthenticationService.saveDocument)
                .toHaveBeenCalledWith({ userId: 'u2' }, mockSession);
            expect(result.data).toEqual(saved);
        });
    });

    describe('updateUserAuthenticationViaEvent', () => {
        it('returns exception result if userId missing', async () => {
            const result = await controller.updateUserAuthenticationViaEvent({});
            expect(result.data).toBeNull();
            expect(result.exception).toBeDefined();
        });

        it('returns exception if no existing record', async () => {
            const data = { userId: 'u1' };
            ServiceFactory.getUserAuthenticationService.getDocumentByCustomFilters.mockResolvedValue(null);
            ExceptionHelper.validate.mockResolvedValueOnce('noRecordErr');
            const result = await controller.updateUserAuthenticationViaEvent(data);
            expect(ExceptionHelper.validate).toHaveBeenCalled();
            expect(result.exception).toBeDefined();
        });

        it('updates and returns record on success', async () => {
            const existing = { _id: 'r1', isVerified: false, refreshToken: 'old' };
            const updated = { _id: 'r1', isVerified: true, refreshToken: 'new' };
            const data = { userId: 'u1', isVerified: true, refreshToken: 'new' };
            ServiceFactory.getUserAuthenticationService.getDocumentByCustomFilters.mockResolvedValue(existing);
            ExceptionHelper.validate.mockResolvedValueOnce(null);
            ServiceFactory.getUserAuthenticationService.updateDocument.mockResolvedValue(updated);
            const result = await controller.updateUserAuthenticationViaEvent(data);
            expect(ServiceFactory.getUserAuthenticationService.updateDocument)
                .toHaveBeenCalledWith(existing._id, expect.objectContaining({
                isVerified: true, refreshToken: 'new'
                }), mockSession);
            expect(result.data).toEqual(updated);
        });
    });

    describe('createUserAuthenticationRecord', () => {
        it('calls createDefaultUserAuthenticationRecord and returns data', async () => {
            const spy = jest.spyOn(controller, 'createDefaultUserAuthenticationRecord')
                .mockResolvedValue({ data: 'd', exception: null });
            await controller.createUserAuthenticationRecord(mockReq, mockRes);
            expect(spy).toHaveBeenCalledWith(undefined);
            expect(mockRes.json).toHaveBeenCalledWith('d');
        });

        it('handles exception from createDefault', async () => {
            const ex = { status: 400, loadResult: () => ({ msg: 'err' }) };
            jest.spyOn(controller, 'createDefaultUserAuthenticationRecord')
                .mockResolvedValue({ data: null, exception: ex });
            await controller.createUserAuthenticationRecord(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(ex);
        });
    });

    describe('updateUserAuthenticationRecord', () => {
        it('returns early if phoneNumber missing', async () => {
            mockReq.body = {};
            ExceptionHelper.validate.mockResolvedValueOnce('phoneErr');
            const res = await controller.updateUserAuthenticationRecord(mockReq, mockRes);
            expect(res).toBe('phoneErr');
        });

        it('returns early if user not found', async () => {
            mockReq.body = { phoneNumber: '+100' };
            ExceptionHelper.validate.mockResolvedValueOnce(null).mockResolvedValueOnce('userErr');
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue(null);
            const res = await controller.updateUserAuthenticationRecord(mockReq, mockRes);
            expect(res).toBe('userErr');
        });

        it('returns early if existing record missing', async () => {
            mockReq.body = { phoneNumber: '+100', isVerified: true, refreshToken: 'rt' };
            ExceptionHelper.validate.mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce('recErr');
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'u1' });
            ServiceFactory.getUserAuthenticationService.getDocumentByCustomFilters.mockResolvedValue(null);
            const res = await controller.updateUserAuthenticationRecord(mockReq, mockRes);
            expect(res).toBe('recErr');
        });

        it('updates record on success', async () => {
            mockReq.body = { phoneNumber: '+100', isVerified: true, refreshToken: 'rt' };
            const existing = { _id: 'r1', isVerified: false, refreshToken: 'old' };
            const updated = { _id: 'r1', isVerified: true, refreshToken: 'rt' };
            ExceptionHelper.validate.mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'u1' });
            ServiceFactory.getUserAuthenticationService.getDocumentByCustomFilters.mockResolvedValue(existing);
            ServiceFactory.getUserAuthenticationService.updateDocument.mockResolvedValue(updated);
            await controller.updateUserAuthenticationRecord(mockReq, mockRes);
            expect(ServiceFactory.getUserAuthenticationService.updateDocument)
                .toHaveBeenCalledWith(existing._id, expect.objectContaining({
                isVerified: true, refreshToken: 'rt'
                }), mockSession);
            expect(mockRes.json).toHaveBeenCalledWith(updated);
        });
    });
});