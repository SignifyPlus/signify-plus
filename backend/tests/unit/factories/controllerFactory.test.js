const ControllerFactory = require('../../../factories/controllerFactory');

describe('ControllerFactory Unit Test', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('should return the same UserController instance', () => {
        const instance1 = ControllerFactory.getUserController();
        const instance2 = ControllerFactory.getUserController();
        expect(instance1).toBe(instance2);
    });

    it('should return the same ChatController instance', () => {
        const instance1 = ControllerFactory.getChatController();
        const instance2 = ControllerFactory.getChatController();
        expect(instance1).toBe(instance2);
    });

    it('should return the same MessageController instance', () => {
        const instance1 = ControllerFactory.getMessageController();
        const instance2 = ControllerFactory.getMessageController();
        expect(instance1).toBe(instance2);
    });

    it('should return the same ContactController instance', () => {
        const instance1 = ControllerFactory.getContactController();
        const instance2 = ControllerFactory.getContactController();
        expect(instance1).toBe(instance2);
    });

    it('should return the same UserActivityController instance', () => {
        const instance1 = ControllerFactory.getUserActivitiyController();
        const instance2 = ControllerFactory.getUserActivitiyController();
        expect(instance1).toBe(instance2);
    });

    it('should return the same ForumController instance', () => {
        const instance1 = ControllerFactory.getForumController();
        const instance2 = ControllerFactory.getForumController();
        expect(instance1).toBe(instance2);
    });

    it('should return the same ForumMemberController instance', () => {
        const instance1 = ControllerFactory.getForumMemberController();
        const instance2 = ControllerFactory.getForumMemberController();
        expect(instance1).toBe(instance2);
    });

    it('should return the same ThreadController instance', () => {
        const instance1 = ControllerFactory.getThreadController();
        const instance2 = ControllerFactory.getThreadController();
        expect(instance1).toBe(instance2);
    });

    it('should return the same CommentController instance', () => {
        const instance1 = ControllerFactory.getCommentController();
        const instance2 = ControllerFactory.getCommentController();
        expect(instance1).toBe(instance2);
    });

    it('should return the same SettingsController instance', () => {
        const instance1 = ControllerFactory.getSettingsController();
        const instance2 = ControllerFactory.getSettingsController();
        expect(instance1).toBe(instance2);
    });
});