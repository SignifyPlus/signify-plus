const AbstractService = require('../../../services/AbstractService');
const ReactionService = require('../../../services/ReactionService');

describe('ReactionService', () => {
    let svc;

    beforeAll(() => {
        svc = new ReactionService({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('getDocuments should delegate to super.getDocuments', async () => {
        const expected = ['reaction1'];
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocuments')
        .mockResolvedValue(expected);

        const result = await svc.getDocuments();
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(expected);
    });

    it('getDocumentById should delegate to super.getDocumentById', async () => {
        const expected = { id: 'r1' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentById')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentById('r1');
        expect(spy).toHaveBeenCalledWith('r1');
        expect(result).toEqual(expected);
    });

    it('getDocumentsByCustomFilters should delegate to super.getDocumentsByCustomFilters', async () => {
        const filter = { postId: 'p1' };
        const expected = [{ id: 'r2' }];
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentsByCustomFilters')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentsByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('getDocumentByCustomFilters should delegate to super.getDocumentByCustomFilters', async () => {
        const filter = { userId: 'u1' };
        const expected = { id: 'r3' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentByCustomFilters')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('updateDocument should delegate to super.updateDocument', async () => {
        const filter = { id: 'r4' };
        const updateFields = { liked: true };
        const expected = { nModified: 1 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'updateDocument')
        .mockResolvedValue(expected);

        const result = await svc.updateDocument(filter, updateFields);
        expect(spy).toHaveBeenCalledWith(filter, updateFields);
        expect(result).toEqual(expected);
    });

    it('saveDocument should delegate to super.saveDocument', async () => {
        const data = { userId: 'u2', postId: 'p2' };
        const expected = { id: 'r5' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'saveDocument')
        .mockResolvedValue(expected);

        const result = await svc.saveDocument(data);
        expect(spy).toHaveBeenCalledWith(data);
        expect(result).toEqual(expected);
    });

    it('saveDocuments should delegate to super.saveDocuments', async () => {
        const docs = [{ userId: 'u3' }, { userId: 'u4' }];
        const expected = [{ id: 'r6' }, { id: 'r7' }];
        const spy = jest
        .spyOn(AbstractService.prototype, 'saveDocuments')
        .mockResolvedValue(expected);

        const result = await svc.saveDocuments(docs);
        expect(spy).toHaveBeenCalledWith(docs);
        expect(result).toEqual(expected);
    });

    it('deleteDocument should delegate to super.deleteDocument', async () => {
        const filter = { id: 'r8' };
        const expected = { deletedCount: 1 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'deleteDocument')
        .mockResolvedValue(expected);

        const result = await svc.deleteDocument(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('deleteDocumentById should delegate to super.deleteDocumentById', async () => {
        const expected = { deletedCount: 1 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'deleteDocumentById')
        .mockResolvedValue(expected);

        const result = await svc.deleteDocumentById('r9');
        expect(spy).toHaveBeenCalledWith('r9');
        expect(result).toEqual(expected);
    });

    it('deleteDocuments should delegate to super.deleteDocuments', async () => {
        const filter = { userId: 'u5' };
        const expected = { deletedCount: 2 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'deleteDocuments')
        .mockResolvedValue(expected);

        const result = await svc.deleteDocuments(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('getDocumentsByCustomFiltersQuery should delegate to super.getDocumentsByCustomFiltersQuery', () => {
        const filter = { postId: 'p3' };
        const expected = { query: true };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentsByCustomFiltersQuery')
        .mockReturnValue(expected);

        const result = svc.getDocumentsByCustomFiltersQuery(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });
});