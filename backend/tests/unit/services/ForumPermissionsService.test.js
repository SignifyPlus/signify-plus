const ForumPermissionsService = require("../../../services/ForumPermissionsService");

describe("ForumPermissionsService", () => {
    let service;
    let mockModel;

    beforeEach(() => {
        mockModel = {};
        service = new ForumPermissionsService(mockModel);
        jest.clearAllMocks();

        service.__proto__.__proto__.getDocuments = jest.fn(() => Promise.resolve("all permissions"));
        service.__proto__.__proto__.getDocumentById = jest.fn(() => Promise.resolve("permission by id"));
        service.__proto__.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered permissions"));
        service.__proto__.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("one filtered permission"));
        service.__proto__.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated permission"));
        service.__proto__.__proto__.saveDocument = jest.fn(() => Promise.resolve("saved permission"));
        service.__proto__.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["perm1", "perm2"]));
        service.__proto__.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted permission"));
        service.__proto__.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted by id"));
        service.__proto__.__proto__.deleteDocuments = jest.fn(() => Promise.resolve("bulk deleted"));
        service.__proto__.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "query object");
    });

    test("getDocuments delegates to super", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all permissions");
    });

    test("getDocumentById delegates to super", async () => {
        const result = await service.getDocumentById("id123");
        expect(result).toBe("permission by id");
    });

    test("getDocumentsByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentsByCustomFilters({ forumId: "xyz" });
        expect(result).toBe("filtered permissions");
    });

    test("getDocumentByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentByCustomFilters({ userId: "abc" });
        expect(result).toBe("one filtered permission");
    });

    test("updateDocument delegates to super", async () => {
        const result = await service.updateDocument({ id: "1" }, { canPost: true });
        expect(result).toBe("updated permission");
    });

    test("saveDocument delegates to super", async () => {
        const result = await service.saveDocument({ forumId: "123", userId: "456" });
        expect(result).toBe("saved permission");
    });

    test("saveDocuments delegates to super", async () => {
        const result = await service.saveDocuments([{ a: 1 }, { b: 2 }]);
        expect(result).toEqual(["perm1", "perm2"]);
    });

    test("deleteDocument delegates to super", async () => {
        const result = await service.deleteDocument({ id: "1" });
        expect(result).toBe("deleted permission");
    });

    test("deleteDocumentById delegates to super", async () => {
        const result = await service.deleteDocumentById("abc123");
        expect(result).toBe("deleted by id");
    });

    test("deleteDocuments delegates to super", async () => {
        const result = await service.deleteDocuments({ forumId: "123" });
        expect(result).toBe("bulk deleted");
    });

    test("getDocumentsByCustomFiltersQuery delegates to super", () => {
        const result = service.getDocumentsByCustomFiltersQuery({ forumId: "123" });
        expect(result).toBe("query object");
    });
});
