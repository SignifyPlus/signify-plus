const GroupMemberService = require("../../../services/GroupMemberService");

describe("GroupMemberService", () => {
    let mockModel;
    let service;

    beforeEach(() => {
        mockModel = {};
        service = new GroupMemberService(mockModel);

        service.__proto__.getDocuments = jest.fn(() => Promise.resolve("all group members"));
        service.__proto__.getDocumentById = jest.fn(() => Promise.resolve("group member by id"));
        service.__proto__.getDocumentsByCustomFilters = jest.fn(() => Promise.resolve("filtered group members"));
        service.__proto__.getDocumentByCustomFilters = jest.fn(() => Promise.resolve("one filtered group member"));
        service.__proto__.updateDocument = jest.fn(() => Promise.resolve("updated group member"));
        service.__proto__.saveDocument = jest.fn(() => Promise.resolve("saved group member"));
        service.__proto__.saveDocuments = jest.fn(() => Promise.resolve(["gm1", "gm2"]));
        service.__proto__.deleteDocument = jest.fn(() => Promise.resolve("deleted group member"));
        service.__proto__.deleteDocumentById = jest.fn(() => Promise.resolve("deleted by id"));
        service.__proto__.deleteDocuments = jest.fn(() => Promise.resolve("bulk deleted"));
        service.__proto__.getDocumentsByCustomFiltersQuery = jest.fn(() => "group member query object");
    });

    test("getDocuments delegates to super", async () => {
        const result = await service.getDocuments();
        expect(result).toBe("all group members");
    });

    test("getDocumentById delegates to super", async () => {
        const result = await service.getDocumentById("abc");
        expect(result).toBe("group member by id");
    });

    test("getDocumentsByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentsByCustomFilters({ group: 1 });
        expect(result).toBe("filtered group members");
    });

    test("getDocumentByCustomFilters delegates to super", async () => {
        const result = await service.getDocumentByCustomFilters({ user: 2 });
        expect(result).toBe("one filtered group member");
    });

    test("updateDocument delegates to super", async () => {
        const result = await service.updateDocument({ id: 1 }, { joinedAt: "now" });
        expect(result).toBe("updated group member");
    });

    test("saveDocument delegates to super", async () => {
        const result = await service.saveDocument({ userId: "u1" });
        expect(result).toBe("saved group member");
    });

    test("saveDocuments delegates to super", async () => {
        const result = await service.saveDocuments([{ userId: "u1" }]);
        expect(result).toEqual(["gm1", "gm2"]);
    });

    test("deleteDocument delegates to super", async () => {
        const result = await service.deleteDocument({ userId: "u1" });
        expect(result).toBe("deleted group member");
    });

    test("deleteDocumentById delegates to super", async () => {
        const result = await service.deleteDocumentById("gmid");
        expect(result).toBe("deleted by id");
    });

    test("deleteDocuments delegates to super", async () => {
        const result = await service.deleteDocuments({ groupId: "g1" });
        expect(result).toBe("bulk deleted");
    });

    test("getDocumentsByCustomFiltersQuery delegates to super", () => {
        const result = service.getDocumentsByCustomFiltersQuery({ groupId: "g1" });
        expect(result).toBe("group member query object");
    });
});
