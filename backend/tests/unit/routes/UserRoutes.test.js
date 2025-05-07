const mockGet = jest.fn();
const mockPost = jest.fn();
const mockDelete = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        get: mockGet,
        post: mockPost,
        delete: mockDelete,
    }),
}));

const mockUserController = {
    getAllUsers: 'mockGetAllUsers',
    createUser: 'mockCreateUser',
    deleteUser: 'mockDeleteUser',
    deleteUserById: 'mockDeleteUserById',
    getUserById: 'mockGetUserById',
    getUserByPhoneNumber: 'mockGetUserByPhoneNumber',
    getUserByPhoneNumberForLogin: 'mockGetUserByPhoneNumberForLogin',
};

jest.mock('../../../factories/controllerFactory.js', () => ({
    getUserController: () => mockUserController,
}));

describe('UserRoutes Unit Test', () => {
    beforeEach(() => {
        mockGet.mockClear();
        mockPost.mockClear();
        mockDelete.mockClear();
        jest.resetModules();
    });

    it('should register GET /all', () => {
        require('../../../routes/UserRoutes');
        expect(mockGet).toHaveBeenCalledWith('/all', 'mockGetAllUsers');
    });

    it('should register POST /create', () => {
        require('../../../routes/UserRoutes');
        expect(mockPost).toHaveBeenCalledWith('/create', 'mockCreateUser');
    });

    it('should register DELETE /delete/filter/', () => {
        require('../../../routes/UserRoutes');
        expect(mockDelete).toHaveBeenCalledWith('/delete/filter/', 'mockDeleteUser');
    });

    it('should register DELETE /delete/:id', () => {
        require('../../../routes/UserRoutes');
        expect(mockDelete).toHaveBeenCalledWith('/delete/:id', 'mockDeleteUserById');
    });

    it('should register GET /:id', () => {
        require('../../../routes/UserRoutes');
        expect(mockGet).toHaveBeenCalledWith('/:id', 'mockGetUserById');
    });

    it('should register GET /phone/:phoneNumber', () => {
        require('../../../routes/UserRoutes');
        expect(mockGet).toHaveBeenCalledWith('/phone/:phoneNumber', 'mockGetUserByPhoneNumber');
    });

    it('should register POST /phone/', () => {
        require('../../../routes/UserRoutes');
        expect(mockPost).toHaveBeenCalledWith('/phone/', 'mockGetUserByPhoneNumberForLogin');
    });
});