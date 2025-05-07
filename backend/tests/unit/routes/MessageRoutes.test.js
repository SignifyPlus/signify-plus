const mockPost = jest.fn();
const mockDelete = jest.fn();

jest.mock('express', () => ({
    Router: () => ({
        post: mockPost,
        delete: mockDelete,
    }),
}));

jest.mock('../../../factories/controllerFactory.js', () => {
    const mockMessageController = {
        postMessage: 'mockPostMessage',
        deleteMessage: 'mockDeleteMessage',
    };
    return {
        getMessageController: () => mockMessageController,
    };
});

describe('MessageRoutes Unit Test', () => {
    beforeEach(() => {
        mockPost.mockClear();
        mockDelete.mockClear();
        jest.resetModules();
    });

    it('should register POST /create', () => {
        require('../../../routes/MessageRoutes');
        expect(mockPost).toHaveBeenCalledWith('/create', 'mockPostMessage');
    });

    it('should register DELETE /delete', () => {
        require('../../../routes/MessageRoutes');
        expect(mockDelete).toHaveBeenCalledWith('/delete', 'mockDeleteMessage');
    });
});