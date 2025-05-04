process.env.JWT_ACCESS_TOKEN_SECRET = 'testsecret';

jest.mock('../../factories/managerFactory', () => ({
  getJwtManager: () => ({
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'testrefresh',
    signAccessToken: jest.fn(() => 'mocked.jwt.token'),
    signRefreshToken: jest.fn(() => 'mocked.refresh.token'),
    generateAccessToken: jest.fn(() => 'mocked.jwt.token'),
    generateRefreshToken: jest.fn(() => 'mocked.refresh.token'),
  }),
}));

const UserController = require('../../controllers/UserController');
const ServiceFactory = require('../../factories/serviceFactory');
const Encrypt = require('../../utilities/encrypt');
const httpMocks = require('node-mocks-http');

jest.mock('../../factories/serviceFactory');
jest.mock('../../utilities/encrypt');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked.jwt.token'),
}));

describe('UserController - getUserByPhoneNumberForLogin (Unit)', () => {
  let controller;
  let mockRequest, mockResponse;

  beforeEach(() => {
    controller = new UserController();

    mockRequest = httpMocks.createRequest({
      method: 'POST',
      body: {
        phoneNumber: '+1234567890',
        password: 'testpassword',
      },
    });

    mockResponse = httpMocks.createResponse();
    mockResponse.status = jest.fn(() => mockResponse);
    mockResponse.json = jest.fn();
  });

  it('should return 400 if user is not found', async () => {
    ServiceFactory.getUserService = {
      getDocumentByCustomFilters: jest.fn().mockResolvedValue(null),
    };

    await controller.getUserByPhoneNumberForLogin(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Message: expect.stringMatching(/user does not exist/i),
      })
    );
  });

  it('should return 401 if password is incorrect', async () => {
    const mockUser = { phoneNumber: '+1234567890', password: 'hashed' };
    ServiceFactory.getUserService = {
      getDocumentByCustomFilters: jest.fn().mockResolvedValue(mockUser),
    };
    Encrypt.compare.mockResolvedValue(false);

    await controller.getUserByPhoneNumberForLogin(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Message: expect.stringMatching(/passwords don't match/i),
      })
    );
  });

  it('should return 200 and the user if login is successful', async () => {
    const rawUser = { _id: '123', phoneNumber: '+1234567890', password: 'hashed' };
    const mockUser = {
      ...rawUser,
      toObject: () => rawUser,
    };
    ServiceFactory.getUserService = {
      getDocumentByCustomFilters: jest.fn().mockResolvedValue(mockUser),
    };
    Encrypt.compare.mockResolvedValue(true);

    await controller.getUserByPhoneNumberForLogin(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ _id: '123', phoneNumber: '+1234567890' })
    );
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 400 if phoneNumber or password is missing', async () => {
    controller = new UserController();
    const reqMissingFields = httpMocks.createRequest({
      method: 'POST',
      body: {},
    });

    const res = httpMocks.createResponse();
    res.status = jest.fn(() => res);
    res.json = jest.fn();

    await controller.getUserByPhoneNumberForLogin(reqMissingFields, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Message: expect.stringMatching(/(not provided)/i),
      })
    );
  });

  it('should return 500 if an unexpected error occurs', async () => {
    ServiceFactory.getUserService = {
      getDocumentByCustomFilters: jest.fn().mockRejectedValue(new Error('Database error')),
    };

    await controller.getUserByPhoneNumberForLogin(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringMatching(/database error/i),
      })
    );
  });
});