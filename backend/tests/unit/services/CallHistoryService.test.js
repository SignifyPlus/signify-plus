const CallHistoryService = require("../../../services/CallHistoryService");

describe("CallHistoryService", () => {
    let service;
    let mockModel;

    beforeEach(() => {
        mockModel = {};
        service = new CallHistoryService(mockModel);
        jest.clearAllMocks();

        service.schemaModel = {};
        service.__proto__.getDocuments = jest.fn(() => Promise.resolve("all docs"));
        service.__proto__.getDocumentById = jest.fn(() => Promise.resolve("doc by id"));
        service.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered docs"));
        service.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("single filtered doc"));
        service.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated doc"));
        service.__proto__.saveDocument = jest.fn(() => Promise.resolve("saved doc"));
        service.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["doc1", "doc2"]));
        service.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted doc"));
        service.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted by id"));
        service.__proto__.deleteDocuments = jest.fn(() => Promise.resolve({ deletedCount: 2 }));
        service.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "query object");
    });

    test("getDocuments calls super.getDocuments", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all docs");
        expect(service.__proto__.getDocuments).toHaveBeenCalled();
    });

    test("getDocumentById calls super.getDocumentById", async () => {
        const result = await service.getDocumentById("123");
        expect(result).toBe("doc by id");
        expect(service.__proto__.getDocumentById).toHaveBeenCalledWith("123");
    });

    test("getDocumentsByCustomFilters calls super.getDocumentsByCustomFilters", async () => {
        const filters = { type: "video" };
        const result = await service.getDocumentsByCustomFilters(filters);
        expect(result).toBe("filtered docs");
        expect(service.__proto__.getDocumentsByCustomFilters).toHaveBeenCalledWith(filters);
    });

    test("getDocumentByCustomFilters calls super.getDocumentByCustomFilters", async () => {
        const filters = { status: "missed" };
        const result = await service.getDocumentByCustomFilters(filters);
        expect(result).toBe("single filtered doc");
        expect(service.__proto__.getDocumentByCustomFilters).toHaveBeenCalledWith(filters);
    });

    test("updateDocument calls super.updateDocument", async () => {
        const result = await service.updateDocument({ id: "1" }, { status: "done" });
        expect(result).toBe("updated doc");
        expect(service.__proto__.updateDocument).toHaveBeenCalledWith({ id: "1" }, { status: "done" });
    });

    test("saveDocument calls super.saveDocument", async () => {
        const data = { caller: "user1" };
        const result = await service.saveDocument(data);
        expect(result).toBe("saved doc");
        expect(service.__proto__.saveDocument).toHaveBeenCalledWith(data);
    });

    test("saveDocuments calls super.saveDocuments", async () => {
        const docs = [{}, {}];
        const result = await service.saveDocuments(docs);
        expect(result).toEqual(["doc1", "doc2"]);
        expect(service.__proto__.saveDocuments).toHaveBeenCalledWith(docs);
    });

    test("deleteDocument calls super.deleteDocument", async () => {
        const result = await service.deleteDocument({ status: "missed" });
        expect(result).toBe("deleted doc");
        expect(service.__proto__.deleteDocument).toHaveBeenCalledWith({ status: "missed" });
    });

    test("deleteDocumentById calls super.deleteDocumentById", async () => {
        const result = await service.deleteDocumentById("id123");
        expect(result).toBe("deleted by id");
        expect(service.__proto__.deleteDocumentById).toHaveBeenCalledWith("id123");
    });

    test("deleteDocuments calls super.deleteDocuments", async () => {
        const result = await service.deleteDocuments({ type: "video" });
        expect(result).toEqual({ deletedCount: 2 });
        expect(service.__proto__.deleteDocuments).toHaveBeenCalledWith({ type: "video" });
    });

    test("getDocumentsByCustomFiltersQuery calls super.getDocumentsByCustomFiltersQuery", () => {
        const query = service.getDocumentsByCustomFiltersQuery({ active: true });
        expect(query).toBe("query object");
        expect(service.__proto__.getDocumentsByCustomFiltersQuery).toHaveBeenCalledWith({ active: true });
    });
});