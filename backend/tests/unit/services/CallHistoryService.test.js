const CallHistoryService = require("../../../services/CallHistoryService");

// Create a mock schema model
const mockModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    create: jest.fn(),
    insertMany: jest.fn(),
    findOneAndDelete: jest.fn(),
    deleteMany: jest.fn()
};

describe("CallHistoryService - Full Unit Test", () => {
    let service;

    beforeEach(() => {
        service = new CallHistoryService(mockModel);
        jest.clearAllMocks();
    });

    test("getDocuments should call model.find", async () => {
        mockModel.find.mockResolvedValue(["doc1", "doc2"]);
        const result = await service.getDocuments();
        expect(result).toEqual(["doc1", "doc2"]);
        expect(mockModel.find).toHaveBeenCalled();
    });

    test("getDocumentById should call model.findById", async () => {
        mockModel.findById.mockResolvedValue("doc by id");
        const result = await service.getDocumentById("123");
        expect(result).toBe("doc by id");
        expect(mockModel.findById).toHaveBeenCalledWith("123");
    });

    test("getDocumentsByCustomFilters should call model.find with filters", async () => {
        const filters = { type: "video" };
        mockModel.find.mockResolvedValue(["filtered docs"]);
        const result = await service.getDocumentsByCustomFilters(filters);
        expect(result).toEqual(["filtered docs"]);
        expect(mockModel.find).toHaveBeenCalledWith(filters);
    });

    test("getDocumentByCustomFilters should call model.findOne with filters", async () => {
        const filters = { status: "missed" };
        mockModel.findOne.mockResolvedValue("single filtered doc");
        const result = await service.getDocumentByCustomFilters(filters);
        expect(result).toBe("single filtered doc");
        expect(mockModel.findOne).toHaveBeenCalledWith(filters);
    });

    test("updateDocument should call model.findOneAndUpdate with filters and updates", async () => {
        mockModel.findOneAndUpdate.mockResolvedValue("updated doc");
        const result = await service.updateDocument({ id: 1 }, { status: "done" });
        expect(result).toBe("updated doc");
        expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith({ id: 1 }, { status: "done" }, { new: true });
    });

    test("saveDocument should call model.create", async () => {
        mockModel.create.mockResolvedValue("saved doc");
        const result = await service.saveDocument({ caller: "user1" });
        expect(result).toBe("saved doc");
        expect(mockModel.create).toHaveBeenCalledWith([{ caller: "user1" }]);
    });

    test("saveDocuments should call model.insertMany", async () => {
        const docs = [{}, {}];
        mockModel.insertMany.mockResolvedValue(["doc1", "doc2"]);
        const result = await service.saveDocuments(docs);
        expect(result).toEqual(["doc1", "doc2"]);
        expect(mockModel.insertMany).toHaveBeenCalledWith(docs);
    });

    test("deleteDocument should call model.findOneAndDelete with filter", async () => {
        mockModel.findOneAndDelete.mockResolvedValue("deleted doc");
        const result = await service.deleteDocument({ status: "missed" });
        expect(result).toBe("deleted doc");
        expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({ status: "missed" }, { new: true });
    });

    test("deleteDocumentById should call model.findOneAndDelete with _id", async () => {
        mockModel.findOneAndDelete.mockResolvedValue("deleted by id");
        const result = await service.deleteDocumentById("id123");
        expect(result).toBe("deleted by id");
        expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({ _id: "id123" }, { new: true });
    });

    test("deleteDocuments should call model.deleteMany with filter", async () => {
        mockModel.deleteMany.mockResolvedValue({ deletedCount: 2 });
        const result = await service.deleteDocuments({ type: "video" });
        expect(result).toEqual({ deletedCount: 2 });
        expect(mockModel.deleteMany).toHaveBeenCalledWith({ type: "video" });
    });

    test("getDocumentsByCustomFiltersQuery should return the query object", () => {
        mockModel.find.mockReturnValue("query object");
        const query = service.getDocumentsByCustomFiltersQuery({ active: true });
        expect(query).toBe("query object");
        expect(mockModel.find).toHaveBeenCalledWith({ active: true });
    });
});