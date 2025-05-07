const ChannelService = require("../../../services/ChannelService");

describe("ChannelService Unit Tests", () => {
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

        service = new ChannelService(mockModel);
    });

    it("should get all documents", async () => {
        mockModel.find.mockResolvedValue(["doc1"]);
        const result = await service.getDocuments();
        expect(result).toEqual(["doc1"]);
    });

    it("should get document by ID", async () => {
        mockModel.findById.mockResolvedValue("channel123");
        const result = await service.getDocumentById("channel123");
        expect(result).toBe("channel123");
        expect(mockModel.findById).toHaveBeenCalledWith("channel123");
    });

    it("should get documents by custom filters", async () => {
        mockModel.find.mockResolvedValue(["filtered"]);
        const result = await service.getDocumentsByCustomFilters({ name: "general" });
        expect(result).toEqual(["filtered"]);
        expect(mockModel.find).toHaveBeenCalledWith({ name: "general" });
    });

    it("should get a single document by custom filter", async () => {
        mockModel.findOne.mockResolvedValue("one-doc");
        const result = await service.getDocumentByCustomFilters({ isPrivate: true });
        expect(result).toBe("one-doc");
        expect(mockModel.findOne).toHaveBeenCalledWith({ isPrivate: true });
    });

    it("should update a document", async () => {
        mockModel.findOneAndUpdate.mockResolvedValue("updated");
        const result = await service.updateDocument({ id: 1 }, { name: "New" });
        expect(result).toBe("updated");
        expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith({ id: 1 }, { name: "New" }, { new: true });
    });

    it("should save a single document", async () => {
        mockModel.create.mockResolvedValue([{ id: "123" }]);
        const result = await service.saveDocument({ name: "Channel A" });
        expect(result).toEqual([{ id: "123" }]);
        expect(mockModel.create).toHaveBeenCalledWith([{ name: "Channel A" }]);
    });

    it("should save multiple documents", async () => {
        mockModel.insertMany.mockResolvedValue(["docA", "docB"]);
        const result = await service.saveDocuments([{ a: 1 }, { b: 2 }]);
        expect(result).toEqual(["docA", "docB"]);
    });

    it("should delete a single document by condition", async () => {
        mockModel.findOneAndDelete.mockResolvedValue("deletedDoc");
        const result = await service.deleteDocument({ id: 2 });
        expect(result).toBe("deletedDoc");
        expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({ id: 2 }, { new: true });
    });

    it("should delete a document by ID", async () => {
        mockModel.findOneAndDelete.mockResolvedValue("deletedById");
        const result = await service.deleteDocumentById("abc");
        expect(result).toBe("deletedById");
        expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({ _id: "abc" }, { new: true });
    });

    it("should delete multiple documents", async () => {
        mockModel.deleteMany.mockResolvedValue({ deletedCount: 3 });
        const result = await service.deleteDocuments({ status: "inactive" });
        expect(result).toEqual({ deletedCount: 3 });
    });

    it("should return query object for custom filter query", () => {
        mockModel.find.mockReturnValue("queryObject");
        const result = service.getDocumentsByCustomFiltersQuery({ active: true });
        expect(result).toBe("queryObject");
    });
});