const AbstractService = require('../../../services/AbstractService');
const UserAuthenticationService = require('../../../services/UserAuthenticationService');

describe('UserAuthenticationService', () => {
    let svc;
    let spy;

    beforeEach(() => {
        svc = new UserAuthenticationService({});
        jest.restoreAllMocks();
    });

    it('getDocuments should delegate to super.getDocuments', async () => {
        spy = jest.spyOn(AbstractService.prototype, 'getDocuments').mockResolvedValue('docs');
        const result = await svc.getDocuments();
        expect(spy).toHaveBeenCalled();
        expect(result).toBe('docs');
    });

    it('getDocumentById should delegate to super.getDocumentById', async () => {
        spy = jest.spyOn(AbstractService.prototype, 'getDocumentById').mockResolvedValue('doc');
        const result = await svc.getDocumentById('id1');
        expect(spy).toHaveBeenCalledWith('id1', null);
        expect(result).toBe('doc');
    });

    it('getDocumentsByCustomFilters should delegate to super.getDocumentsByCustomFilters', async () => {
        spy = jest.spyOn(AbstractService.prototype, 'getDocumentsByCustomFilters').mockResolvedValue(['a']);
        const filter = { key: 'value' };
        const result = await svc.getDocumentsByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toEqual(['a']);
    });

    it('getDocumentByCustomFilters should delegate to super.getDocumentByCustomFilters', async () => {
        spy = jest.spyOn(AbstractService.prototype, 'getDocumentByCustomFilters').mockResolvedValue('x');
        const filter = { foo: 'bar' };
        const result = await svc.getDocumentByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toBe('x');
    });

    it('updateDocument should delegate to super.updateDocument', async () => {
        spy = jest.spyOn(AbstractService.prototype, 'updateDocument').mockResolvedValue('u');
        const filter = { id: 'u2' };
        const updates = { count: 5 };
        const result = await svc.updateDocument(filter, updates);
        expect(spy).toHaveBeenCalledWith(filter, updates, null);
        expect(result).toBe('u');
    });

    it('saveDocument should delegate to super.saveDocument', async () => {
        spy = jest.spyOn(AbstractService.prototype, 'saveDocument').mockResolvedValue('s');
        const data = { a: 1 };
        const result = await svc.saveDocument(data);
        expect(spy).toHaveBeenCalledWith(data, null);
        expect(result).toBe('s');
    });

    it('saveDocuments should delegate to super.saveDocuments', async () => {
        spy = jest.spyOn(AbstractService.prototype, 'saveDocuments').mockResolvedValue([1, 2]);
        const docs = [{}, {}];
        const result = await svc.saveDocuments(docs);
        expect(spy).toHaveBeenCalledWith(docs, null);
        expect(result).toEqual([1, 2]);
    });

    it('deleteDocument should delegate to super.deleteDocument', async () => {
        spy = jest.spyOn(AbstractService.prototype, 'deleteDocument').mockResolvedValue('d');
        const filter = { id: 'd1' };
        const result = await svc.deleteDocument(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toBe('d');
    });

    it('deleteDocumentById should delegate to super.deleteDocumentById', async () => {
        spy = jest.spyOn(AbstractService.prototype, 'deleteDocumentById').mockResolvedValue('dd');
        const id = 'd2';
        const result = await svc.deleteDocumentById(id);
        expect(spy).toHaveBeenCalledWith(id, null);
        expect(result).toBe('dd');
    });

    it('deleteDocuments should delegate to super.deleteDocuments', async () => {
        spy = jest.spyOn(AbstractService.prototype, 'deleteDocuments').mockResolvedValue(['z']);
        const filter = { flag: true };
        const result = await svc.deleteDocuments(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toEqual(['z']);
    });

    it('getDocumentsByCustomFiltersQuery should delegate to super.getDocumentsByCustomFiltersQuery', () => {
        spy = jest.spyOn(AbstractService.prototype, 'getDocumentsByCustomFiltersQuery').mockReturnValue('q');
        const filter = { q: 1 };
        const result = svc.getDocumentsByCustomFiltersQuery(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toBe('q');
    });
});