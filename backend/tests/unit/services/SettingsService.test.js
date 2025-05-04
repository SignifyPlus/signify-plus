const AbstractService = require('../../../services/AbstractService');
const SettingsService = require('../../../services/SettingsService');

describe('SettingsService', () => {
    let svc;

    beforeAll(() => {
        svc = new SettingsService({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('getDocuments should delegate to super.getDocuments', async () => {
        const expected = ['s1'];
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocuments')
        .mockResolvedValue(expected);

        const result = await svc.getDocuments();
        expect(spy).toHaveBeenCalledWith(null);
        expect(result).toEqual(expected);
    });

    it('getDocumentById should delegate to super.getDocumentById', async () => {
        const expected = { id: 's2' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentById')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentById('s2');
        expect(spy).toHaveBeenCalledWith('s2', null);
        expect(result).toEqual(expected);
    });

    it('getDocumentsByCustomFilters should delegate to super.getDocumentsByCustomFilters', async () => {
        const filter = { key: 'value' };
        const expected = [{ id: 's3' }];
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentsByCustomFilters')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentsByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toEqual(expected);
    });

    it('getDocumentByCustomFilters should delegate to super.getDocumentByCustomFilters', async () => {
        const filter = { foo: 'bar' };
        const expected = { id: 's4' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentByCustomFilters')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toEqual(expected);
    });

    it('updateDocument should delegate to super.updateDocument', async () => {
        const filter = { id: 's5' };
        const updateFields = { enabled: true };
        const expected = { modifiedCount: 1 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'updateDocument')
        .mockResolvedValue(expected);

        const result = await svc.updateDocument(filter, updateFields);
        expect(spy).toHaveBeenCalledWith(filter, updateFields, null);
        expect(result).toEqual(expected);
    });

    it('saveDocument should delegate to super.saveDocument', async () => {
        const data = { setting: 'on' };
        const expected = { id: 's6' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'saveDocument')
        .mockResolvedValue(expected);

        const result = await svc.saveDocument(data);
        expect(spy).toHaveBeenCalledWith(data, null);
        expect(result).toEqual(expected);
    });

    it('saveDocuments should delegate to super.saveDocuments', async () => {
        const docs = [{ a: 1 }, { b: 2 }];
        const expected = [{ id: 's7' }, { id: 's8' }];
        const spy = jest
        .spyOn(AbstractService.prototype, 'saveDocuments')
        .mockResolvedValue(expected);

        const result = await svc.saveDocuments(docs);
        expect(spy).toHaveBeenCalledWith(docs, null);
        expect(result).toEqual(expected);
    });

    it('deleteDocument should delegate to super.deleteDocument', async () => {
        const filter = { id: 's9' };
        const expected = { deletedCount: 1 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'deleteDocument')
        .mockResolvedValue(expected);

        const result = await svc.deleteDocument(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toEqual(expected);
    });

    it('deleteDocumentById should delegate to super.deleteDocumentById', async () => {
        const expected = { deletedCount: 1 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'deleteDocumentById')
        .mockResolvedValue(expected);

        const result = await svc.deleteDocumentById('s10');
        expect(spy).toHaveBeenCalledWith('s10', null);
        expect(result).toEqual(expected);
    });

    it('deleteDocuments should delegate to super.deleteDocuments', async () => {
        const filter = { obsolete: true };
        const expected = { deletedCount: 2 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'deleteDocuments')
        .mockResolvedValue(expected);

        const result = await svc.deleteDocuments(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toEqual(expected);
    });

    it('getDocumentsByCustomFiltersQuery should delegate to super.getDocumentsByCustomFiltersQuery', () => {
        const filter = { active: false };
        const expected = { query: true };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentsByCustomFiltersQuery')
        .mockReturnValue(expected);

        const result = svc.getDocumentsByCustomFiltersQuery(filter);
        expect(spy).toHaveBeenCalledWith(filter, null);
        expect(result).toEqual(expected);
    });
});