
const ServiceFactory = require('../../../factories/serviceFactory');

describe('ServiceFactory Unit Test', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('should return the same CallHistoryService instance', () => {
        const instance1 = ServiceFactory.getCallHistoryService;
        const instance2 = ServiceFactory.getCallHistoryService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ChannelService instance', () => {
        const instance1 = ServiceFactory.getChannelService;
        const instance2 = ServiceFactory.getChannelService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ChannelSubscriberService instance', () => {
        const instance1 = ServiceFactory.getChannelSubscriberService;
        const instance2 = ServiceFactory.getChannelSubscriberService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ContactService instance', () => {
        const instance1 = ServiceFactory.getContactService;
        const instance2 = ServiceFactory.getContactService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ForumMemberService instance', () => {
        const instance1 = ServiceFactory.getForumMemberService;
        const instance2 = ServiceFactory.getForumMemberService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ForumPermissionsService instance', () => {
        const instance1 = ServiceFactory.getForumPermissionsService;
        const instance2 = ServiceFactory.getForumPermissionsService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ForumService instance', () => {
        const instance1 = ServiceFactory.getForumService;
        const instance2 = ServiceFactory.getForumService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ForumThreadService instance', () => {
        const instance1 = ServiceFactory.getForumThreadService;
        const instance2 = ServiceFactory.getForumThreadService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ThreadService instance', () => {
        const instance1 = ServiceFactory.getThreadService;
        const instance2 = ServiceFactory.getThreadService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same CommentService instance', () => {
        const instance1 = ServiceFactory.getCommentService;
        const instance2 = ServiceFactory.getCommentService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same GroupMemberService instance', () => {
        const instance1 = ServiceFactory.getGroupMemberService;
        const instance2 = ServiceFactory.getGroupMemberService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same GroupService instance', () => {
        const instance1 = ServiceFactory.getGroupService;
        const instance2 = ServiceFactory.getGroupService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same MediaService instance', () => {
        const instance1 = ServiceFactory.getMediaService;
        const instance2 = ServiceFactory.getMediaService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same MessageService instance', () => {
        const instance1 = ServiceFactory.getMessageService;
        const instance2 = ServiceFactory.getMessageService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ChatService instance', () => {
        const instance1 = ServiceFactory.getChatService;
        const instance2 = ServiceFactory.getChatService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same NotificationService instance', () => {
        const instance1 = ServiceFactory.getNotificationService;
        const instance2 = ServiceFactory.getNotificationService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ReactionService instance', () => {
        const instance1 = ServiceFactory.getReactionService;
        const instance2 = ServiceFactory.getReactionService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ReportService instance', () => {
        const instance1 = ServiceFactory.getReportService;
        const instance2 = ServiceFactory.getReportService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same SettingsService instance', () => {
        const instance1 = ServiceFactory.getSettingsService;
        const instance2 = ServiceFactory.getSettingsService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same ThreadCommentService instance', () => {
        const instance1 = ServiceFactory.getThreadCommentService;
        const instance2 = ServiceFactory.getThreadCommentService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same UserActivityService instance', () => {
        const instance1 = ServiceFactory.getUserActivityService;
        const instance2 = ServiceFactory.getUserActivityService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same UserService instance', () => {
        const instance1 = ServiceFactory.getUserService;
        const instance2 = ServiceFactory.getUserService;
        expect(instance1).toBe(instance2);
    });

    it('should return the same MongooseService instance', () => {
        const instance1 = ServiceFactory.getMongooseService;
        const instance2 = ServiceFactory.getMongooseService;
        expect(instance1).toBe(instance2);
    });
});
