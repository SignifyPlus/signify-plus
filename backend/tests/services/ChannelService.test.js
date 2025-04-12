const ChannelService = require("../../services/ChannelService");

describe("ChannelService", () => {
    let service;
    let mockModel;

    beforeEach(() => {
        mockModel = {};
        service = new ChannelService(mockModel);

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
        const filters = { name: "test" };
        const result = await service.getDocumentsByCustomFilters(filters);
        expect(result).toBe("filtered docs");
        expect(service.__proto__.getDocumentsByCustomFilters).toHaveBeenCalledWith(filters);
    });

    test("getDocumentByCustomFilters calls super.getDocumentByCustomFilters", async () => {
        const filters = { name: "single" };
        const result = await service.getDocumentByCustomFilters(filters);
        expect(result).toBe("single filtered doc");
        expect(service.__proto__.getDocumentByCustomFilters).toHaveBeenCalledWith(filters);
    });

    test("updateDocument calls super.updateDocument", async () => {
        const result = await service.updateDocument({ id: "1" }, { name: "updated" });
        expect(result).toBe("updated doc");
        expect(service.__proto__.updateDocument).toHaveBeenCalledWith({ id: "1" }, { name: "updated" });
    });

    test("saveDocument calls super.saveDocument", async () => {
        const data = { name: "channel" };
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
        const result = await service.deleteDocument({ id: "del" });
        expect(result).toBe("deleted doc");
        expect(service.__proto__.deleteDocument).toHaveBeenCalledWith({ id: "del" });
    });

    test("deleteDocumentById calls super.deleteDocumentById", async () => {
        const result = await service.deleteDocumentById("id123");
        expect(result).toBe("deleted by id");
        expect(service.__proto__.deleteDocumentById).toHaveBeenCalledWith("id123");
    });

    test("deleteDocuments calls super.deleteDocuments", async () => {
        const result = await service.deleteDocuments({ name: "bulk" });
        expect(result).toEqual({ deletedCount: 2 });
        expect(service.__proto__.deleteDocuments).toHaveBeenCalledWith({ name: "bulk" });
    });

    test("getDocumentsByCustomFiltersQuery calls super.getDocumentsByCustomFiltersQuery", () => {
        const query = service.getDocumentsByCustomFiltersQuery({ name: "query" });
        expect(query).toBe("query object");
        expect(service.__proto__.getDocumentsByCustomFiltersQuery).toHaveBeenCalledWith({ name: "query" });
    });
});
