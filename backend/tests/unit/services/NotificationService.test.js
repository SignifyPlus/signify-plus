const AbstractService = require('../../../services/AbstractService');
const NotificationService = require('../../../services/NotificationService');

describe('NotificationService', () => {
    let svc;

    beforeAll(() => {
        svc = new NotificationService({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('getDocuments should delegate to super.getDocuments', async () => {
        const expected = ['doc1'];
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocuments')
        .mockResolvedValue(expected);

        const result = await svc.getDocuments();
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(expected);
    });

    it('getDocumentById should delegate to super.getDocumentById', async () => {
        const expected = { id: '1' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentById')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentById('1');
        expect(spy).toHaveBeenCalledWith('1');
        expect(result).toEqual(expected);
    });

    it('getDocumentsByCustomFilters should delegate to super.getDocumentsByCustomFilters', async () => {
        const filter = { active: true };
        const expected = [{ id: 'a' }];
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentsByCustomFilters')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentsByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('getDocumentByCustomFilters should delegate to super.getDocumentByCustomFilters', async () => {
        const filter = { userId: 'u1' };
        const expected = { id: 'b' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentByCustomFilters')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('updateDocument should delegate to super.updateDocument', async () => {
        const filter = { id: '1' };
        const update = { active: false };
        const expected = { ok: true };
        const spy = jest
        .spyOn(AbstractService.prototype, 'updateDocument')
        .mockResolvedValue(expected);

        const result = await svc.updateDocument(filter, update);
        expect(spy).toHaveBeenCalledWith(filter, update);
        expect(result).toEqual(expected);
    });

    it('saveDocument should delegate to super.saveDocument', async () => {
        const data = { foo: 'bar' };
        const expected = { id: 'x' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'saveDocument')
        .mockResolvedValue(expected);

        const result = await svc.saveDocument(data);
        expect(spy).toHaveBeenCalledWith(data);
        expect(result).toEqual(expected);
    });

    it('saveDocuments should delegate to super.saveDocuments', async () => {
        const docs = [{ a: 1 }, { b: 2 }];
        const expected = [{ id: 'x' }, { id: 'y' }];
        const spy = jest
        .spyOn(AbstractService.prototype, 'saveDocuments')
        .mockResolvedValue(expected);

        const result = await svc.saveDocuments(docs);
        expect(spy).toHaveBeenCalledWith(docs);
        expect(result).toEqual(expected);
    });

    it('deleteDocument should delegate to super.deleteDocument', async () => {
        const filter = { id: '1' };
        const expected = { deleted: true };
        const spy = jest
        .spyOn(AbstractService.prototype, 'deleteDocument')
        .mockResolvedValue(expected);

        const result = await svc.deleteDocument(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('deleteDocumentById should delegate to super.deleteDocumentById', async () => {
        const expected = { deleted: true };
        const spy = jest
        .spyOn(AbstractService.prototype, 'deleteDocumentById')
        .mockResolvedValue(expected);

        const result = await svc.deleteDocumentById('id2');
        expect(spy).toHaveBeenCalledWith('id2');
        expect(result).toEqual(expected);
    });

    it('deleteDocuments should delegate to super.deleteDocuments', async () => {
        const filter = { status: 'old' };
        const expected = { count: 2 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'deleteDocuments')
        .mockResolvedValue(expected);

        const result = await svc.deleteDocuments(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('getDocumentsByCustomFiltersQuery should delegate to super.getDocumentsByCustomFiltersQuery', () => {
        const filter = { active: true };
        const expected = { query: true };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentsByCustomFiltersQuery')
        .mockReturnValue(expected);

        const result = svc.getDocumentsByCustomFiltersQuery(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });
});