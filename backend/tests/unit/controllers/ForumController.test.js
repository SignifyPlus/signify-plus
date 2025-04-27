const ForumController = require('../../../controllers/ForumController');
const ServiceFactory = require('../../../factories/serviceFactory');
const LoggerFactory = require('../../../factories/loggerFactory');
const ExceptionHelper = require('../../../exception/ExceptionHelper');
const SignifyException = require('../../../exception/SignifyException');
const ModelConstants = require('../../../constants/modelConstants');
const ControllerConstants = require('../../../constants/controllerConstants');

jest.mock('../../../factories/serviceFactory', () => ({
    getMongooseService: {
        getMongooseSession: jest.fn(),
        startMongooseTransaction: jest.fn(),
        commitMongooseTransaction: jest.fn(),
        abandonMongooseTransaction: jest.fn(),
    },
    getForumService: {
        getDocuments: jest.fn(),
        getDocumentById: jest.fn(),
        saveDocument: jest.fn(),
    },
    getUserService: {
        getDocumentByCustomFilters: jest.fn(),
    },
    getForumMemberService: {
        saveDocument: jest.fn(),
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

jest.mock('../../../constants/modelConstants', () => ({
    FORUM_DEFAULT_DESCRIPTION: 'Default description',
}));

jest.mock('../../../constants/controllerConstants', () => ({
    ZERO_INDEX: 0,
}));

describe('ForumController Unit Test', () => {
    let forumController;
    let reqMock;
    let resMock;

    beforeEach(() => {
        forumController = new ForumController();
        reqMock = { body: {}, params: {} };
        resMock = {
        json: jest.fn(),
        status: jest.fn(() => resMock),
        };
        jest.clearAllMocks();
    });

    describe('getAllForums', () => {
        it('should return all forums', async () => {
            ServiceFactory.getForumService.getDocuments.mockResolvedValue(['forum1']);
            await forumController.getAllForums(reqMock, resMock);
            expect(resMock.json).toHaveBeenCalledWith(['forum1']);
        });
    });

    describe('getForumById', () => {
        it('should return a forum by ID', async () => {
            reqMock.params.id = '123';
            ServiceFactory.getForumService.getDocumentById.mockResolvedValue('forum1');
            await forumController.getForumById(reqMock, resMock);
            expect(resMock.json).toHaveBeenCalledWith('forum1');
        });
    });

    describe('createForum', () => {
        it('should create a forum and a forum member', async () => {
            reqMock.body = { forumName: 'TestForum', createdBy: '1234567890' };

            ExceptionHelper.validate.mockResolvedValue(null);
            ServiceFactory.getUserService.getDocumentByCustomFilters.mockResolvedValue({ _id: 'userId' });
            ServiceFactory.getForumService.saveDocument.mockResolvedValue([{ _id: 'forumId' }]);
            ServiceFactory.getForumMemberService.saveDocument.mockResolvedValue({ _id: 'forumMemberId' });

            await forumController.createForum(reqMock, resMock);

            expect(ServiceFactory.getForumService.saveDocument).toHaveBeenCalled();
            expect(ServiceFactory.getForumMemberService.saveDocument).toHaveBeenCalled();
            expect(ServiceFactory.getMongooseService.commitMongooseTransaction).toHaveBeenCalled();
            expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining({
                forum: expect.any(Array),
                forumMember: expect.any(Object),
            }));
        });
    });
});
