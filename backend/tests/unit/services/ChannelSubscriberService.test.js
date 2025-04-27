const ChannelSubscriberService = require("../../../services/ChannelSubscriberService");

describe("ChannelSubscriberService Unit Tests", () => {
    let mockModel;
    let service;

    beforeEach(() => {
        mockModel = {
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            insertMany: jest.fn(),
            findOneAndDelete: jest.fn(),
            deleteMany: jest.fn()
        };

        service = new ChannelSubscriberService(mockModel);
    });

    test("getDocuments should call model.find", async () => {
        mockModel.find.mockResolvedValue(["doc1"]);
        const result = await service.getDocuments();
        expect(result).toEqual(["doc1"]);
        expect(mockModel.find).toHaveBeenCalled();
    });

    test("getDocumentById should call model.findById", async () => {
        mockModel.findById.mockResolvedValue("doc");
        const result = await service.getDocumentById("id123");
        expect(result).toBe("doc");
        expect(mockModel.findById).toHaveBeenCalledWith("id123");
    });

    test("getDocumentsByCustomFilters should call model.find", async () => {
        const filters = { status: "active" };
        mockModel.find.mockResolvedValue(["filtered"]);
        const result = await service.getDocumentsByCustomFilters(filters);
        expect(result).toEqual(["filtered"]);
        expect(mockModel.find).toHaveBeenCalledWith(filters);
    });

    test("getDocumentByCustomFilters should call model.findOne", async () => {
        const filters = { id: "123" };
        mockModel.findOne.mockResolvedValue("one");
        const result = await service.getDocumentByCustomFilters(filters);
        expect(result).toBe("one");
        expect(mockModel.findOne).toHaveBeenCalledWith(filters);
    });

    test("updateDocument should call model.findOneAndUpdate", async () => {
        const filters = { id: "1" };
        const updates = { status: "updated" };
        mockModel.findOneAndUpdate.mockResolvedValue("updated");
        const result = await service.updateDocument(filters, updates);
        expect(result).toBe("updated");
        expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(filters, updates, { new: true });
    });

    test("saveDocument should call model.create", async () => {
        const data = { channel: "abc" };
        mockModel.create.mockResolvedValue([data]);
        const result = await service.saveDocument(data);
        expect(result).toEqual([data]);
        expect(mockModel.create).toHaveBeenCalledWith([data]);
    });

    test("saveDocuments should call model.insertMany", async () => {
        const data = [{}, {}];
        mockModel.insertMany.mockResolvedValue(["doc1", "doc2"]);
        const result = await service.saveDocuments(data);
        expect(result).toEqual(["doc1", "doc2"]);
    });

    test("deleteDocument should call model.findOneAndDelete", async () => {
        const filters = { user: "xyz" };
        mockModel.findOneAndDelete.mockResolvedValue("deleted doc");
        const result = await service.deleteDocument(filters);
        expect(result).toBe("deleted doc");
        expect(mockModel.findOneAndDelete).toHaveBeenCalledWith(filters, { new: true });
    });

    test("deleteDocumentById should call model.findOneAndDelete with _id", async () => {
        mockModel.findOneAndDelete.mockResolvedValue("deleted by id");
        const result = await service.deleteDocumentById("delete-id");
        expect(result).toBe("deleted by id");
        expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({ _id: "delete-id" }, { new: true });
    });

    test("deleteDocuments should call model.deleteMany", async () => {
        const filters = { channel: "bulk" };
        mockModel.deleteMany.mockResolvedValue({ deletedCount: 3 });
        const result = await service.deleteDocuments(filters);
        expect(result).toEqual({ deletedCount: 3 });
    });

    test("getDocumentsByCustomFiltersQuery should call model.find and return the query", () => {
        const filters = { name: "query" };
        mockModel.find.mockReturnValue("query object");
        const result = service.getDocumentsByCustomFiltersQuery(filters);
        expect(result).toBe("query object");
        expect(mockModel.find).toHaveBeenCalledWith(filters);
    });
});