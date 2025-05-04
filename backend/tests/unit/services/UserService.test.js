const AbstractService = require('../../../services/AbstractService');
const UserService = require('../../../services/UserService');

describe('UserService', () => {
    let svc;
    beforeEach(() => {
        svc = new UserService('FakeModel');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('getDocuments should delegate to super.getDocuments', async () => {
        const expected = ['doc1', 'doc2'];
        const spy = jest.spyOn(AbstractService.prototype, 'getDocuments').mockResolvedValue(expected);
        const result = await svc.getDocuments();
        expect(spy).toHaveBeenCalledWith(null);
        expect(result).toBe(expected);
    });

    it('getDocumentById should delegate to super.getDocumentById', async () => {
        const expected = { id: '1' };
        const spy = jest.spyOn(AbstractService.prototype, 'getDocumentById').mockResolvedValue(expected);
        const result = await svc.getDocumentById('1');
        expect(spy).toHaveBeenCalledWith('1', null);
        expect(result).toBe(expected);
    });

    it('getDocumentsByCustomFilters should delegate to super.getDocumentsByCustomFilters', async () => {
        const filter = { foo: 'bar' };
        const expected = [{ foo: 'bar' }];
        const spy = jest.spyOn(AbstractService.prototype, 'getDocumentsByCustomFilters').mockResolvedValue(expected);
        const result = await svc.getDocumentsByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toBe(expected);
    });

    it('getDocumentByCustomFilters should delegate to super.getDocumentByCustomFilters', async () => {
        const filter = { baz: true };
        const expected = { baz: true };
        const spy = jest.spyOn(AbstractService.prototype, 'getDocumentByCustomFilters').mockResolvedValue(expected);
        const result = await svc.getDocumentByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toBe(expected);
    });

    it('updateDocument should delegate to super.updateDocument', async () => {
        const filter = { id: 'u1' };
        const updates = { name: 'new' };
        const expected = { id: 'u1', name: 'new' };
        const spy = jest.spyOn(AbstractService.prototype, 'updateDocument').mockResolvedValue(expected);
        const result = await svc.updateDocument(filter, updates);
        expect(spy).toHaveBeenCalledWith(filter, updates, null);
        expect(result).toBe(expected);
    });

    it('saveDocument should delegate to super.saveDocument', async () => {
        const data = { foo: 'bar' };
        const expected = { foo: 'bar' };
        const spy = jest.spyOn(AbstractService.prototype, 'saveDocument').mockResolvedValue(expected);
        const result = await svc.saveDocument(data);
        expect(spy).toHaveBeenCalledWith(data, null);
        expect(result).toBe(expected);
    });

    it('saveDocuments should delegate to super.saveDocuments', async () => {
        const docs = [{ a: 1 }, { b: 2 }];
        const expected = docs;
        const spy = jest.spyOn(AbstractService.prototype, 'saveDocuments').mockResolvedValue(expected);
        const result = await svc.saveDocuments(docs);
        expect(spy).toHaveBeenCalledWith(docs, null);
        expect(result).toBe(expected);
    });

    it('deleteDocument should delegate to super.deleteDocument', async () => {
        const filter = { active: false };
        const expected = { deleted: true };
        const spy = jest.spyOn(AbstractService.prototype, 'deleteDocument').mockResolvedValue(expected);
        const result = await svc.deleteDocument(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toBe(expected);
    });

    it('deleteDocumentById should delegate to super.deleteDocumentById', async () => {
        const id = 'del1';
        const expected = { id: 'del1' };
        const spy = jest.spyOn(AbstractService.prototype, 'deleteDocumentById').mockResolvedValue(expected);
        const result = await svc.deleteDocumentById(id);
        expect(spy).toHaveBeenCalledWith(id, null);
        expect(result).toBe(expected);
    });

    it('deleteDocuments should delegate to super.deleteDocuments', async () => {
        const filter = { obsolete: true };
        const expected = { count: 5 };
        const spy = jest.spyOn(AbstractService.prototype, 'deleteDocuments').mockResolvedValue(expected);
        const result = await svc.deleteDocuments(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toBe(expected);
    });

    it('getDocumentsByCustomFiltersQuery should delegate to super.getDocumentsByCustomFiltersQuery', () => {
        const filter = { q: 1 };
        const expected = ['q'];
        const spy = jest.spyOn(AbstractService.prototype, 'getDocumentsByCustomFiltersQuery').mockReturnValue(expected);
        const result = svc.getDocumentsByCustomFiltersQuery(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toBe(expected);
    });

    it('getDocumentByCustomFiltersQuery should delegate to super.getDocumentByCustomFiltersQuery', () => {
        const filter = { x: 2 };
        const expected = { x: 2 };
        const spy = jest.spyOn(AbstractService.prototype, 'getDocumentByCustomFiltersQuery').mockReturnValue(expected);
        const result = svc.getDocumentByCustomFiltersQuery(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toBe(expected);
    });
});