const MessageService = require('../../../services/MessageService');

describe('MessageService', () => {
    let service;
    let fakeModel;

    beforeEach(() => {
        fakeModel = {
            find: jest.fn(() => ({ sort: jest.fn(() => ({ lean: jest.fn(() => 'sorted messages') })) })),
            findOne: jest.fn(() => ({ sort: jest.fn(() => ({ lean: jest.fn(() => 'latest message') })) })),
        };

        service = new MessageService(fakeModel);

        service.__proto__.getDocuments = jest.fn(() => 'all messages');
        service.__proto__.getDocumentById = jest.fn(() => 'message by id');
        service.__proto__.getDocumentsByCustomFilters = jest.fn(() => 'filtered messages');
        service.__proto__.getDocumentByCustomFilters = jest.fn(() => 'one message');
        service.__proto__.updateDocument = jest.fn(() => 'updated message');
        service.__proto__.saveDocument = jest.fn(() => 'saved message');
        service.__proto__.saveDocuments = jest.fn(() => ['msg1', 'msg2']);
        service.__proto__.deleteDocument = jest.fn(() => 'deleted message');
        service.__proto__.deleteDocumentById = jest.fn(() => 'deleted message by id');
        service.__proto__.deleteDocuments = jest.fn(() => 'bulk deleted');
        service.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => 'query object');
    });

    test('delegates getDocuments to super', async () => {
        expect(await service.getDocuments()).toBe('all messages');
    });

    test('delegates getDocumentById to super', async () => {
        expect(await service.getDocumentById('123')).toBe('message by id');
    });

    test('delegates getDocumentsByCustomFilters to super', async () => {
        expect(await service.getDocumentsByCustomFilters({ user: 'A' })).toBe('filtered messages');
    });

    test('delegates getDocumentByCustomFilters to super', async () => {
        expect(await service.getDocumentByCustomFilters({ user: 'A' })).toBe('one message');
    });

    test('delegates updateDocument to super', async () => {
        expect(await service.updateDocument({ id: 1 }, { read: true })).toBe('updated message');
    });

    test('delegates saveDocument to super', async () => {
        expect(await service.saveDocument({ content: 'Hi' })).toBe('saved message');
    });

    test('delegates saveDocuments to super', async () => {
        expect(await service.saveDocuments([{ msg: '1' }, { msg: '2' }])).toEqual(['msg1', 'msg2']);
    });

    test('delegates deleteDocument to super', async () => {
        expect(await service.deleteDocument({ id: 1 })).toBe('deleted message');
    });

    test('delegates deleteDocumentById to super', async () => {
        expect(await service.deleteDocumentById('456')).toBe('deleted message by id');
    });

    test('delegates deleteDocuments to super', async () => {
        expect(await service.deleteDocuments({ read: true })).toBe('bulk deleted');
    });

    test('delegates getDocumentsByCustomFiltersQuery to super', () => {
        expect(service.getDocumentsByCustomFiltersQuery({ read: false })).toBe('query object');
    });

    test('findLatestDocument returns latest sorted and lean message', async () => {
        const result = await service.findLatestDocument({ user: 'B' });
        expect(result).toBe('latest message');
        expect(fakeModel.findOne).toHaveBeenCalledWith({ user: 'B' });
    });

    test('getDocumentsByCustomFiltersAndSortByCreatedAt returns sorted and lean messages', async () => {
        const result = await service.getDocumentsByCustomFiltersAndSortByCreatedAt({ user: 'C' });
        expect(result).toBe('sorted messages');
        expect(fakeModel.find).toHaveBeenCalledWith({ user: 'C' });
    });
});
