const ForumService = require("../../../services/ForumService");

describe("ForumService", () => {
    let service;
    let mockModel;

    beforeEach(() => {
        mockModel = {};
        service = new ForumService(mockModel);
        jest.clearAllMocks();

        service.__proto__.__proto__.getDocuments = jest.fn(() => Promise.resolve("all forums"));
        service.__proto__.__proto__.getDocumentById = jest.fn(() => Promise.resolve("forum by id"));
        service.__proto__.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered forums"));
        service.__proto__.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("one filtered forum"));
        service.__proto__.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated forum"));
        service.__proto__.__proto__.saveDocument = jest.fn(() => Promise.resolve("saved forum"));
        service.__proto__.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["forum1", "forum2"]));
        service.__proto__.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted forum"));
        service.__proto__.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted by id"));
        service.__proto__.__proto__.deleteDocuments = jest.fn(() => Promise.resolve("bulk deleted"));
        service.__proto__.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "query object");
    });

    test("getDocuments delegates to super", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all forums");
    });

    test("getDocumentById delegates to super", async () => {
        const result = await service.getDocumentById("abc");
        expect(result).toBe("forum by id");
    });

    test("getDocumentsByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentsByCustomFilters({ category: "news" });
        expect(result).toBe("filtered forums");
    });

    test("getDocumentByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentByCustomFilters({ forumId: "xyz" });
        expect(result).toBe("one filtered forum");
    });

    test("updateDocument delegates to super", async () => {
        const result = await service.updateDocument({ _id: "1" }, { name: "Updated" });
        expect(result).toBe("updated forum");
    });

    test("saveDocument delegates to super", async () => {
        const result = await service.saveDocument({ name: "New Forum" });
        expect(result).toBe("saved forum");
    });

    test("saveDocuments delegates to super", async () => {
        const result = await service.saveDocuments([{ name: "Forum 1" }, { name: "Forum 2" }]);
        expect(result).toEqual(["forum1", "forum2"]);
    });

    test("deleteDocument delegates to super", async () => {
        const result = await service.deleteDocument({ name: "Obsolete" });
        expect(result).toBe("deleted forum");
    });

    test("deleteDocumentById delegates to super", async () => {
        const result = await service.deleteDocumentById("forum123");
        expect(result).toBe("deleted by id");
    });

    test("deleteDocuments delegates to super", async () => {
        const result = await service.deleteDocuments({ category: "archived" });
        expect(result).toBe("bulk deleted");
    });

    test("getDocumentsByCustomFiltersQuery delegates to super", () => {
        const result = service.getDocumentsByCustomFiltersQuery({ category: "tech" });
        expect(result).toBe("query object");
    });
});
