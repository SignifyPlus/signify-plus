const NotificationPushManager = require('../../../managers/notificationPushManager');
const webpush = require('web-push');

jest.mock('web-push', () => ({
    setVapidDetails: jest.fn(),
}));

describe('NotificationPushManager Unit Test', () => {
    let mockApplicationServer;

    beforeEach(() => {
        jest.clearAllMocks();
        mockApplicationServer = {
            post: jest.fn(),
        };
    });

    it('should set VAPID details during construction', () => {
        process.env.EMAIL = 'test@example.com';
        const manager = new NotificationPushManager(
            mockApplicationServer,
            'testPublicKey',
            'testPrivateKey'
        );

        expect(webpush.setVapidDetails).toHaveBeenCalledWith(
            'test@example.com',
            'testPublicKey',
            'testPrivateKey'
        );
    });

    it('should define /subscribe POST endpoint', () => {
        const manager = new NotificationPushManager(
            mockApplicationServer,
            'testPublicKey',
            'testPrivateKey'
        );

        manager.post();

        expect(mockApplicationServer.post).toHaveBeenCalledWith(
            '/subscribe',
            expect.any(Function)
        );
    });
});