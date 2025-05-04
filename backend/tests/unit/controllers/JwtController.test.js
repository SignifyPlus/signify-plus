const JwtController = require('../../../controllers/JwtController');
const ExceptionHelper = require('../../../exception/ExceptionHelper');
const ServiceFactory = require('../../../factories/serviceFactory');
const ManagerFactory = require('../../../factories/managerFactory');
const SignifyException = require('../../../exception/SignifyException');

jest.mock('../../../exception/ExceptionHelper');
jest.mock('../../../factories/serviceFactory');
jest.mock('../../../factories/managerFactory');
jest.mock('../../../exception/SignifyException');

ExceptionHelper.validate = jest.fn();
ManagerFactory.getJwtManager = jest.fn();

describe('JwtController.validateTokens unit tests', () => {
    let controller;
    let req;
    let res;

    beforeEach(() => {
        controller = new JwtController();
        req = { body: {} };
        res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };

        ExceptionHelper.validate.mockReset();
        ServiceFactory.getUserService = { getDocumentByCustomFilters: jest.fn() };
        ManagerFactory.getJwtManager.mockReset();
        SignifyException.mockClear();
    });

    it('returns early when phoneNumber is missing', async () => {
        ExceptionHelper.validate.mockResolvedValueOnce('early1');
        const result = await controller.validateTokens(req, res);
        expect(ExceptionHelper.validate).toHaveBeenCalledWith(
        undefined, 400,
        expect.stringContaining('phoneNumber is required'),
        res
        );
        expect(result).toBe('early1');
    });

    it('returns early when refreshToken is missing', async () => {
        ExceptionHelper.validate.mockResolvedValueOnce(null);
        ExceptionHelper.validate.mockResolvedValueOnce('early2');
        req.body.phoneNumber = '+123';
        const result = await controller.validateTokens(req, res);
        expect(ExceptionHelper.validate).toHaveBeenNthCalledWith(
        1, '+123', 400,
        expect.stringContaining('phoneNumber is required'),
        res
        );
        expect(ExceptionHelper.validate).toHaveBeenNthCalledWith(
        2, undefined, 400,
        expect.stringContaining('refreshToken is required'),
        res
        );
        expect(result).toBe('early2');
    });

    it('returns early when user not found', async () => {
        ExceptionHelper.validate
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce('userNotFoundReturn');
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValueOnce(null);
        req.body = { phoneNumber: '+123', refreshToken: 'rt' };
        const result = await controller.validateTokens(req, res);
        expect(ServiceFactory.getUserService.getDocumentByCustomFilters)
        .toHaveBeenCalledWith({ phoneNumber: '+123' });
        expect(ExceptionHelper.validate).toHaveBeenCalledWith(
        null, 400,
        expect.stringContaining('User does not exist'),
        res
        );
        expect(result).toBe('userNotFoundReturn');
    });

    it('responds 401 when verifyRefreshToken returns exception', async () => {
        ExceptionHelper.validate
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'u1' });
        const jwtMgr = { verifyRefreshToken: jest.fn().mockResolvedValue({ exception: new Error('bad') }) };
        ManagerFactory.getJwtManager.mockReturnValue(jwtMgr);
        SignifyException.mockImplementation((status, message) => ({
            status,
            loadResult: () => ({ error: message }),
        }));
        req.body = { phoneNumber: '+123', refreshToken: 'rt' };

        await controller.validateTokens(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });

    it('responds 200 and valid payload when token is valid', async () => {
        ExceptionHelper.validate.mockResolvedValue(null);
        ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'u1' });
        const payload = { userId: 'u1' };
        const jwtMgr = { verifyRefreshToken: jest.fn().mockResolvedValue({ data: payload }) };
        ManagerFactory.getJwtManager.mockReturnValue(jwtMgr);
        req.body = { phoneNumber: '+123', refreshToken: 'rt' };

        await controller.validateTokens(req, res);

        expect(res.json).toHaveBeenCalledWith({ isValid: true, details: payload });
        expect(res.status).not.toHaveBeenCalled();
    });
});