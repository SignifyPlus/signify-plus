jest.mock('express', () => {
    const express = jest.fn(() => {
    const app = {
        use: jest.fn(),
    };
    return app;
    });
    express.json = jest.fn(() => 'json-middleware');
    return express;
});

jest.mock('http', () => ({
    createServer: jest.fn(() => ({
    listen: jest.fn((port, callback) => callback && callback()),
    })),
}));

jest.mock('../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
    info: jest.fn(),
    error: jest.fn(),
    },
    setApplicationLogger: null,
}));

jest.mock('../../../utilities/commonUtils', () => ({
    getLogger: jest.fn(async () => ({
    info: jest.fn(),
    error: jest.fn(),
    })),
    waitForVariableToBecomeNonNull: jest.fn(async () => {}),
}));

jest.mock('../../../factories/managerFactory', () => ({
    getRabbitMqQueueManager: jest.fn(() => ({
    establishConnection: jest.fn(async () => {}),
    getRabbitMqChannel: jest.fn(() => ({})),
    })),
    getRabbitMqProcessorManager: jest.fn(() => ({
    executeMessageProcessor: jest.fn(async () => {}),
    })),
    getFirebaseManager: jest.fn(() => ({
    connectToFireBase: jest.fn(async () => {}),
    })),
}));

jest.mock('../../../factories/eventFactory', () => ({
    setMessageEvent: null,
    setAccessibilitySettingsEvent: null,
    setUserEvent: null,
}));

jest.mock('../../../factories/serviceFactory', () => ({
    getMongooseService: {
    connectToMongoDB: jest.fn(async () => {}),
    },
}));

jest.mock('../../../managers/websocketManager', () => {
    return jest.fn(() => ({}));
});

//dummy route mocks
jest.mock('../../../routes/UserRoutes.js', () => (req, res, next) => next());
jest.mock('../../../routes/HomeRoute.js', () => (req, res, next) => next());
jest.mock('../../../routes/ContactRoutes.js', () => (req, res, next) => next());
jest.mock('../../../routes/ChatRoutes.js', () => (req, res, next) => next());
jest.mock('../../../routes/MessageRoutes.js', () => (req, res, next) => next());
jest.mock('../../../routes/ForumRoutes.js', () => (req, res, next) => next());
jest.mock('../../../routes/ForumMemberRoutes.js', () => (req, res, next) => next());
jest.mock('../../../routes/ThreadRoutes.js', () => (req, res, next) => next());
jest.mock('../../../routes/CommentRoutes.js', () => (req, res, next) => next());
jest.mock('../../../routes/SettingsRoutes.js', () => (req, res, next) => next());

describe('Server Main Flow Unit Test', () => {
    it('should setup logger, initialize server, connect to database and listen on port', async () => {
        process.env.MONGO_DB_URL = 'mongodb://localhost:27017/testdb';
        process.env.PORT = '3000';
        process.env.LOG_LEVEL_DEBUG = 'debug';
    
        await require('../../../server/server');
    
        expect(require('express')).toHaveBeenCalled();
        expect(require('http').createServer).toHaveBeenCalled();
        expect(require('../../../factories/loggerFactory').getApplicationLogger.info).toHaveBeenCalledWith(
            'SignifyPlus Server is Up & Running'
        );
        expect(require('../../../factories/serviceFactory').getMongooseService.connectToMongoDB).toHaveBeenCalledWith(
            'mongodb://localhost:27017/testdb'
        );
    });
});
