const FirebaseManager = require('../../../../managers/firebase/firebaseManager');
const FirebaseAdmin = require('../../../../managers/firebase/models/FirebaseAdmin');
const admin = require('firebase-admin');
const CommonUtils = require('../../../../utilities/commonUtils');

jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(() => ({
        auth: jest.fn(() => ({
        createUser: jest.fn(),
        getUserByPhoneNumber: jest.fn(),
        })),
    })),
    credential: {
        cert: jest.fn(() => 'mocked-cert'),
    },
}));

jest.mock('../../../../utilities/commonUtils', () => ({
    decodeFromBase64: jest.fn(async (base64) => base64),
}));

jest.mock('../../../../factories/loggerFactory', () => ({
    getApplicationLogger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

describe('FirebaseManager Unit Test', () => {
    let firebaseManager;
    const mockCredential = {
        privateKey: 'PRIVATE_KEY',
        clientEmail: 'EMAIL',
        projectId: 'PROJECT_ID',
    };
    const mockCredentialBase64 = JSON.stringify(mockCredential);

    beforeEach(() => {
        jest.clearAllMocks();
        firebaseManager = new FirebaseManager();
    });

    it('should initialize firebase app with correct credential', async () => {
        await firebaseManager.connectToFireBase(mockCredentialBase64);
    
        expect(CommonUtils.decodeFromBase64).toHaveBeenCalledWith(mockCredentialBase64);
        expect(admin.credential.cert).toHaveBeenCalledWith(expect.any(FirebaseAdmin));
        expect(admin.initializeApp).toHaveBeenCalledWith(
        { credential: 'mocked-cert' }
        );
    });

    it('should return adminSdk instance', async () => {
        await firebaseManager.connectToFireBase(mockCredentialBase64);

        const adminSdk = await firebaseManager.getfirebaseAdminSdk();
        expect(adminSdk.auth).toBeDefined();
        expect(typeof adminSdk.auth).toBe('function');
    });
});