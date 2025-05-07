const MediaService = require("../../../services/MediaService");

// Mock schema model methods
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

describe("MediaService Unit Tests", () => {
    let service;

    beforeEach(() => {
        service = new MediaService(mockModel);
    });

    test("getDocuments should call model.find", async () => {
        mockModel.find.mockResolvedValue(["doc1", "doc2"]);
        const result = await service.getDocuments();
        expect(result).toEqual(["doc1", "doc2"]);
        expect(mockModel.find).toHaveBeenCalled();
    });

    test("getDocumentById should call model.findById", async () => {
        mockModel.findById.mockResolvedValue("doc");
        const result = await service.getDocumentById("123");
        expect(result).toBe("doc");
        expect(mockModel.findById).toHaveBeenCalledWith("123");
    });

    test("getDocumentsByCustomFilters should call model.find with filters", async () => {
        mockModel.find.mockResolvedValue(["filtered"]);
        const result = await service.getDocumentsByCustomFilters({ type: "video" });
        expect(result).toEqual(["filtered"]);
        expect(mockModel.find).toHaveBeenCalledWith({ type: "video" });
    });

    test("getDocumentByCustomFilters should call model.findOne with filters", async () => {
        mockModel.findOne.mockResolvedValue("one");
        const result = await service.getDocumentByCustomFilters({ id: "abc" });
        expect(result).toBe("one");
        expect(mockModel.findOne).toHaveBeenCalledWith({ id: "abc" });
    });

    test("updateDocument should call model.findOneAndUpdate with filters and update", async () => {
        mockModel.findOneAndUpdate.mockResolvedValue("updated");
        const result = await service.updateDocument({ id: 1 }, { name: "New" });
        expect(result).toBe("updated");
        expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith({ id: 1 }, { name: "New" }, { new: true });
    });

    test("saveDocument should call model.create", async () => {
        mockModel.create.mockResolvedValue(["newDoc"]);
        const result = await service.saveDocument({ name: "test" });
        expect(result).toEqual(["newDoc"]);
        expect(mockModel.create).toHaveBeenCalledWith([{ name: "test" }]);
    });

    test("saveDocuments should call model.insertMany", async () => {
        mockModel.insertMany.mockResolvedValue(["doc1", "doc2"]);
        const result = await service.saveDocuments([{ name: "a" }, { name: "b" }]);
        expect(result).toEqual(["doc1", "doc2"]);
        expect(mockModel.insertMany).toHaveBeenCalledWith([{ name: "a" }, { name: "b" }]);
    });

    test("deleteDocument should call model.findOneAndDelete", async () => {
        mockModel.findOneAndDelete.mockResolvedValue("deleted");
        const result = await service.deleteDocument({ id: 2 });
        expect(result).toBe("deleted");
        expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({ id: 2 }, { new: true });
    });

    test("deleteDocumentById should call model.findOneAndDelete with _id", async () => {
        mockModel.findOneAndDelete.mockResolvedValue("deletedById");
        const result = await service.deleteDocumentById("xyz");
        expect(result).toBe("deletedById");
        expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({ _id: "xyz" }, { new: true });
    });

    test("deleteDocuments should call model.deleteMany", async () => {
        mockModel.deleteMany.mockResolvedValue({ deletedCount: 2 });
        const result = await service.deleteDocuments({ user: "u1" });
        expect(result).toEqual({ deletedCount: 2 });
        expect(mockModel.deleteMany).toHaveBeenCalledWith({ user: "u1" });
    });

    test("getDocumentsByCustomFiltersQuery should call model.find and return query", () => {
        mockModel.find.mockReturnValue("queryObject");
        const result = service.getDocumentsByCustomFiltersQuery({ category: "image" });
        expect(result).toBe("queryObject");
        expect(mockModel.find).toHaveBeenCalledWith({ category: "image" });
    });
});
