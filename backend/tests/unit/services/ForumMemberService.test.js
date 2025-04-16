const ForumMemberService = require("../../../services/ForumMemberService");

describe("ForumMemberService", () => {
    let service;
    let mockModel;

    beforeEach(() => {
        mockModel = {};
        service = new ForumMemberService(mockModel);
        jest.clearAllMocks();

        service.__proto__.__proto__.getDocuments = jest.fn(() => Promise.resolve("all members"));
        service.__proto__.__proto__.getDocumentById = jest.fn(() => Promise.resolve("member by id"));
        service.__proto__.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered members"));
        service.__proto__.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("one filtered member"));
        service.__proto__.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated member"));
        service.__proto__.__proto__.saveDocument = jest.fn(() => Promise.resolve("saved member"));
        service.__proto__.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["member1", "member2"]));
        service.__proto__.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted member"));
        service.__proto__.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted by id"));
        service.__proto__.__proto__.deleteDocuments = jest.fn(() => Promise.resolve("bulk deleted"));
        service.__proto__.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "query object");
        service.__proto__.__proto__.getDocumentsQuery = jest.fn(() => "base query");
    });

    test("getDocuments delegates to super", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all members");
    });

    test("getDocumentById delegates to super", async () => {
        const result = await service.getDocumentById("id123");
        expect(result).toBe("member by id");
    });

    test("getDocumentsByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentsByCustomFilters({ active: true });
        expect(result).toBe("filtered members");
    });

    test("getDocumentByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentByCustomFilters({ userId: "abc" });
        expect(result).toBe("one filtered member");
    });

    test("updateDocument delegates to super", async () => {
        const result = await service.updateDocument({ id: "1" }, { status: "updated" });
        expect(result).toBe("updated member");
    });

    test("saveDocument delegates to super", async () => {
        const result = await service.saveDocument({ forumId: "123", userId: "456" });
        expect(result).toBe("saved member");
    });

    test("saveDocuments delegates to super", async () => {
        const result = await service.saveDocuments([{ a: 1 }, { b: 2 }]);
        expect(result).toEqual(["member1", "member2"]);
    });

    test("deleteDocument delegates to super", async () => {
        const result = await service.deleteDocument({ id: "1" });
        expect(result).toBe("deleted member");
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
        const result = service.getDocumentsByCustomFiltersQuery({ status: "active" });
        expect(result).toBe("query object");
    });

    test("getDocumentsQuery delegates to super", () => {
        const result = service.getDocumentsQuery();
        expect(result).toBe("base query");
    });
});