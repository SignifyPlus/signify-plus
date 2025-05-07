const CommentService = require("../../../services/CommentService");

describe("CommentService", () => {
    let service;
    let mockModel;

    beforeEach(() => {
        mockModel = {};
        service = new CommentService(mockModel);
        jest.clearAllMocks();

        //mocking inherited AbstractService methods
        service.__proto__.getDocuments = jest.fn(() => Promise.resolve("all comments"));
        service.__proto__.getDocumentById = jest.fn(() => Promise.resolve("comment by id"));
        service.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered comments"));
        service.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("single filtered comment"));
        service.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated comment"));
        service.__proto__.saveDocument = jest.fn(() => Promise.resolve("saved comment"));
        service.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["comment1", "comment2"]));
        service.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted comment"));
        service.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted by id"));
        service.__proto__.deleteDocuments = jest.fn(() => Promise.resolve("bulk deleted"));
        service.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "query object");
        service.__proto__.getDocumentsQuery = jest.fn(() => "base query");
    });

    test("getDocuments delegates to super", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all comments");
    });

    test("getDocumentById delegates to super", async () => {
        const result = await service.getDocumentById("id1");
        expect(result).toBe("comment by id");
    });

    test("getDocumentsByCustomFilters delegates to super", async () => {
        const filters = { status: "visible" };
        const result = await service.getDocumentsByCustomFilters(filters);
        expect(result).toBe("filtered comments");
    });

    test("getDocumentByCustomFilters delegates to super", async () => {
        const filters = { id: "abc" };
        const result = await service.getDocumentByCustomFilters(filters);
        expect(result).toBe("single filtered comment");
    });

    test("updateDocument delegates to super", async () => {
        const filters = { id: "abc" };
        const update = { content: "Updated!" };
        const result = await service.updateDocument(filters, update);
        expect(result).toBe("updated comment");
    });

    test("saveDocument delegates to super", async () => {
        const data = { content: "Nice post!" };
        const result = await service.saveDocument(data);
        expect(result).toBe("saved comment");
    });

    test("saveDocuments delegates to super", async () => {
        const data = [{}, {}];
        const result = await service.saveDocuments(data);
        expect(result).toEqual(["comment1", "comment2"]);
    });

    test("deleteDocument delegates to super", async () => {
        const filters = { postId: "xyz" };
        const result = await service.deleteDocument(filters);
        expect(result).toBe("deleted comment");
    });

    test("deleteDocumentById delegates to super", async () => {
        const result = await service.deleteDocumentById("id123");
        expect(result).toBe("deleted by id");
    });

    test("deleteDocuments delegates to super", async () => {
        const result = await service.deleteDocuments({ postId: "abc" });
        expect(result).toBe("bulk deleted");
    });

    test("getDocumentsByCustomFiltersQuery delegates to super", () => {
        const result = service.getDocumentsByCustomFiltersQuery({ flagged: true });
        expect(result).toBe("query object");
    });

    test("getDocumentsQuery delegates to super", () => {
        const result = service.getDocumentsQuery();
        expect(result).toBe("base query");
    });
});