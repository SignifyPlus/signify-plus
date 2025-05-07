const ForumMemberController = require('../../../controllers/ForumMemberController');
const ServiceFactory = require('../../../factories/serviceFactory');
const LoggerFactory = require('../../../factories/loggerFactory');
const ExceptionHelper = require('../../../exception/ExceptionHelper');
const SignifyException = require('../../../exception/SignifyException');

jest.mock('../../../factories/serviceFactory', () => ({
    getMongooseService: {
        getMongooseSession: jest.fn(),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction: jest.fn(),
    },
    getForumMemberService: {
        getDocumentsQuery: jest.fn(),
        getDocumentsByCustomFiltersQuery: jest.fn(),
        saveDocument: jest.fn(),
    },
    getUserService: {
        getDocumentByCustomFilters: jest.fn(),
    },
    getForumService: {
        getDocumentByCustomFilters: jest.fn(),
    },
}));

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
    },
}));

jest.mock('../../../exception/ExceptionHelper', () => ({
    validate: jest.fn(),
}));

jest.mock('../../../exception/SignifyException', () => {
    return jest.fn().mockImplementation((status, message) => ({
        status,
        loadResult: () => ({ error: message }),
    }));
});

describe('ForumMemberController Unit Test', () => {
    let forumMemberController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        forumMemberController = new ForumMemberController();
        reqMock = { body: {}, params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllForumMembers', () => {
        it('should return all forum members', async () => {
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(['member1']),
            };
            ServiceFactory.getForumMemberService.getDocumentsQuery.mockReturnValue(mockQuery);

            await forumMemberController.getAllForumMembers(reqMock, resMock);

            expect(resMock.json).toHaveBeenCalledWith(['member1']);
        });
    });

    describe('getForumMemberRecordsByUserId', () => {
        it('should return forum members by user id', async () => {
            reqMock.params.id = 'user1';
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(['member1']),
            };
            ServiceFactory.getForumMemberService.getDocumentsByCustomFiltersQuery.mockReturnValue(mockQuery);

            await forumMemberController.getForumMemberRecordsByUserId(reqMock, resMock);

            expect(resMock.json).toHaveBeenCalledWith(['member1']);
        });
    });

    describe('getForumsByPhoneNumber', () => {
        it('should return forums by user phone number', async () => {
            reqMock.params.phoneNumber = '1234567890';
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'user1' });
            ExceptionHelper.validate.mockResolvedValue(null);
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(['forum1']),
            };
            ServiceFactory.getForumMemberService.getDocumentsByCustomFiltersQuery.mockReturnValue(mockQuery);

            await forumMemberController.getForumsByPhoneNumber(reqMock, resMock);

            expect(resMock.json).toHaveBeenCalledWith(['forum1']);
        });
    });

    describe('getForumMembersByForumId', () => {
        it('should return forum members by forum id', async () => {
            reqMock.params.id = 'forum1';
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(['member1']),
            };
            ServiceFactory.getForumMemberService.getDocumentsByCustomFiltersQuery.mockReturnValue(mockQuery);

            await forumMemberController.getForumMembersByForumId(reqMock, resMock);

            expect(resMock.json).toHaveBeenCalledWith(['member1']);
        });
    });

    describe('createForumMember', () => {
        it('should create a new forum member', async () => {
            reqMock.body = { forumId: 'forum1', forumJoinee: '1234567890' };
            ExceptionHelper.validate.mockResolvedValue(null);
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'user1' });
            ServiceFactory.getForumService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'forum1' });
            ServiceFactory.getForumMemberService.saveDocument.mockResolvedValue('createdMember');

            await forumMemberController.createForumMember(reqMock, resMock);

            expect(ServiceFactory.getForumMemberService.saveDocument).toHaveBeenCalled();
            expect(resMock.json).toHaveBeenCalledWith('createdMember');
        });
    });
});