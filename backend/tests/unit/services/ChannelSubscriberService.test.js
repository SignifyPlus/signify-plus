const ChannelSubscriberService = require("../../../services/ChannelSubscriberService");

describe("ChannelSubscriberService", () => {
    let service;
    let mockModel;

    beforeEach(() => {
        mockModel = {};
        service = new ChannelSubscriberService(mockModel);

        //mocking inherited AbstractService methods
        service.__proto__.getDocuments = jest.fn(() => Promise.resolve("all docs"));
        service.__proto__.getDocumentById = jest.fn(() => Promise.resolve("doc by id"));
        service.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered docs"));
        service.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("single filtered doc"));
        service.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated doc"));
        service.__proto__.saveDocument = jest.fn(() => Promise.resolve("saved doc"));
        service.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["doc1", "doc2"]));
        service.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted doc"));
        service.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted by id"));
        service.__proto__.deleteDocuments = jest.fn(() => Promise.resolve({ deletedCount: 3 }));
        service.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "query object");
    });

    test("getDocuments calls super.getDocuments", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all docs");
        expect(service.__proto__.getDocuments).toHaveBeenCalled();
    });

    test("getDocumentById calls super.getDocumentById", async () => {
        const result = await service.getDocumentById("id123");
        expect(result).toBe("doc by id");
        expect(service.__proto__.getDocumentById).toHaveBeenCalledWith("id123");
    });

    test("getDocumentsByCustomFilters calls super.getDocumentsByCustomFilters", async () => {
        const filters = { status: "active" };
        const result = await service.getDocumentsByCustomFilters(filters);
        expect(result).toBe("filtered docs");
        expect(service.__proto__.getDocumentsByCustomFilters).toHaveBeenCalledWith(filters);
    });

    test("getDocumentByCustomFilters calls super.getDocumentByCustomFilters", async () => {
        const filters = { id: "123" };
        const result = await service.getDocumentByCustomFilters(filters);
        expect(result).toBe("single filtered doc");
        expect(service.__proto__.getDocumentByCustomFilters).toHaveBeenCalledWith(filters);
    });

    test("updateDocument calls super.updateDocument", async () => {
        const filters = { id: "1" };
        const updates = { status: "updated" };
        const result = await service.updateDocument(filters, updates);
        expect(result).toBe("updated doc");
        expect(service.__proto__.updateDocument).toHaveBeenCalledWith(filters, updates);
    });

    test("saveDocument calls super.saveDocument", async () => {
        const data = { channel: "abc" };
        const result = await service.saveDocument(data);
        expect(result).toBe("saved doc");
        expect(service.__proto__.saveDocument).toHaveBeenCalledWith(data);
    });

    test("saveDocuments calls super.saveDocuments", async () => {
        const data = [{}, {}];
        const result = await service.saveDocuments(data);
        expect(result).toEqual(["doc1", "doc2"]);
        expect(service.__proto__.saveDocuments).toHaveBeenCalledWith(data);
    });

    test("deleteDocument calls super.deleteDocument", async () => {
        const filters = { user: "xyz" };
        const result = await service.deleteDocument(filters);
        expect(result).toBe("deleted doc");
        expect(service.__proto__.deleteDocument).toHaveBeenCalledWith(filters);
    });

    test("deleteDocumentById calls super.deleteDocumentById", async () => {
        const result = await service.deleteDocumentById("delete-id");
        expect(result).toBe("deleted by id");
        expect(service.__proto__.deleteDocumentById).toHaveBeenCalledWith("delete-id");
    });

    test("deleteDocuments calls super.deleteDocuments", async () => {
        const filters = { channel: "bulk" };
        const result = await service.deleteDocuments(filters);
        expect(result).toEqual({ deletedCount: 3 });
        expect(service.__proto__.deleteDocuments).toHaveBeenCalledWith(filters);
    });

    test("getDocumentsByCustomFiltersQuery calls super.getDocumentsByCustomFiltersQuery", () => {
        const filters = { name: "query" };
        const result = service.getDocumentsByCustomFiltersQuery(filters);
        expect(result).toBe("query object");
        expect(service.__proto__.getDocumentsByCustomFiltersQuery).toHaveBeenCalledWith(filters);
    });
});