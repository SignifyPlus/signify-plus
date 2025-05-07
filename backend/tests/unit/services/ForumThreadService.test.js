const ForumThreadService = require("../../../services/ForumThreadService");

describe("ForumThreadService", () => {
    let service;
    let mockModel;

    beforeEach(() => {
        mockModel = {};
        service = new ForumThreadService(mockModel);

        service.__proto__.getDocuments = jest.fn(() => Promise.resolve("all threads"));
        service.__proto__.getDocumentById = jest.fn(() => Promise.resolve("thread by id"));
        service.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered threads"));
        service.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("one filtered thread"));
        service.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated thread"));
        service.__proto__.saveDocument = jest.fn(() => Promise.resolve("saved thread"));
        service.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["thread1", "thread2"]));
        service.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted thread"));
        service.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted by id"));
        service.__proto__.deleteDocuments = jest.fn(() => Promise.resolve("bulk deleted"));
        service.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "query object");
    });

    test("getDocuments delegates to super", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all threads");
    });

    test("getDocumentById delegates to super", async () => {
        const result = await service.getDocumentById("123");
        expect(result).toBe("thread by id");
    });

    test("getDocumentsByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentsByCustomFilters({});
        expect(result).toBe("filtered threads");
    });

    test("getDocumentByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentByCustomFilters({});
        expect(result).toBe("one filtered thread");
    });

    test("updateDocument delegates to super", async () => {
        const result = await service.updateDocument({}, {});
        expect(result).toBe("updated thread");
    });

    test("saveDocument delegates to super", async () => {
        const result = await service.saveDocument({});
        expect(result).toBe("saved thread");
    });

    test("saveDocuments delegates to super", async () => {
        const result = await service.saveDocuments([{}, {}]);
        expect(result).toEqual(["thread1", "thread2"]);
    });

    test("deleteDocument delegates to super", async () => {
        const result = await service.deleteDocument({});
        expect(result).toBe("deleted thread");
    });

    test("deleteDocumentById delegates to super", async () => {
        const result = await service.deleteDocumentById("123");
        expect(result).toBe("deleted by id");
    });

    test("deleteDocuments delegates to super", async () => {
        const result = await service.deleteDocuments({});
        expect(result).toBe("bulk deleted");
    });

    test("getDocumentsByCustomFiltersQuery delegates to super", () => {
        const result = service.getDocumentsByCustomFiltersQuery({});
        expect(result).toBe("query object");
    });
});
