const AbstractService = require('../../../services/AbstractService');
const ReportService = require('../../../services/ReportService');

describe('ReportService', () => {
    let svc;

    beforeAll(() => {
        svc = new ReportService({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('getDocuments should delegate to super.getDocuments', async () => {
        const expected = ['r1'];
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocuments')
        .mockResolvedValue(expected);

        const result = await svc.getDocuments();
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(expected);
    });

    it('getDocumentById should delegate to super.getDocumentById', async () => {
        const expected = { id: 'r2' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentById')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentById('r2');
        expect(spy).toHaveBeenCalledWith('r2');
        expect(result).toEqual(expected);
    });

    it('getDocumentsByCustomFilters should delegate to super.getDocumentsByCustomFilters', async () => {
        const filter = { status: 'active' };
        const expected = [{ id: 'r3' }];
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentsByCustomFilters')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentsByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('getDocumentByCustomFilters should delegate to super.getDocumentByCustomFilters', async () => {
        const filter = { type: 'report' };
        const expected = { id: 'r4' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentByCustomFilters')
        .mockResolvedValue(expected);

        const result = await svc.getDocumentByCustomFilters(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('updateDocument should delegate to super.updateDocument', async () => {
        const filter = { id: 'r5' };
        const updateFields = { reviewed: true };
        const expected = { modifiedCount: 1 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'updateDocument')
        .mockResolvedValue(expected);

        const result = await svc.updateDocument(filter, updateFields);
        expect(spy).toHaveBeenCalledWith(filter, updateFields);
        expect(result).toEqual(expected);
    });

    it('saveDocument should delegate to super.saveDocument', async () => {
        const data = { title: 'Report1' };
        const expected = { id: 'r6' };
        const spy = jest
        .spyOn(AbstractService.prototype, 'saveDocument')
        .mockResolvedValue(expected);

        const result = await svc.saveDocument(data);
        expect(spy).toHaveBeenCalledWith(data);
        expect(result).toEqual(expected);
    });

    it('saveDocuments should delegate to super.saveDocuments', async () => {
        const docs = [{ a: 1 }, { b: 2 }];
        const expected = [{ id: 'r7' }, { id: 'r8' }];
        const spy = jest
        .spyOn(AbstractService.prototype, 'saveDocuments')
        .mockResolvedValue(expected);

        const result = await svc.saveDocuments(docs);
        expect(spy).toHaveBeenCalledWith(docs);
        expect(result).toEqual(expected);
    });

    it('deleteDocument should delegate to super.deleteDocument', async () => {
        const filter = { id: 'r9' };
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

        const result = await svc.deleteDocumentById('r10');
        expect(spy).toHaveBeenCalledWith('r10');
        expect(result).toEqual(expected);
    });

    it('deleteDocuments should delegate to super.deleteDocuments', async () => {
        const filter = { obsolete: true };
        const expected = { deletedCount: 2 };
        const spy = jest
        .spyOn(AbstractService.prototype, 'deleteDocuments')
        .mockResolvedValue(expected);

        const result = await svc.deleteDocuments(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });

    it('getDocumentsByCustomFiltersQuery should delegate to super.getDocumentsByCustomFiltersQuery', () => {
        const filter = { archived: false };
        const expected = { query: true };
        const spy = jest
        .spyOn(AbstractService.prototype, 'getDocumentsByCustomFiltersQuery')
        .mockReturnValue(expected);

        const result = svc.getDocumentsByCustomFiltersQuery(filter);
        expect(spy).toHaveBeenCalledWith(filter);
        expect(result).toEqual(expected);
    });
});